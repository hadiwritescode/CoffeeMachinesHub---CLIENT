
import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Search, Star, X, Upload, Loader2, Minus, Link as LinkIcon, Image as ImageIcon, Heart, Check } from 'lucide-react';
import { Product, Feature } from '../../types';

const ChevronIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
    </svg>
);

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
  const [activeTab, setActiveTab] = useState<'info' | 'features'>('info');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

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
    category: '', // Will default to first available category on open if empty
    tags: [],
    description: '',
    soldOut: false,
    isFeatured: false,
    isRecommended: false,
    features: []
  };

  const getDefaultFeatures = (category: string, prod: Product): Feature[] => {
      if (category === 'Coffee') {
          return [
            { title: 'Roast Profile', icon: 'flame', content: prod.roastLevel ? `${prod.roastLevel} roast.` : 'Expertly roasted.' },
            { title: 'Origin & Sourcing', icon: 'map', content: prod.origin || 'Sustainably sourced.' },
            { title: 'Tasting Notes', icon: 'droplet', content: prod.subtitle || 'Rich and complex.' },
            { title: 'Brewing Recommendations', icon: 'coffee', content: '1:16 ratio recommended.' }
          ];
      }
      return [
        { title: 'Premium Build Quality', icon: 'shield', content: 'Constructed with high-grade materials.' },
        { title: 'Precision Performance', icon: 'settings', content: 'Engineered for consistency.' },
        { title: 'Design & Aesthetics', icon: 'award', content: 'Thoughtful design.' },
        { title: 'Warranty & Support', icon: 'box', content: 'Manufacturer warranty included.' }
      ];
  };

  const handleOpenModal = (product: Product | null) => {
    setActiveTab('info');
    setGalleryUrlInput('');
    if (product) {
      // Logic to pre-fill features if they are empty, so admin can edit the defaults
      const features = (product.features && product.features.length > 0) 
        ? product.features 
        : getDefaultFeatures(product.category || 'Machines', product);

      setEditingProduct({ ...product, images: product.images || [], features });
      
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
      // Set default category to the first one available to avoid blank dropdowns
      const defaultCategory = allCategories.length > 0 ? allCategories[0].title : 'Machines';
      setEditingProduct({
          ...newProduct,
          category: defaultCategory,
          features: getDefaultFeatures(defaultCategory, newProduct)
      });
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
            // If main image is empty, set first uploaded as main
            const newMain = !editingProduct.image && urls.length > 0 ? urls[0] : editingProduct.image;
            
            setEditingProduct(prev => prev ? { ...prev, images: [...currentImages, ...urls], image: newMain } : null);
        } else {
            const url = await uploadFile(files[0], 'products');
            setEditingProduct(prev => prev ? { ...prev, image: url } : null);
        }
    } catch (error: any) {
        console.error("Upload failed", error);
        alert(`Image upload failed: ${error.message || "Unknown error"}. Check if Storage is enabled in Firebase Console.`);
    } finally {
        setIsUploading(false);
        e.target.value = '';
    }
  };

  const addGalleryUrl = () => {
      if (galleryUrlInput && editingProduct) {
          const newImages = [...(editingProduct.images || []), galleryUrlInput];
          // If main image is empty, use this one
          const newMain = !editingProduct.image ? galleryUrlInput : editingProduct.image;
          
          setEditingProduct({
              ...editingProduct,
              images: newImages,
              image: newMain
          });
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

  const setMainImageFromGallery = (url: string) => {
    if (!editingProduct) return;
    setEditingProduct({ ...editingProduct, image: url });
  }

  // Feature Management
  const addFeature = () => {
    if (!editingProduct) return;
    setEditingProduct({
        ...editingProduct,
        features: [...(editingProduct.features || []), { title: '', content: '', icon: 'settings' }]
    });
  };
  const updateFeature = (idx: number, field: keyof Feature, val: string) => {
    if (!editingProduct) return;
    const newFeatures = [...(editingProduct.features || [])];
    newFeatures[idx] = { ...newFeatures[idx], [field]: val };
    setEditingProduct({ ...editingProduct, features: newFeatures });
  };
  const removeFeature = (idx: number) => {
    if (!editingProduct) return;
    setEditingProduct({
        ...editingProduct,
        features: (editingProduct.features || []).filter((_, i) => i !== idx)
    });
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
    // Sync main image into gallery if not present
    if (finalProduct.image && (!finalProduct.images || !finalProduct.images.includes(finalProduct.image))) {
        finalProduct.images = [finalProduct.image, ...(finalProduct.images || [])];
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
               
               <div className="flex gap-4 mb-6 border-b border-gray-200">
                   <button 
                     onClick={() => setActiveTab('info')} 
                     className={`pb-2 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'info' ? 'border-nomad-gold text-nomad-black' : 'border-transparent text-gray-400'}`}
                   >
                       Basic Info
                   </button>
                   <button 
                     onClick={() => setActiveTab('features')} 
                     className={`pb-2 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'features' ? 'border-nomad-gold text-nomad-black' : 'border-transparent text-gray-400'}`}
                   >
                       Features / Specs
                   </button>
               </div>

               <form onSubmit={handleSave} className="space-y-6">
                  {activeTab === 'info' && (
                      <>
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
                                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Sub-Type</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none bg-white appearance-none" 
                                            value={selectedSubcategory} 
                                            onChange={e => setSelectedSubcategory(e.target.value)}
                                        >
                                            <option value="">None</option>
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

                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                className="flex items-center gap-3 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setEditingProduct({...editingProduct, soldOut: !editingProduct.soldOut})}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editingProduct.soldOut ? 'bg-red-500 border-red-500' : 'border-gray-300'}`}>
                                    {editingProduct.soldOut && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-600">Mark as Sold Out</span>
                            </div>
                            
                            <div 
                                className="flex items-center gap-3 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setEditingProduct({...editingProduct, isFeatured: !editingProduct.isFeatured})}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editingProduct.isFeatured ? 'bg-nomad-gold border-nomad-gold' : 'border-gray-300'}`}>
                                    {editingProduct.isFeatured && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-600">Featured (Home)</span>
                            </div>

                            <div 
                                className="flex items-center gap-3 border border-gray-200 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors col-span-2 md:col-span-2"
                                onClick={() => setEditingProduct({...editingProduct, isRecommended: !editingProduct.isRecommended})}
                            >
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editingProduct.isRecommended ? 'bg-green-600 border-green-600' : 'border-gray-300'}`}>
                                    {editingProduct.isRecommended && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm font-medium text-gray-600">Recommended (Show in Cart Suggestions)</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Short Description</label>
                            <textarea 
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none transition-all" 
                                rows={3}
                                value={editingProduct.description} 
                                onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Subtitle / Flavor Notes</label>
                            <input 
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none transition-all" 
                                value={editingProduct.subtitle || ''} 
                                onChange={e => setEditingProduct({...editingProduct, subtitle: e.target.value})} 
                                placeholder="e.g. Dual Boiler Technology"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Price (PKR)</label>
                            <input 
                                type="number"
                                className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none transition-all" 
                                value={editingProduct.price} 
                                onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})} 
                            />
                        </div>

                        {/* Image Upload Section */}
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-nomad-gold mb-4">Media Gallery</h3>
                            
                            {/* Main Image Preview */}
                            <div className="mb-6 flex gap-6 items-start">
                                <div className="shrink-0">
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Main Image</label>
                                    <div className="w-24 h-24 bg-white rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center relative group">
                                        {editingProduct.image ? (
                                            <img src={editingProduct.image} className="w-full h-full object-cover" alt="Main" />
                                        ) : (
                                            <ImageIcon className="text-gray-300" />
                                        )}
                                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                            <Upload className="text-white w-6 h-6" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, false)} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex-grow">
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Add to Gallery</label>
                                    <div className="flex gap-2 mb-2">
                                        <label className={`flex-1 flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                            <span className="text-sm text-gray-500">Upload Images</span>
                                            <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, true)} />
                                        </label>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative flex-grow">
                                            <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                className="w-full border border-gray-200 p-2 pl-9 rounded-xl text-sm"
                                                placeholder="Paste image URL..."
                                                value={galleryUrlInput}
                                                onChange={(e) => setGalleryUrlInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addGalleryUrl())}
                                            />
                                        </div>
                                        <button type="button" onClick={addGalleryUrl} className="bg-gray-200 text-gray-700 px-4 rounded-xl font-bold text-xs hover:bg-gray-300">Add</button>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery Grid */}
                            {editingProduct.images && editingProduct.images.length > 0 && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2">Gallery ({editingProduct.images.length})</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                        {editingProduct.images.map((img, idx) => (
                                            <div key={idx} className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden relative group">
                                                <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <button type="button" onClick={() => setMainImageFromGallery(img)} className="text-[10px] bg-white text-black px-2 py-1 rounded shadow hover:bg-nomad-gold hover:text-white uppercase font-bold">Set Main</button>
                                                    <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"><Trash size={12} /></button>
                                                </div>
                                                {img === editingProduct.image && (
                                                    <div className="absolute top-1 right-1 bg-nomad-gold text-white text-[9px] font-bold px-1.5 rounded-sm shadow-sm">MAIN</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                      </>
                  )}

                  {activeTab === 'features' && (
                      <div className="space-y-4">
                          {(editingProduct.features || []).map((feature, idx) => (
                              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-4 items-start group">
                                  <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <input 
                                        placeholder="Feature Title" 
                                        className="border border-gray-200 p-2 rounded-lg text-sm font-bold"
                                        value={feature.title}
                                        onChange={e => updateFeature(idx, 'title', e.target.value)}
                                      />
                                      <select 
                                        className="border border-gray-200 p-2 rounded-lg text-sm bg-white"
                                        value={feature.icon}
                                        onChange={e => updateFeature(idx, 'icon', e.target.value)}
                                      >
                                          <option value="settings">Settings (Gear)</option>
                                          <option value="flame">Flame (Roast)</option>
                                          <option value="droplet">Droplet (Taste)</option>
                                          <option value="map">Map (Origin)</option>
                                          <option value="shield">Shield (Quality)</option>
                                          <option value="coffee">Coffee Cup</option>
                                          <option value="award">Award</option>
                                          <option value="box">Box (Warranty)</option>
                                      </select>
                                      <textarea 
                                        placeholder="Feature Description" 
                                        className="border border-gray-200 p-2 rounded-lg text-sm sm:col-span-2"
                                        rows={2}
                                        value={feature.content}
                                        onChange={e => updateFeature(idx, 'content', e.target.value)}
                                      />
                                  </div>
                                  <button type="button" onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500 self-center p-2"><Trash size={18} /></button>
                              </div>
                          ))}
                          <button type="button" onClick={addFeature} className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-nomad-gold hover:text-nomad-gold transition-colors font-bold uppercase text-xs flex items-center justify-center gap-2">
                              <Plus size={16} /> Add Feature
                          </button>
                      </div>
                  )}

                  <div className="pt-6 border-t border-gray-100 flex gap-4 sticky bottom-0 bg-white pb-2">
                      <button type="submit" className="flex-1 bg-nomad-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors shadow-lg">
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
