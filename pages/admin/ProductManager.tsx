import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Search, Star, X, Upload, Loader2 } from 'lucide-react';
import { Product } from '../../types';

const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, removeProduct, categories, uploadFile } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering State
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');

  // Editing State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // STRICT CATEGORY ENFORCEMENT
  const allCategories = categories; 

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
    images: [],
    category: 'Machines',
    tags: [],
    description: '',
    soldOut: false,
    isFeatured: false
  };

  const handleOpenModal = (product: Product | null) => {
    if (product) {
      setEditingProduct({ ...product, images: product.images || [] });
      const matchedSub = product.tags?.find(t => 
        allCategories.some(c => c.items.includes(t))
      ) || '';
      
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMultiple: boolean = false) => {
    const files = e.target.files;
    if (!files || !editingProduct) return;

    setIsUploading(true);
    try {
        if (isMultiple) {
            const uploadPromises = Array.from(files).map(file => uploadFile(file, 'products'));
            const urls = await Promise.all(uploadPromises);
            setEditingProduct(prev => prev ? { ...prev, images: [...(prev.images || []), ...urls] } : null);
        } else {
            const url = await uploadFile(files[0], 'products');
            setEditingProduct(prev => prev ? { ...prev, image: url } : null);
        }
    } catch (error) {
        console.error("Upload failed", error);
        alert("Image upload failed. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  const removeGalleryImage = (index: number) => {
      if (!editingProduct) return;
      const newImages = [...(editingProduct.images || [])];
      newImages.splice(index, 1);
      setEditingProduct({ ...editingProduct, images: newImages });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedTags = editingProduct.tags || [];

    const allPossibleSubItems = allCategories.flatMap(c => c.items);
    updatedTags = updatedTags.filter(t => !allPossibleSubItems.includes(t));

    if (selectedSubcategory) {
       updatedTags.push(selectedSubcategory);
    }

    // Ensure main image is set if gallery has images but main is empty
    let finalProduct = { ...editingProduct, tags: updatedTags };
    if (!finalProduct.image && finalProduct.images && finalProduct.images.length > 0) {
        finalProduct.image = finalProduct.images[0];
    }

    if (!finalProduct.id) {
        // New Product - Generate Slug ID
        finalProduct.id = finalProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        await addProduct(finalProduct);
    } else {
        await updateProduct(finalProduct);
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await removeProduct(id);
    }
  };

  const toggleFeatured = async (product: Product) => {
      await updateProduct({ ...product, isFeatured: !product.isFeatured });
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.category === filterCategory : true;
    const matchesSubcategory = filterSubcategory ? p.tags?.includes(filterSubcategory) : true;
    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  return (
    <AdminLayout>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-nomad-black">Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage catalog inventory.</p>
          </div>
          <button 
            onClick={() => handleOpenModal(null)}
            className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors w-full md:w-auto justify-center shadow-lg"
          >
            <Plus size={18} /> Add Product
          </button>
       </div>

       {/* Filters Section */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
             <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-nomad-gold/20"
                />
             </div>
             
             <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                 <div className="relative">
                    <select 
                        value={filterCategory}
                        onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(''); }}
                        className="w-full sm:w-auto appearance-none bg-gray-50 border-none rounded-xl px-4 py-3 pr-8 text-sm font-medium min-w-[160px] focus:ring-2 focus:ring-nomad-gold/20 cursor-pointer"
                    >
                        <option value="">All Categories</option>
                        {allCategories.map(c => (
                            <option key={c.title} value={c.title}>{c.title}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronIcon />
                    </div>
                 </div>

                 <div className="relative">
                    <select 
                        value={filterSubcategory}
                        onChange={(e) => setFilterSubcategory(e.target.value)}
                        disabled={!filterCategory}
                        className="w-full sm:w-auto appearance-none bg-gray-50 border-none rounded-xl px-4 py-3 pr-8 text-sm font-medium min-w-[160px] focus:ring-2 focus:ring-nomad-gold/20 disabled:opacity-50 cursor-pointer"
                    >
                        <option value="">All Sub-types</option>
                        {filterSubOptions.map(item => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                     <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronIcon />
                    </div>
                 </div>

                 {(filterCategory || filterSubcategory) && (
                     <button 
                        onClick={() => { setFilterCategory(''); setFilterSubcategory(''); }}
                        className="p-3 text-red-400 hover:bg-red-50 rounded-xl transition-colors flex justify-center items-center"
                        title="Clear Filters"
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
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Sub-Type</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map(product => {
                        const subtype = product.tags?.find(t => 
                            allCategories.find(c => c.title === product.category)?.items.includes(t)
                        ) || '-';

                        return (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm" />
                            </td>
                            <td className="px-6 py-4 font-bold text-nomad-black">{product.title}</td>
                            <td className="px-6 py-4 text-gray-500">
                                <span className="bg-nomad-paper px-3 py-1 rounded-full text-xs font-bold uppercase text-nomad-black tracking-wide border border-nomad-gold/20">{product.category}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-500 text-sm">{subtype}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => toggleFeatured(product)} className={`p-1.5 rounded-full transition-colors ${product.isFeatured ? 'text-nomad-gold bg-yellow-50' : 'text-gray-300 hover:bg-gray-100'}`}>
                                    <Star size={18} fill={product.isFeatured ? 'currentColor' : 'none'} />
                                </button>
                            </td>
                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-nomad-black hover:bg-gray-100 rounded-lg transition-colors"><Edit size={18} /></button>
                                    <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    )})}
                    {filtered.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-16 text-gray-400 italic">
                                No products found matching your criteria.
                            </td>
                        </tr>
                    )}
                </tbody>
              </table>
          </div>
       </div>

       {/* Edit Modal */}
       {isModalOpen && editingProduct && (
         <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-serif font-bold text-nomad-black">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
               </div>
               
               <form onSubmit={handleSave} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                    <input 
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 focus:border-nomad-gold outline-none transition-all" 
                        value={editingProduct.title} 
                        onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} 
                        required 
                        placeholder="e.g. La Marzocco Linea Mini"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-4">Categorization</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Major Category</label>
                            <div className="relative">
                                <select 
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none bg-white appearance-none" 
                                    value={editingProduct.category} 
                                    onChange={e => {
                                        setEditingProduct({...editingProduct, category: e.target.value});
                                        setSelectedSubcategory(''); 
                                    }}
                                >
                                    {allCategories.map(c => (
                                        <option key={c.title} value={c.title}>{c.title}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronIcon />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sub-Category</label>
                             <div className="relative">
                                <select 
                                    className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none bg-white appearance-none" 
                                    value={selectedSubcategory} 
                                    onChange={e => setSelectedSubcategory(e.target.value)}
                                >
                                    <option value="">-- Select Type --</option>
                                    {formSubOptions.map(item => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <ChevronIcon />
                                </div>
                            </div>
                        </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Internal Ref. Price</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none" 
                            value={editingProduct.price} 
                            onChange={e => setEditingProduct({...editingProduct, price: parseInt(e.target.value) || 0})} 
                            placeholder="Not shown on site"
                        />
                        <span className="text-[10px] text-gray-400 mt-1 block">Prices are discussed via WhatsApp. This is for your records.</span>
                    </div>
                    <div>
                         <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Status</label>
                         <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl bg-white">
                             <input 
                                type="checkbox" 
                                checked={editingProduct.soldOut} 
                                onChange={e => setEditingProduct({...editingProduct, soldOut: e.target.checked})} 
                                className="w-5 h-5 text-nomad-gold focus:ring-nomad-gold border-gray-300 rounded"
                             />
                             <span className="text-sm font-medium">Mark as Sold Out</span>
                         </label>
                    </div>
                  </div>

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Main Image</label>
                    <div className="flex items-center gap-4">
                        {editingProduct.image && (
                            <img src={editingProduct.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                        )}
                        <label className={`cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isUploading ? <Loader2 size={16} className="animate-spin text-nomad-gold" /> : <Upload size={16} className="text-gray-500" />}
                            <span className="text-sm font-medium text-gray-600">Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                        </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Gallery Images</label>
                    <div className="flex flex-wrap gap-4 mb-3">
                        {editingProduct.images?.map((img, idx) => (
                            <div key={idx} className="relative group w-20 h-20">
                                <img src={img} alt={`Gallery ${idx}`} className="w-full h-full rounded-xl object-cover border border-gray-200" />
                                <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <label className={`cursor-pointer w-20 h-20 bg-gray-50 border border-dashed border-gray-300 rounded-xl hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-1 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isUploading ? <Loader2 size={20} className="animate-spin text-nomad-gold" /> : <Plus size={20} className="text-gray-400" />}
                            <span className="text-[10px] font-bold uppercase text-gray-400">Add</span>
                            <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(e, true)} />
                        </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                    <textarea 
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none" 
                        rows={4} 
                        value={editingProduct.description} 
                        onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} 
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                     <input 
                        type="checkbox" 
                        checked={editingProduct.isFeatured} 
                        onChange={e => setEditingProduct({...editingProduct, isFeatured: e.target.checked})} 
                        className="w-5 h-5 text-nomad-gold focus:ring-nomad-gold border-gray-300 rounded"
                     />
                     <div>
                        <label className="text-sm font-bold text-nomad-black block">Feature on Home Page</label>
                        <span className="text-xs text-yellow-700">This item will appear in the "Curated Favorites" section.</span>
                     </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                     <button type="submit" disabled={isUploading} className="flex-1 bg-nomad-black text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors shadow-lg disabled:opacity-70">
                        {isUploading ? 'Uploading...' : 'Save Product'}
                     </button>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

const ChevronIcon = () => (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default ProductManager;