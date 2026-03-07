import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { Eye, X } from 'lucide-react';

const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
                    <td className="px-6 py-4">
                        <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className={`text-xs border rounded-lg p-2 focus:outline-none focus:border-nomad-black font-bold uppercase tracking-wider ${
                                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.status === 'Processing' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                                'bg-gray-50 text-gray-700 border-gray-200'
                            }`}
                        >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </td>
                    <td className="px-6 py-4">
                        <button 
                            onClick={() => setSelectedOrder(order)}
                            className="flex items-center gap-2 text-sm text-nomad-gold font-bold uppercase hover:text-nomad-black transition-colors"
                        >
                            <Eye size={16} /> View Details
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
                 <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                     <div>
                         <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Details</span>
                         <h2 className="text-2xl font-serif font-bold text-nomad-black">{selectedOrder.id}</h2>
                     </div>
                     <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
                 </div>

                 <div className="space-y-6">
                     <div>
                         <h3 className="text-sm font-bold uppercase tracking-wider text-nomad-gold mb-2">Customer Info</h3>
                         <div className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
                             <p><span className="font-bold">Name:</span> {selectedOrder.customerName}</p>
                             <p><span className="font-bold">Email:</span> {selectedOrder.email}</p>
                             <p><span className="font-bold">Phone:</span> {selectedOrder.phone || 'N/A'}</p>
                             <p><span className="font-bold">Address:</span> {selectedOrder.address || 'N/A'}</p>
                         </div>
                     </div>

                     <div>
                         <h3 className="text-sm font-bold uppercase tracking-wider text-nomad-gold mb-2">Order Items</h3>
                         <div className="border border-gray-100 rounded-xl overflow-hidden">
                             {selectedOrder.items.map((item, idx) => (
                                 <div key={idx} className="flex justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                     <div>
                                         <p className="font-bold text-nomad-black">{item.productTitle}</p>
                                         <p className="text-xs text-gray-400">ID: {item.productId}</p>
                                     </div>
                                     <div className="font-mono font-medium">x{item.quantity}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                     
                     <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                         <span className="font-bold text-gray-500">Status</span>
                         <span className="px-3 py-1 bg-nomad-black text-white rounded-full text-xs font-bold uppercase">{selectedOrder.status}</span>
                     </div>
                 </div>
             </div>
          </div>
      )}
    </AdminLayout>
  );
};

export default OrderManager;