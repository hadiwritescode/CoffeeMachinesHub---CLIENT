import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, X } from 'lucide-react';
import { NavCategory } from '../../types';

const CategoryManager: React.FC = () => {
  const { categories, setCategories } = useStore();
  const [editingCategory, setEditingCategory] = useState<NavCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemInput, setNewItemInput] = useState('');

  const newCategory: NavCategory = {
    title: '',
    items: []
  };

  const handleSave = () => {
    if (!editingCategory || !editingCategory.title) return;
    
    // Check if updating or creating
    const exists = categories.some(c => c.title === editingCategory.title && c !== editingCategory); // simplistic check
    if (exists) {
        alert("Category title must be unique (or you are editing existing one).");
    }

    // Since we don't have IDs for categories in NavCategory type, we match by title logic for simplicity in this demo,
    // or just replace the whole array if we were tracking index.
    // Let's assume we are replacing the matching title or adding new.
    
    const index = categories.findIndex(c => c.title === editingCategory.title);
    let newCats = [...categories];
    if (index >= 0) {
        newCats[index] = editingCategory;
    } else {
        newCats.push(editingCategory);
    }
    setCategories(newCats);
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleDelete = (title: string) => {
    if (confirm('Delete this category?')) {
        setCategories(categories.filter(c => c.title !== title));
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
    setEditingCategory({ ...cat }); // Clone
    setIsModalOpen(true);
  };

  const startNew = () => {
    setEditingCategory({ ...newCategory });
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nomad-black">Categories</h1>
          <button 
            onClick={startNew}
            className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors"
          >
            <Plus size={18} /> Add Category
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
             <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold font-serif">{cat.title}</h3>
                    <div className="flex gap-2">
                        <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-nomad-black"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(cat.title)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    {cat.items.map((item, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{item}</span>
                    ))}
                </div>
             </div>
          ))}
       </div>

       {isModalOpen && editingCategory && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
               <h2 className="text-2xl font-bold mb-6">Manage Category</h2>
               
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Category Title</label>
                    <input 
                        className="w-full border p-3 rounded-xl" 
                        value={editingCategory.title} 
                        onChange={e => setEditingCategory({...editingCategory, title: e.target.value})} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Sub-Items</label>
                    <div className="flex gap-2 mb-2">
                        <input 
                            className="flex-grow border p-2 rounded-lg" 
                            placeholder="Add sub-category..."
                            value={newItemInput}
                            onChange={e => setNewItemInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addItemToCategory()}
                        />
                        <button onClick={addItemToCategory} className="bg-nomad-black text-white px-4 rounded-lg font-bold"><Plus size={16} /></button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {editingCategory.items.map((item, idx) => (
                            <span key={idx} className="bg-gray-100 flex items-center gap-1 px-3 py-1 rounded-full text-xs">
                                {item} 
                                <button onClick={() => removeItemFromCategory(idx)} className="hover:text-red-500"><X size={12} /></button>
                            </span>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <button onClick={handleSave} className="flex-1 bg-nomad-black text-white py-3 rounded-xl font-bold uppercase">Save</button>
                     <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold uppercase">Cancel</button>
                  </div>
               </div>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default CategoryManager;