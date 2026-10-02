import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  Package,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ShoppingBag,
} from 'lucide-react';

const STATUS_CONFIGS = {
  Pending: {
    bg: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
  },
  Confirmed: {
    bg: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
  },
  Shipped: {
    bg: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck,
  },
  Delivered: {
    bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle,
  },
  Cancelled: {
    bg: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: XCircle,
  },
};

export const MyOrdersPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getMyOrders();
        setOrders(res || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <Loader message="Fetching your order history..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          Customer Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
          My Order History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review previous purchases, shipping destinations, and real-time delivery statuses
        </p>
      </div>

      {/* Orders List */}
      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No Orders Found"
          description="You haven’t placed any orders yet. Discover our curated collections and place your first order with Cash on Delivery."
          actionText="Start Shopping"
          onAction={() => (window.location.href = '/products')}
        />
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusConfig = STATUS_CONFIGS[order.status] || STATUS_CONFIGS.Pending;
            const StatusIcon = statusConfig.icon;
            const formattedDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recent';

            return (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-subtle overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-mono font-bold text-slate-700">
                        Order #{order._id}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Placed on {formattedDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      <span>{order.status}</span>
                    </div>

                    {/* Total Amount */}
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Total
                      </span>
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        ${Number(order.totalAmount).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Body: Products list & Shipping Address */}
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Products breakdown */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Items Ordered ({order.products?.length || 0})
                    </h3>

                    <div className="divide-y divide-slate-100">
                      {order.products?.map((item, idx) => {
                        const prod = item.product || {};
                        return (
                          <div
                            key={idx}
                            className="py-3 first:pt-0 last:pb-0 flex items-center gap-4"
                          >
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'}
                              alt={prod.name || 'Product'}
                              className="w-14 h-14 rounded-xl object-cover bg-slate-100 border border-slate-200/60 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                {prod.name || 'E-Commerce Product'}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Qty: {item.quantity} × ${Number(item.price || prod.price || 0).toFixed(2)}
                              </p>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 shrink-0">
                              ${(item.quantity * Number(item.price || prod.price || 0)).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Shipping Address snapshot */}
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span>Delivery Address</span>
                      </div>
                      <div className="text-xs text-slate-600 space-y-1">
                        <p className="font-bold text-slate-900">
                          {order.shippingAddress?.name || user?.name || 'Customer'}
                        </p>
                        <p>{order.shippingAddress?.address || '742 Evergreen Terrace'}</p>
                        <p>
                          {order.shippingAddress?.city || 'Springfield'},{' '}
                          {order.shippingAddress?.pincode || '97477'}
                        </p>
                        <p className="text-slate-500 pt-1">
                          Phone: {order.shippingAddress?.phone || '+1-555-0199'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Payment Method:</span>
                      <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Cash on Delivery (COD)
                      </span>
                    </div>
                  </div>
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
