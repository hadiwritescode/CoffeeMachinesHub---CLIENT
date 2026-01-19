import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Search, Star, Filter, X } from 'lucide-react';
import { Product } from '../../types';

const ProductManager: React.FC = () => {
  const { products, setProducts, categories } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering State
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); // Temp state for form
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine Store Categories with "Coffee" which is often separate
  const allCategories = [
    ...categories, 
    { title: 'Coffee', items: ['Blends', 'Single Origin', 'Espresso', 'Decaf'] },
    { title: 'Gear', items: ['Brewers', 'Grinders', 'Kettles', 'Scales'] } // Fallback generic gear
  ];

  // Derive subcategories based on selection (for Filter)
  const filterSubOptions = allCategories.find(c => c.title === filterCategory)?.items || [];

  // Derive subcategories based on selection (for Form)
  const formSubOptions = editingProduct 
    ? allCategories.find(c => c.title === editingProduct.category)?.items || []
    : [];

  const newProduct: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    category: 'Coffee',
    tags: [],
    description: '',
    soldOut: false,
    isFeatured: false
  };

  const handleOpenModal = (product: Product | null) => {
    if (product) {
      setEditingProduct({ ...product });
      // Try to find a tag that matches one of the known subcategories
      const matchedSub = product.tags?.find(t => 
        allCategories.some(c => c.items.includes(t))
      ) || '';
      // Only set it if it matches the current category's possible items
      const currentCatItems = allCategories.find(c => c.title === product.category)?.items || [];
      if (currentCatItems.includes(matchedSub)) {
         setSelectedSubcategory(matchedSub);
      } else {
         setSelectedSubcategory('');
      }
    } else {
      setEditingProduct(newProduct);
      setSelectedSubcategory('');
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedTags = editingProduct.tags || [];

    // 1. Identify all possible subcategories from ALL categories to clean up old ones
    const allPossibleSubItems = allCategories.flatMap(c => c.items);
    
    // 2. Remove any tags that are known subcategories (to clean slate for hierarchy)
    updatedTags = updatedTags.filter(t => !allPossibleSubItems.includes(t));

    // 3. Add the selected subcategory if one is chosen
    if (selectedSubcategory) {
       updatedTags.push(selectedSubcategory);
    }

    const finalProduct = { ...editingProduct, tags: updatedTags };

    if (products.some(p => p.id === finalProduct.id)) {
        // Update existing
        setProducts(products.map(p => p.id === finalProduct.id ? finalProduct : p));
    } else {
        // Create new
        const p = { 
            ...finalProduct, 
            id: finalProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') 
        };
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

  const toggleFeatured = (product: Product) => {
      const updated = { ...product, isFeatured: !product.isFeatured };
      setProducts(products.map(p => p.id === product.id ? updated : p));
  };

  // Filter Logic
  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    const matchesSubcategory = filterSubcategory ? p.tags?.includes(filterSubcategory) : true;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  return (
    <AdminLayout>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-serif font-bold text-nomad-black">Products</h1>
          <button 
            onClick={() => handleOpenModal(null)}
            className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors w-full md:w-auto justify-center"
          >
            <Plus size={18} /> Add Product
          </button>
       </div>

       {/* Filters Section */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-nomad-gold/20"
                />
             </div>
             
             <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                 {/* Main Category Filter */}
                 <select 
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(''); }}
                    className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium min-w-[140px] focus:ring-2 focus:ring-nomad-gold/20"
                 >
                    <option value="">All Categories</option>
                    {allCategories.map(c => (
                        <option key={c.title} value={c.title}>{c.title}</option>
                    ))}
                 </select>

                 {/* Subcategory Filter (Dependent) */}
                 <select 
                    value={filterSubcategory}
                    onChange={(e) => setFilterSubcategory(e.target.value)}
                    disabled={!filterCategory}
                    className="bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium min-w-[140px] focus:ring-2 focus:ring-nomad-gold/20 disabled:opacity-50"
                 >
                    <option value="">All Sub-types</option>
                    {filterSubOptions.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                 </select>

                 {(filterCategory || filterSubcategory) && (
                     <button 
                        onClick={() => { setFilterCategory(''); setFilterSubcategory(''); }}
                        className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                     >
                         <X size={20} />
                     </button>
                 )}
             </div>
          </div>
       </div>

       {/* Products Table */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Sub-Type</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map(product => {
                        // Determine subtype to display
                        const subtype = product.tags?.find(t => 
                            allCategories.find(c => c.title === product.category)?.items.includes(t)
                        ) || '-';

                        return (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            </td>
                            <td className="px-6 py-4 font-bold text-nomad-black">{product.title}</td>
                            <td className="px-6 py-4 text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold uppercase">{product.category}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{subtype}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => toggleFeatured(product)} className={`p-1 rounded-full ${product.isFeatured ? 'text-nomad-gold bg-yellow-50' : 'text-gray-300'}`}>
                                    <Star size={20} fill={product.isFeatured ? 'currentColor' : 'none'} />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-gray-500">Rs. {product.price.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-nomad-black inline-block"><Edit size={18} /></button>
                                <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 inline-block"><Trash size={18} /></button>
                            </td>
                        </tr>
                    )})}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-12 text-gray-500">No products found matching your filters.</td>
                        </tr>
                    )}
                </tbody>
              </table>
          </div>
       </div>

       {/* Edit Modal */}
       {isModalOpen && editingProduct && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in">
               <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-bold">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
               </div>
               
               <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                    <input 
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none" 
                        value={editingProduct.title} 
                        onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} 
                        required 
                    />
                  </div>
                  
                  {/* Categorization Section */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <h3 className="text-xs font-bold uppercase text-nomad-gold mb-3">Categorization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Major Category</label>
                            <select 
                                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none bg-white" 
                                value={editingProduct.category} 
                                onChange={e => {
                                    setEditingProduct({...editingProduct, category: e.target.value});
                                    setSelectedSubcategory(''); // Reset sub on main change
                                }}
                            >
                                {allCategories.map(c => (
                                    <option key={c.title} value={c.title}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Minor Category (Sub-type)</label>
                            <select 
                                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none bg-white" 
                                value={selectedSubcategory} 
                                onChange={e => setSelectedSubcategory(e.target.value)}
                            >
                                <option value="">-- Select Type --</option>
                                {formSubOptions.map(item => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Price (Rs.)</label>
                        <input 
                            type="number" 
                            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none" 
                            value={editingProduct.price} 
                            onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})} 
                            required 
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Stock Status</label>
                         <div className="flex items-center gap-4 mt-3">
                             <label className="flex items-center gap-2 cursor-pointer">
                                 <input 
                                    type="checkbox" 
                                    checked={editingProduct.soldOut} 
                                    onChange={e => setEditingProduct({...editingProduct, soldOut: e.target.checked})} 
                                 />
                                 <span className="text-sm">Mark as Sold Out</span>
                             </label>
                         </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Image URL</label>
                    <input 
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none" 
                        value={editingProduct.image} 
                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Description</label>
                    <textarea 
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none" 
                        rows={4} 
                        value={editingProduct.description} 
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} 
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                     <input 
                        type="checkbox" 
                        checked={editingProduct.isFeatured} 
                        onChange={e => setEditingProduct({...editingProduct, isFeatured: e.target.checked})} 
                        className="w-4 h-4 text-nomad-gold focus:ring-nomad-gold"
                     />
                     <label className="text-sm font-bold text-nomad-black">Feature this product on Home Page</label>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button type="submit" className="flex-1 bg-nomad-black text-white py-3 rounded-xl font-bold uppercase hover:bg-nomad-gold transition-colors">Save Product</button>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold uppercase hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default ProductManager;