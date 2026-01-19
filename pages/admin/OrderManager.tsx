import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();

  const statuses: Order['status'][] = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-serif font-bold text-nomad-black mb-8">Order Management</h1>
      
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
            <thead className="bg-gray-50">
            <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{order.id}</td>
                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                    <td className="px-6 py-4">
                        <div className="font-medium text-nomad-black">{order.customerName}</div>
                        <div className="text-xs text-gray-400">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">Rs. {order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                        order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                        }`}>
                        {order.status}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="text-xs border border-gray-200 rounded-lg p-2 focus:outline-none focus:border-nomad-black"
                        >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default OrderManager;