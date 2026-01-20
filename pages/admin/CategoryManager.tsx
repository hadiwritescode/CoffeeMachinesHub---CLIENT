import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, X, Upload, Loader2, Link as LinkIcon, Film, Image as ImageIcon } from 'lucide-react';
import { NavCategory } from '../../types';

const CategoryManager: React.FC = () => {
  const { categories, setCategories, uploadFile } = useStore();
  const [editingCategory, setEditingCategory] = useState<NavCategory | null>(null);
  const [originalTitle, setOriginalTitle] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemInput, setNewItemInput] = useState('');
  const [isUploading, setIsUploading] = useState<'image' | 'video' | null>(null);

  const newCategory: NavCategory = {
    title: '',
    items: [],
    image: '',
    video: ''
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file || !editingCategory) return;

    setIsUploading(type);
    try {
        const url = await uploadFile(file, 'categories');
        setEditingCategory({ ...editingCategory, [type]: url });
    } catch (error) {
        alert(`${type} upload failed.`);
    } finally {
        setIsUploading(null);
    }
  };

  const handleSave = async () => {
    if (!editingCategory || !editingCategory.title) return;
    
    let newCats = [...categories];
    
    if (originalTitle) {
        const index = newCats.findIndex(c => c.title === originalTitle);
        if (index >= 0) {
            newCats[index] = editingCategory;
        }
    } else {
        if (newCats.some(c => c.title === editingCategory.title)) {
            alert('Category with this name already exists');
            return;
        }
        newCats.push(editingCategory);
    }
    
    await setCategories(newCats);
    setIsModalOpen(false);
    setEditingCategory(null);
    setOriginalTitle('');
  };

  const handleDelete = async (title: string) => {
    if (confirm('Delete this category?')) {
        const newCats = categories.filter(c => c.title !== title);
        await setCategories(newCats);
    }
  };

  const addItemToCategory = () => {
    if (newItemInput && editingCategory) {
        setEditingCategory({
            ...editingCategory,
            items: [...editingCategory.items, newItemInput]
        });
        setNewItemInput('');
    }
  };

  const removeItemFromCategory = (idx: number) => {
    if (editingCategory) {
        setEditingCategory({
            ...editingCategory,
            items: editingCategory.items.filter((_, i) => i !== idx)
        });
    }
  };

  const startEdit = (cat: NavCategory) => {
    setEditingCategory({ ...cat }); 
    setOriginalTitle(cat.title);
    setIsModalOpen(true);
  };

  const startNew = () => {
    setEditingCategory({ ...newCategory });
    setOriginalTitle('');
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-nomad-black">Collections</h1>
            <p className="text-sm text-gray-500 mt-1">Manage home page collections and mega menu.</p>
          </div>
          <button 
            onClick={startNew}
            className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors shadow-lg w-full md:w-auto justify-center"
          >
            <Plus size={18} /> Add Category
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
             <div key={idx} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
                <div className="h-48 bg-gray-100 relative overflow-hidden">
                    {cat.image ? (
                        <img src={cat.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={cat.title} />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                            <ImageIcon size={32} strokeWidth={1} className="mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">No Cover Image</span>
                        </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                        {cat.video && (
                            <div className="bg-nomad-black/60 backdrop-blur-md p-1.5 rounded-full text-white" title="Has hover video">
                                <Film size={14} />
                            </div>
                        )}
                        <button onClick={() => startEdit(cat)} className="bg-white/90 backdrop-blur-md p-1.5 rounded-full text-nomad-black hover:text-nomad-gold shadow-sm transition-colors"><Edit size={14}/></button>
                    </div>
                </div>
                <div className="p-6 flex-grow">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold font-serif text-nomad-black">{cat.title}</h3>
                        <button onClick={() => handleDelete(cat.title)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash size={18} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {cat.items.map((item, i) => (
                            <span key={i} className="bg-gray-50 text-gray-500 border border-gray-100 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{item}</span>
                        ))}
                        {cat.items.length === 0 && <span className="text-xs italic text-gray-400">No sub-items</span>}
                    </div>
                </div>
             </div>
          ))}
       </div>

       {isModalOpen && editingCategory && (
         <div className="fixed inset-0 bg-black/60 z-[90] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                   <h2 className="text-2xl font-serif font-bold text-nomad-black">Manage Category</h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24}/></button>
               </div>
               
               <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category Title</label>
                    <input 
                        className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-nomad-gold/20 outline-none transition-all font-medium" 
                        value={editingCategory.title} 
                        onChange={e => setEditingCategory({...editingCategory, title: e.target.value})} 
                        placeholder="e.g. Espresso Machines"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                             <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Cover Image</label>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group">
                                {editingCategory.image ? (
                                    <img src={editingCategory.image} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon size={24} />
                                    </div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    {isUploading === 'image' ? <Loader2 className="animate-spin text-white" /> : <Plus className="text-white" />}
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} />
                                </label>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Image Link (URL)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        className="w-full border border-gray-200 p-2 pl-9 rounded-lg text-xs font-mono text-gray-600"
                                        placeholder="https://..."
                                        value={editingCategory.image || ''}
                                        onChange={e => setEditingCategory({...editingCategory, image: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Hover Video (Optional)</label>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative group">
                                {editingCategory.video ? (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-nomad-gold bg-nomad-gold/5">
                                        <Film size={24} />
                                        <span className="text-[10px] font-bold mt-2">VIDEO SET</span>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <Film size={24} />
                                    </div>
                                )}
                                <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    {isUploading === 'video' ? <Loader2 className="animate-spin text-white" /> : <Plus className="text-white" />}
                                    <input type="file" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} />
                                </label>
                            </div>
                            <div>
                                <label className="block text-[9px] font-bold uppercase text-gray-400 mb-1">Video Link (URL)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input 
                                        className="w-full border border-gray-200 p-2 pl-9 rounded-lg text-xs font-mono text-gray-600"
                                        placeholder="https://..."
                                        value={editingCategory.video || ''}
                                        onChange={e => setEditingCategory({...editingCategory, video: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Sub-Items (Mega Menu)</label>
                    <div className="flex gap-2 mb-4">
                        <input 
                            className="flex-grow border border-gray-200 p-3 rounded-xl text-sm" 
                            placeholder="Add sub-category (e.g. Grinders)..."
                            value={newItemInput}
                            onChange={e => setNewItemInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItemToCategory())}
                        />
                        <button onClick={addItemToCategory} className="bg-nomad-black text-white px-5 rounded-xl font-bold hover:bg-nomad-gold transition-colors"><Plus size={18} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {editingCategory.items.map((item, idx) => (
                            <span key={idx} className="bg-gray-100 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-gray-600 border border-gray-200 group">
                                {item} 
                                <button onClick={() => removeItemFromCategory(idx)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                            </span>
                        ))}
                        {editingCategory.items.length === 0 && <p className="text-xs text-gray-400 italic">No sub-items added yet.</p>}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6 border-t border-gray-100">
                     <button onClick={handleSave} className="flex-1 bg-nomad-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-nomad-gold transition-colors shadow-lg">Save Changes</button>
                     <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">Cancel</button>
                  </div>
               </div>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default CategoryManager;