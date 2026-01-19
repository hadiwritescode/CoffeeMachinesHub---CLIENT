import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { DollarSign, ShoppingBag, Users, TrendingUp, Coffee } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center space-x-4">
    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{title}</p>
      <h3 className="text-3xl font-serif font-bold text-nomad-black">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { orders, products } = useStore();
  
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(o => o.status === 'Processing').length;

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold text-nomad-black mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back, here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
         <StatCard title="Total Revenue" value={`Rs. ${totalRevenue.toLocaleString()}`} icon={DollarSign} color="bg-green-500" />
         <StatCard title="Total Orders" value={orders.length} icon={ShoppingBag} color="bg-nomad-gold" />
         <StatCard title="Products" value={products.length} icon={Coffee} color="bg-nomad-black" />
         <StatCard title="Pending" value={activeOrders} icon={TrendingUp} color="bg-orange-500" />
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
         <h2 className="text-2xl font-serif font-bold text-nomad-black mb-6">Recent Activity</h2>
         <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-100">
                  <th className="pb-4 pl-4">Order ID</th>
                  <th className="pb-4">Customer</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                    <td className="py-4 pl-4 font-bold text-nomad-black">{order.id}</td>
                    <td className="py-4 text-gray-600">{order.customerName}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'Processing' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-nomad-black">Rs. {order.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;