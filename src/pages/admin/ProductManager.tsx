
import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Search, X, Upload, Loader2, Image as ImageIcon, Flame, MapPin, Droplet, Coffee, ShieldCheck, Settings, Award, Cpu, Wifi, Layers, Thermometer, Box } from 'lucide-react';
import { Product, Feature } from '../../types';

const ChevronIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

// Icon Selector for Features
const ICON_OPTIONS = [
    { value: 'shield', icon: ShieldCheck, label: 'Shield' },
    { value: 'settings', icon: Settings, label: 'Settings' },
    { value: 'award', icon: Award, label: 'Award' },
    { value: 'flame', icon: Flame, label: 'Flame' },
    { value: 'map', icon: MapPin, label: 'Map' },
    { value: 'droplet', icon: Droplet, label: 'Droplet' },
    { value: 'coffee', icon: Coffee, label: 'Coffee' },
    { value: 'cpu', icon: Cpu, label: 'Tech' },
    { value: 'wifi', icon: Wifi, label: 'Wifi' },
    { value: 'thermometer', icon: Thermometer, label: 'Temp' },
    { value: 'box', icon: Box, label: 'Box' },
    { value: 'layers', icon: Layers, label: 'Layers' },
];

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
  
  const newProduct: Product = {
    id: '',
    title: '',
    price: 0,
    image: '',
    images: [],
    category: '',
    tags: [],
    description: '',
    subtitle: '',
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
            // Parallel Uploads
            const uploadPromises = Array.from(files).map(file => uploadFile(file, 'products'));
            const urls = await Promise.all(uploadPromises);
            
            const currentImages = editingProduct.images || [];
            // If no main image exists, use first uploaded one
            const newMain = !editingProduct.image && urls.length > 0 ? urls[0] : editingProduct.image;
            
            setEditingProduct(prev => prev ? { 
                ...prev, 
                images: [...currentImages, ...urls], 
                image: newMain 
            } : null);
        } else {
            // Single Upload (Main Image replacement)
            const url = await uploadFile(files[0], 'products');
            setEditingProduct(prev => prev ? { ...prev, image: url } : null);
        }
    } catch (error: any) {
        console.error("Upload failed", error);
        alert("Upload failed: " + error.message);
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
      if (!editingProduct || !editingProduct.images) return;
      const imageToRemove = editingProduct.images[index];
      const newImages = [...editingProduct.images];
      newImages.splice(index, 1);
      
      let newMain = editingProduct.image;
      // If we deleted the main image, reset it to the first available or empty
      if (editingProduct.image === imageToRemove) {
          newMain = newImages.length > 0 ? newImages[0] : '';
      }
      setEditingProduct({ ...editingProduct, images: newImages, image: newMain });
  };

  const setMainImage = (url: string) => {
      if(editingProduct) setEditingProduct({...editingProduct, image: url});
  };

  // Feature Handlers
  const addFeature = () => {
      if(!editingProduct) return;
      const newFeatures = [...(editingProduct.features || []), { title: 'New Feature', content: 'Description...', icon: 'settings' as any }];
      setEditingProduct({...editingProduct, features: newFeatures});
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
      if(!editingProduct || !editingProduct.features) return;
      const newFeatures = [...editingProduct.features];
      newFeatures[index] = { ...newFeatures[index], [field]: value };
      setEditingProduct({...editingProduct, features: newFeatures});
  };

  const removeFeature = (index: number) => {
      if(!editingProduct || !editingProduct.features) return;
      const newFeatures = editingProduct.features.filter((_, i) => i !== index);
      setEditingProduct({...editingProduct, features: newFeatures});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    let updatedTags = editingProduct.tags || [];
    const allPossibleSubItems = allCategories.flatMap(c => c.items);
    // Remove old subcategories from tags to avoid duplicates/conflicts when switching
    updatedTags = updatedTags.filter(t => !allPossibleSubItems.includes(t));
    if (selectedSubcategory) updatedTags.push(selectedSubcategory);

    let finalProduct = { ...editingProduct, tags: updatedTags };
    
    // Ensure at least one image if gallery has images
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

  // Render Logic
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
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filtered.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4"><img src={product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 shadow-sm" /></td>
                            <td className="px-6 py-4">
                                <div className="font-bold text-nomad-black">{product.title}</div>
                                <div className="text-xs text-gray-400">Rs. {product.price.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-500">{product.category}</td>
                            <td className="px-6 py-4">
                                {product.soldOut ? (
                                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">Sold Out</span>
                                ) : (
                                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-bold">Active</span>
                                )}
                            </td>
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

       {/* Edit Modal */}
       {isModalOpen && editingProduct && (
         <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
               {/* Modal Header */}
               <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                   <div>
                       <h2 className="text-2xl font-serif font-bold text-nomad-black">{editingProduct.id ? 'Edit Product' : 'New Product'}</h2>
                       <div className="flex gap-4 mt-4">
                           <button 
                                onClick={() => setActiveTab('info')}
                                className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === 'info' ? 'border-nomad-gold text-nomad-black' : 'border-transparent text-gray-400'}`}
                           >
                               Basic Info
                           </button>
                           <button 
                                onClick={() => setActiveTab('features')}
                                className={`text-xs font-bold uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === 'features' ? 'border-nomad-gold text-nomad-black' : 'border-transparent text-gray-400'}`}
                           >
                               Features & Specs
                           </button>
                       </div>
                   </div>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24}/></button>
               </div>
               
               <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8 overflow-y-auto">
                  
                  {activeTab === 'info' && (
                      <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Title</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.title} onChange={e => setEditingProduct({...editingProduct, title: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subtitle / Tasting Notes</label>
                                <input className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.subtitle || ''} onChange={e => setEditingProduct({...editingProduct, subtitle: e.target.value})} placeholder="e.g. Nutty, Chocolatey..." />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Category</label>
                                <select className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})}>
                                    {allCategories.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sub-Category</label>
                                <select className="w-full border border-gray-200 p-3 rounded-xl" value={selectedSubcategory} onChange={e => setSelectedSubcategory(e.target.value)}>
                                    <option value="">None</option>
                                    {allCategories.find(c => c.title === editingProduct.category)?.items.map(i => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Price (Rs)</label>
                                <input type="number" className="w-full border border-gray-200 p-3 rounded-xl" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
                            <textarea className="w-full border border-gray-200 p-3 rounded-xl min-h-[100px]" value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                        </div>

                        {/* Media Section */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-4">Media Gallery</h3>
                            
                            {/* Main Image Preview */}
                            <div className="flex gap-6 items-start mb-6">
                                <div className="w-24 h-24 bg-white border rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative group">
                                    {editingProduct.image ? <img src={editingProduct.image} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                                    <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center text-[10px] uppercase font-bold opacity-0 group-hover:opacity-100 transition-opacity">Main Image</div>
                                </div>
                                <div className="flex-grow space-y-3">
                                    <label className="bg-white border px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-50 flex items-center gap-2 w-fit">
                                        {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                                        <span className="text-xs font-bold uppercase">Replace Main Image</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                                    </label>
                                    <input 
                                        className="w-full border p-2 rounded-xl text-xs" 
                                        placeholder="Or Video URL (Hover Effect)" 
                                        value={editingProduct.hoverVideo || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, hoverVideo: e.target.value})} 
                                    />
                                </div>
                            </div>

                            {/* Gallery Grid */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold uppercase text-gray-400">Gallery ({editingProduct.images?.length || 0})</span>
                                    <label className="text-xs font-bold text-nomad-gold cursor-pointer hover:underline flex items-center gap-1">
                                        <Plus size={14} /> Add Photos
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                    </label>
                                </div>
                                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                    {editingProduct.images?.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200 bg-white">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <button type="button" onClick={() => setMainImage(img)} className="text-[9px] bg-white/90 px-2 py-1 rounded uppercase font-bold hover:bg-white">Set Main</button>
                                                <button type="button" onClick={() => removeGalleryImage(idx)} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"><Trash size={12} /></button>
                                            </div>
                                            {editingProduct.image === img && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-nomad-gold text-white text-[8px] text-center font-bold py-0.5">MAIN</div>
                                            )}
                                        </div>
                                    ))}
                                    {/* Empty State / Add Button visual */}
                                    <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-nomad-gold transition-colors text-gray-400 hover:text-nomad-gold">
                                        <Upload size={20} />
                                        <span className="text-[9px] font-bold uppercase mt-1">Upload</span>
                                        <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={editingProduct.isFeatured} onChange={e => setEditingProduct({...editingProduct, isFeatured: e.target.checked})} className="rounded border-gray-300 text-nomad-gold focus:ring-nomad-gold" />
                                Featured (Home)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={editingProduct.isRecommended} onChange={e => setEditingProduct({...editingProduct, isRecommended: e.target.checked})} className="rounded border-gray-300 text-nomad-gold focus:ring-nomad-gold" />
                                Recommended (Cart)
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input type="checkbox" checked={editingProduct.soldOut} onChange={e => setEditingProduct({...editingProduct, soldOut: e.target.checked})} className="rounded border-gray-300 text-red-500 focus:ring-red-500" />
                                Mark Sold Out
                            </label>
                        </div>
                      </div>
                  )}

                  {activeTab === 'features' && (
                      <div className="space-y-4 animate-fade-in">
                          <p className="text-sm text-gray-500 mb-4">Add detailed specifications or features displayed on the product page accordion.</p>
                          
                          {(editingProduct.features || []).map((feature, idx) => {
                              const IconComponent = ICON_OPTIONS.find(i => i.value === feature.icon)?.icon || Settings;
                              return (
                                <div key={idx} className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex gap-4 items-start">
                                    <div className="space-y-2 shrink-0">
                                        <label className="block text-[10px] font-bold uppercase text-gray-400">Icon</label>
                                        <div className="relative">
                                            <select 
                                                className="appearance-none w-12 h-12 flex items-center justify-center border rounded-lg text-center bg-white focus:ring-2 focus:ring-nomad-gold/20"
                                                value={feature.icon}
                                                onChange={e => updateFeature(idx, 'icon', e.target.value)}
                                            >
                                                {ICON_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-nomad-black">
                                                <IconComponent size={20} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow space-y-3">
                                        <div>
                                            <input 
                                                className="w-full border border-gray-200 p-2 rounded-lg text-sm font-bold" 
                                                placeholder="Feature Title"
                                                value={feature.title}
                                                onChange={e => updateFeature(idx, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <textarea 
                                                className="w-full border border-gray-200 p-2 rounded-lg text-sm h-20" 
                                                placeholder="Feature Description..."
                                                value={feature.content}
                                                onChange={e => updateFeature(idx, 'content', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500 p-1"><Trash size={18} /></button>
                                </div>
                              );
                          })}

                          <button 
                            type="button" 
                            onClick={addFeature}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold uppercase text-xs hover:border-nomad-gold hover:text-nomad-gold transition-colors flex items-center justify-center gap-2"
                          >
                              <Plus size={16} /> Add Feature
                          </button>
                      </div>
                  )}

                  <div className="pt-4 border-t border-gray-100">
                    <button type="submit" className="w-full bg-nomad-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors">
                        {editingProduct.id ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default ProductManager;
