import React, { useState } from 'react';
import { MessageCircle, Send, X, Phone } from 'lucide-react';

const WhatsAppWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Replace with the actual phone number
  const PHONE_NUMBER = '923001234567'; 
  
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden border border-gray-100 transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-nomad-black p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                 <Phone size={20} fill="white" />
             </div>
             <div>
                 <h4 className="font-bold text-sm">Nomad Support</h4>
                 <p className="text-[10px] text-gray-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                    Replies instantly
                 </p>
             </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
              <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 bg-nomad-paper h-64 overflow-y-auto flex flex-col gap-3">
           {/* System Message */}
           <div className="self-start bg-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[85%]">
              <p className="text-sm text-gray-700">Hi there! 👋 <br/>How can we help you with your coffee journey today?</p>
              <span className="text-[9px] text-gray-400 mt-1 block">10:00 AM</span>
           </div>
        </div>

        {/* Footer / Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..." 
              className="flex-grow bg-gray-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
            />
            <button 
                type="submit" 
                className={`p-2 rounded-full transition-all ${message.trim() ? 'bg-green-500 text-white shadow-md transform hover:scale-105' : 'bg-gray-100 text-gray-400'}`}
            >
                <Send size={18} />
            </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${isOpen ? 'bg-nomad-black rotate-90' : 'bg-green-500 rotate-0'}`}
      >
        {isOpen ? <X size={24} className="text-white" /> : <MessageCircle size={28} className="text-white" />}
      </button>
    </div>
  );
};

export default WhatsAppWidget;