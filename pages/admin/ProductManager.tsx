import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Search } from 'lucide-react';
import { Product } from '../../types';

const ProductManager: React.FC = () => {
  const { products, setProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Product Template
  const newProduct: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    category: 'Coffee',
    tags: [],
    description: '',
    soldOut: false
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (products.some(p => p.id === editingProduct.id)) {
        // Update existing
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    } else {
        // Create new
        const p = { ...editingProduct, id: editingProduct.title.toLowerCase().replace(/\s+/g, '-') };
        setProducts([p, ...products]);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filtered = products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <AdminLayout>
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nomad-black">Products</h1>
          <button 
            onClick={() => { setEditingProduct(newProduct); setIsModalOpen(true); }}
            className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors"
          >
            <Plus size={18} /> Add Product
          </button>
       </div>

       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-nomad-gold/20"
                />
             </div>
          </div>
          <table className="w-full">
             <thead className="bg-gray-50">
                <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                   <th className="px-6 py-4">Image</th>
                   <th className="px-6 py-4">Name</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Price</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
                {filtered.map(product => (
                   <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                         <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      </td>
                      <td className="px-6 py-4 font-bold text-nomad-black">{product.title}</td>
                      <td className="px-6 py-4 text-gray-500">{product.category}</td>
                      <td className="px-6 py-4 text-gray-500">Rs. {product.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                         <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-nomad-black"><Edit size={18} /></button>
                         <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                      </td>
                   </tr>
                ))}
             </tbody>
          </table>
       </div>

       {/* Edit Modal */}
       {isModalOpen && editingProduct && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
               <h2 className="text-2xl font-bold mb-6">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
               <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                    <input className="w-full border p-2 rounded-lg" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price</label>
                        <input type="number" className="w-full border p-2 rounded-lg" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category</label>
                        <select className="w-full border p-2 rounded-lg" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                            <option>Coffee</option>
                            <option>Gear</option>
                            <option>Merchandise</option>
                        </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
                    <input className="w-full border p-2 rounded-lg" value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                    <textarea className="w-full border p-2 rounded-lg" rows={4} value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button type="submit" className="flex-1 bg-nomad-black text-white py-3 rounded-xl font-bold uppercase">Save</button>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold uppercase">Cancel</button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default ProductManager;