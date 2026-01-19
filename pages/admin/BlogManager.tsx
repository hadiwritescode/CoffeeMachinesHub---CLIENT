import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Upload, Loader2, Link as LinkIcon } from 'lucide-react';
import { BlogPost } from '../../types';

const BlogManager: React.FC = () => {
  const { blogPosts, addBlogPost, updateBlogPost, removeBlogPost, uploadFile } = useStore();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const newPost: BlogPost = {
    id: '',
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    image: '',
    author: 'Coffee Machines Hub',
    sourceLink: ''
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    setIsUploading(true);
    try {
        const url = await uploadFile(file, 'blogs');
        setEditingPost({ ...editingPost, image: url });
    } catch (error) {
        alert("Upload failed.");
    } finally {
        setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (editingPost.id) {
        await updateBlogPost(editingPost);
    } else {
        const p = { ...editingPost, id: editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
        await addBlogPost(p);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this post?')) {
      await removeBlogPost(id);
    }
  };

  return (
    <AdminLayout>
       <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nomad-black">Blog Posts</h1>
          <button 
            onClick={() => { setEditingPost(newPost); setIsModalOpen(true); }}
            className="bg-nomad-black text-white px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:bg-nomad-gold transition-colors"
          >
            <Plus size={18} /> New Post
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map(post => (
             <div key={post.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
                <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded-2xl mb-4" />
                <div className="flex-grow">
                    <h3 className="font-bold font-serif text-lg mb-2 leading-tight">{post.title}</h3>
                    <p className="text-xs text-gray-500 mb-2">{post.date} • {post.author}</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onClick={() => { setEditingPost(post); setIsModalOpen(true); }} className="p-2 text-gray-400 hover:text-nomad-black"><Edit size={18} /></button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash size={18} /></button>
                </div>
             </div>
          ))}
       </div>

       {isModalOpen && editingPost && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
               <h2 className="text-2xl font-bold mb-6">{editingPost.id ? 'Edit Post' : 'New Post'}</h2>
               <form onSubmit={handleSave} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Title</label>
                        <input className="w-full border p-2 rounded-lg" value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} required />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Author</label>
                        <input className="w-full border p-2 rounded-lg" value={editingPost.author} onChange={e => setEditingPost({...editingPost, author: e.target.value})} />
                      </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Source Link (Optional)</label>
                    <input className="w-full border p-2 rounded-lg" value={editingPost.sourceLink || ''} onChange={e => setEditingPost({...editingPost, sourceLink: e.target.value})} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cover Image</label>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4 items-center">
                            {editingPost.image && <img src={editingPost.image} alt="Preview" className="w-16 h-16 rounded object-cover border" />}
                            <label className={`cursor-pointer bg-gray-50 border border-dashed p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2 ${isUploading ? 'opacity-50' : ''}`}>
                                {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
                                <span className="text-sm">Choose File</span>
                                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400">OR</span>
                            <div className="relative flex-grow">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Paste image URL here..." 
                                    className="w-full border p-2 pl-9 rounded-lg text-sm focus:ring-2 focus:ring-nomad-gold/20 outline-none"
                                    value={editingPost.image}
                                    onChange={(e) => setEditingPost({...editingPost, image: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Excerpt</label>
                    <textarea className="w-full border p-2 rounded-lg" rows={2} value={editingPost.excerpt} onChange={e => setEditingPost({...editingPost, excerpt: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Content</label>
                    <textarea className="w-full border p-2 rounded-lg font-mono text-sm" rows={12} value={editingPost.content} onChange={e => setEditingPost({...editingPost, content: e.target.value})} />
                  </div>
                  <div className="flex gap-4 pt-4">
                     <button type="submit" disabled={isUploading} className="flex-1 bg-nomad-black text-white py-3 rounded-xl font-bold uppercase disabled:opacity-70">Save Post</button>
                     <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold uppercase">Cancel</button>
                  </div>
               </form>
            </div>
         </div>
       )}
    </AdminLayout>
  );
};

export default BlogManager;