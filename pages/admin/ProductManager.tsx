
import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Search, Star, X, Upload, Loader2, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';
import { Product, Feature } from '../../types';

const ChevronIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, removeProduct, categories, uploadFile } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSubcategory, setFilterSubcategory] = useState('');

  // Editing
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(''); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'features'>('info');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const allCategories = categories; 
  const filterSubOptions = allCategories.find(c => c.title === filterCategory)?.items || [];
  const formSubOptions = editingProduct 
    ? allCategories.find(c => c.title === editingProduct.category)?.items || []
    : [];

  const newProduct: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    images: [],
    category: '',
    tags: [],
    description: '',
    soldOut: false,
    isFeatured: false,
    isRecommended: false,
    features: []
  };

  const handleOpenModal = (product: Product | null) => {
    setActiveTab('info');
    setGalleryUrlInput('');
    if (product) {
      setEditingProduct({ ...product, images: product.images || [], features: product.features || [] });
      const matchedSub = product.tags?.find(t => allCategories.some(c => c.items.includes(t))) || '';
      setSelectedSubcategory(matchedSub);
    } else {
      const defaultCategory = allCategories.length > 0 ? allCategories[0].title : 'Machines';
      setEditingProduct({ ...newProduct, category: defaultCategory });
      setSelectedSubcategory('');
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMultiple: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    setIsUploading(true);
    try {
        if (isMultiple) {
            const uploadPromises = Array.from(files).map(file => uploadFile(file, 'products'));
            const urls = await Promise.all(uploadPromises);
            const currentImages = editingProduct.images || [];
            const newMain = !editingProduct.image && urls.length > 0 ? urls[0] : editingProduct.image;
            setEditingProduct(prev => prev ? { ...prev, images: [...currentImages, ...urls], image: newMain } : null);
        } else {
            const url = await uploadFile(files[0], 'products');
            setEditingProduct(prev => prev ? { ...prev, image: url } : null);
        }
    } catch (error: any) {
        console.error("Upload failed", error);
    } finally {
        setIsUploading(false);
        e.target.value = '';
    }
  };

  const addGalleryUrl = () => {
      if (galleryUrlInput && editingProduct) {
          const newImages = [...(editingProduct.images || []), galleryUrlInput];
          const newMain = !editingProduct.image ? galleryUrlInput : editingProduct.image;
          setEditingProduct({ ...editingProduct, images: newImages, image: newMain });
          setGalleryUrlInput('');
      }
  };

  const removeGalleryImage = (index: number) => {
      if (!editingProduct) return;
      const imageToRemove = editingProduct.images![index];
      const newImages = [...(editingProduct.images || [])];
      newImages.splice(index, 1);
      
      let newMain = editingProduct.image;
      if (editingProduct.image === imageToRemove) {
          newMain = newImages.length > 0 ? newImages[0] : '';
      }
      setEditingProduct({ ...editingProduct, images: newImages, image: newMain });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedTags = editingProduct.tags || [];
    const allPossibleSubItems = allCategories.flatMap(c => c.items);
    updatedTags = updatedTags.filter(t => !allPossibleSubItems.includes(t));
    if (selectedSubcategory) updatedTags.push(selectedSubcategory);

    let finalProduct = { ...editingProduct, tags: updatedTags };
    if (!finalProduct.image && finalProduct.images && finalProduct.images.length > 0) {
        finalProduct.image = finalProduct.images[0];
    }

    if (!finalProduct.id) {
        finalProduct.id = finalProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4);
        await addProduct(finalProduct);
    } else {
        await updateProduct(finalProduct);
    }
    
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Render logic remains mostly same, just ensuring handlers are connected
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
          <button onClick={() => handleOpenModal(null)} className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors w-full md:w-auto justify-center shadow-lg"><Plus size={18} /> Add Product</button>
       </div>

       {/* Filters */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
             <div className="relative flex-grow w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-nomad-gold/20" />
             </div>
             <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                 <div className="relative">
                    <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setFilterSubcategory(''); }} className="w-full sm:w-auto appearance-none bg-gray-50 border-none rounded-xl px-4 py-3 pr-8 text-sm font-medium min-w-[160px] focus:ring-2 focus:ring-nomad-gold/20 cursor-pointer">
                        <option value="">All Categories</option>
                        {allCategories.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                    </select>
                    <ChevronIcon />
                 </div>
             </div>
          </div>
       </div>

       {/* Table */}
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50">
                    <tr className="text-left text-xs font-bold uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4"><img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm" /></td>
                            <td className="px-6 py-4 font-bold text-nomad-black">{product.title}</td>
                            <td className="px-6 py-4 text-gray-500">{product.category}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleOpenModal(product)} className="p-2 text-gray-400 hover:text-nomad-black"><Edit size={18} /></button>
                                    <button onClick={() => { if(confirm('Delete?')) removeProduct(product.id) }} className="p-2 text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
              </table>
          </div>
       </div>

       {/* Edit Modal (Simplified for brevity, essential fields) */}
       {isModalOpen && editingProduct && (
         <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
               <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-serif font-bold text-nomad-black">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
               </div>
               
               <form onSubmit={handleSave} className="space-y-6">
                  <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                      <input className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} required />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                      <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                          <select className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                              {allCategories.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Price</label>
                          <input type="number" className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                      </div>
                  </div>

                  {/* Image Upload */}
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-4">Media</h3>
                      <div className="flex gap-4 items-center mb-4">
                          <div className="w-20 h-20 bg-white border rounded-xl overflow-hidden flex items-center justify-center">
                              {editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                          </div>
                          <label className="bg-white border px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-50 flex items-center gap-2">
                              {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                              <span className="text-xs font-bold uppercase">Upload Main</span>
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                          </label>
                      </div>
                      <div className="flex gap-2">
                          <input className="flex-grow border p-2 rounded-xl text-sm" placeholder="Or paste Image URL" value={galleryUrlInput} onChange={e => setGalleryUrlInput(e.target.value)} />
                          <button type="button" onClick={addGalleryUrl} className="bg-gray-200 px-4 rounded-xl font-bold text-xs">Add</button>
                      </div>
                  </div>

                  <button type="submit" className="w-full bg-nomad-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors">
                      {editingProduct.id ? 'Update Product' : 'Create Product'}
                  </button>
               </form>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default ProductManager;
