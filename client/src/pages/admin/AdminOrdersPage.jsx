import React, { useState, useEffect } from 'react';
import { ShoppingBag, Eye, Search, MapPin, Phone, User, Package, X, Loader2 } from 'lucide-react';
import { orderApi } from '../../api/orderApi';
import StatusBadge from '../../components/admin/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected order for detailed modal view
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getAdminOrders();
      setOrders(res.data || []);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch platform orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatusId(orderId);
      const res = await orderApi.updateOrderStatus(orderId, newStatus);
      toast.success(res.message || `Order status updated to ${newStatus}`);

      // Update state locally
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl m-0">
              Orders Fulfillment
            </h1>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {orders.length} orders
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Monitor incoming Cash on Delivery orders and advance shipment statuses.
          </p>
        </div>
      </div>

      {/* Control Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, customer name or email..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <Loader text="Loading orders..." />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={searchTerm || statusFilter !== 'all' ? 'No orders match filters' : 'No orders placed yet'}
          description={
            searchTerm || statusFilter !== 'all'
              ? 'Try clearing the search query or status filter.'
              : 'Customer orders will appear here as soon as they complete Cash on Delivery checkout.'
          }
          actionLabel={searchTerm || statusFilter !== 'all' ? 'Reset Filters' : undefined}
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
          }}
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Order ID</th>
                  <th scope="col" className="px-6 py-4">Customer</th>
                  <th scope="col" className="px-6 py-4">Items</th>
                  <th scope="col" className="px-6 py-4">Total Amount</th>
                  <th scope="col" className="px-6 py-4">Date</th>
                  <th scope="col" className="px-6 py-4">Status & Action</th>
                  <th scope="col" className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => {
                  const itemCount = order.products?.reduce(
                    (acc, p) => acc + (p.quantity || 1),
                    0
                  ) || 1;

                  return (
                    <tr key={order._id} className="hover:bg-slate-50/60 transition">
                      <td className="px-6 py-4 font-mono font-medium text-xs text-indigo-600">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            {order.user?.name || order.shippingAddress?.name || 'Customer'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {order.user?.email || 'Guest checkout'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold">
                          {itemCount} {itemCount === 1 ? 'item' : 'items'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        ${Number(order.totalAmount).toFixed(2)}
                        <span className="ml-1 text-[11px] font-normal text-slate-400">COD</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={order.status}
                            disabled={updatingStatusId === order._id}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="rounded-lg border border-slate-300 bg-white py-1 px-2.5 text-xs font-medium text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            {STATUS_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                          {updatingStatusId === order._id && (
                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Order #{selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}
                    </h3>
                    <StatusBadge status={selectedOrder.status} size="small" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status updater inside modal */}
            <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Update Fulfillment Status:
              </span>
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                className="rounded-lg border border-slate-300 bg-white py-1.5 px-3 text-xs font-semibold text-slate-800 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Customer & Shipping Details */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <User className="h-4 w-4 text-indigo-600" />
                  Customer Information
                </h4>
                <div className="mt-3 space-y-1 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">
                    {selectedOrder.shippingAddress?.name || selectedOrder.user?.name}
                  </p>
                  <p className="text-xs text-slate-500">{selectedOrder.user?.email || 'demo@ecommerce.com'}</p>
                  <p className="flex items-center gap-1.5 text-xs text-slate-600 pt-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" />
                    {selectedOrder.shippingAddress?.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-4 bg-white">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  Shipping Address (COD)
                </h4>
                <div className="mt-3 space-y-1 text-sm text-slate-700">
                  <p className="text-slate-800">{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-slate-600">
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.pincode}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Cash on Delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Line items table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Purchased Items Breakdown
              </h4>
              <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                {selectedOrder.products?.map((item, idx) => {
                  const productObj = item.product || {};
                  return (
                    <div key={idx} className="flex items-center justify-between p-3.5 bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={productObj.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                          alt={productObj.name || 'Product'}
                          className="h-12 w-12 rounded-lg object-cover border border-slate-100 bg-slate-50 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {productObj.name || 'Catalog Item'}
                          </p>
                          <p className="text-xs text-slate-500">
                            Qty: <span className="font-semibold text-slate-700">{item.quantity}</span> × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex items-center justify-between bg-slate-50/80 px-4 py-3 border-t border-slate-200">
                  <span className="font-bold text-slate-900 text-sm">Grand Total (COD)</span>
                  <span className="text-lg font-extrabold text-indigo-600">
                    ${Number(selectedOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
