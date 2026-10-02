import React, { useState, useEffect } from 'react';
import { ShoppingBag, Calendar, MapPin } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import StatusBadge from '../components/admin/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch order history');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl m-0">
          My Order History
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Track the status of your past purchases and shipment progress.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading your orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          description="You haven't placed any orders yet. Discover our catalog and place your first Cash on Delivery order!"
          actionLabel="Explore Catalog"
          actionLink="/products"
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const shortId = order._id.substring(order._id.length - 8).toUpperCase();
            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition hover:shadow-md"
              >
                {/* Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 bg-slate-50/75 p-4 sm:px-6 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      Order #{shortId}
                    </span>
                    <span className="text-xs text-slate-400">|</span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Recent'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <span className="text-sm font-extrabold text-slate-900">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-4 sm:p-6 divide-y divide-slate-100">
                  {order.products?.map((item, index) => {
                    const productObj = item.product || {};
                    return (
                      <div key={index} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <img
                            src={productObj.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                            alt={productObj.name || 'Product'}
                            className="h-14 w-14 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';
                            }}
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {productObj.name || 'Product Item'}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Quantity: <span className="font-semibold text-slate-800">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <span className="text-sm font-bold text-slate-900">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping address footer */}
                <div className="border-t border-slate-100 bg-slate-50/40 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>
                      Delivery Address: <strong>{order.shippingAddress?.address}</strong>, {order.shippingAddress?.city} ({order.shippingAddress?.pincode})
                    </span>
                  </div>
                  <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 self-start sm:self-auto">
                    Cash on Delivery
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
