
import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Mail, Check, Trash } from 'lucide-react';

const MessageManager: React.FC = () => {
  const { messages, markMessageRead, deleteMessage } = useStore();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredMessages = filter === 'all' 
    ? messages 
    : messages.filter(m => !m.read);

  const handleDelete = async (id: string) => {
      if (confirm("Delete this message?")) {
          await deleteMessage(id);
      }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-nomad-black">Messages</h1>
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-colors ${filter === 'all' ? 'bg-nomad-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  All
              </button>
              <button 
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase transition-colors ${filter === 'unread' ? 'bg-nomad-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                  Unread
              </button>
          </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {filteredMessages.length === 0 ? (
              <div className="p-12 text-center text-gray-400">
                  <Mail size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No messages found.</p>
              </div>
          ) : (
              <div className="divide-y divide-gray-100">
                  {filteredMessages.map(msg => (
                      <div key={msg.id} className={`p-6 hover:bg-gray-50 transition-colors ${!msg.read ? 'bg-blue-50/30' : ''}`}>
                          <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                  {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                  <h3 className={`font-bold text-nomad-black ${!msg.read ? 'text-lg' : ''}`}>{msg.name}</h3>
                                  <span className="text-xs text-gray-400">{msg.date}</span>
                              </div>
                              <div className="flex gap-2">
                                  <button 
                                    onClick={() => markMessageRead(msg.id, msg.read)}
                                    className={`p-2 rounded-full transition-colors ${msg.read ? 'text-gray-400 hover:bg-gray-200' : 'text-blue-500 hover:bg-blue-100'}`}
                                    title={msg.read ? "Mark as unread" : "Mark as read"}
                                  >
                                      <Check size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(msg.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                  >
                                      <Trash size={18} />
                                  </button>
                              </div>
                          </div>
                          <div className="text-sm text-nomad-gold font-medium mb-3">{msg.email}</div>
                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.message}
                          </p>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </AdminLayout>
  );
};

export default MessageManager;
