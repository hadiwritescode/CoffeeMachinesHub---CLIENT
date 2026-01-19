import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Edit, Trash, Plus, Upload } from 'lucide-react';
import { BlogPost } from '../../types';

const BlogManager: React.FC = () => {
  const { blogPosts, setBlogPosts } = useStore();
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const newPost: BlogPost = {
    id: '',
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    image: '',
    author: 'Nomad Team'
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPost) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        setEditingPost({ ...editingPost, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    if (blogPosts.some(p => p.id === editingPost.id)) {
        setBlogPosts(blogPosts.map(p => p.id === editingPost.id ? editingPost : p));
    } else {
        const p = { ...editingPost, id: editingPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') };
        setBlogPosts([p, ...blogPosts]);
    }
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this post?')) {
      setBlogPosts(blogPosts.filter(p => p.id !== id));
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
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Cover Image</label>
                    <div className="flex gap-4 items-center">
                        {editingPost.image && <img src={editingPost.image} alt="Preview" className="w-16 h-16 rounded object-cover border" />}
                        <label className="cursor-pointer bg-gray-50 border border-dashed p-2 rounded-lg hover:bg-gray-100 flex items-center gap-2">
                            <Upload size={16} /> <span className="text-sm">Choose File</span>
                            <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                        </label>
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
                     <button type="submit" className="flex-1 bg-nomad-black text-white py-3 rounded-xl font-bold uppercase">Save Post</button>
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