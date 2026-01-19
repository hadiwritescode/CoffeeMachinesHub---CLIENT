import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, Map, Plus, Minus } from 'lucide-react';
import { FAQS } from '../constants';
import { useStore } from '../context/StoreContext';

const Contact: React.FC = () => {
  const { siteContent, addMessage } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Save to internal admin store
    addMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message
    });
    
    // 2. Open WhatsApp
    const whatsappMessage = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/923104811011?text=${whatsappMessage}`, '_blank');
    
    // Reset
    setFormData({ name: '', email: '', message: '' });
    alert('Message sent! We will get back to you shortly.');
  };

  return (
    <div className="animate-fade-in bg-nomad-paper pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 fade-up">
           <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Get in Touch</span>
           <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-nomad-black">Contact Us</h1>
           <p className="text-gray-500 text-lg max-w-xl mx-auto">
             Have questions about our machines or need brewing advice? We're here to help.
           </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start mb-24">
          
          {/* Left Column: Info Cards */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6 fade-up">
            
            {/* Address Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-12 h-12 bg-nomad-paper rounded-full flex items-center justify-center mb-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors">
                  <MapPin size={24} />
               </div>
               <h3 className="font-serif font-bold text-xl mb-4 text-nomad-black">Visit Us</h3>
               <p className="text-gray-500 mb-6 leading-relaxed">
                 {siteContent.contact.address}
               </p>
               <a 
                 href="https://www.google.com/maps/search/?api=1&query=City+Star+Mall+Model+Town+Link+Road+Lahore" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-nomad-gold hover:text-nomad-black transition-colors border-b border-nomad-gold pb-1 hover:border-nomad-black"
               >
                 <Map size={14} className="mr-2" />
                 View on Map
               </a>
            </div>

            {/* Contact Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-12 h-12 bg-nomad-paper rounded-full flex items-center justify-center mb-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors">
                  <Mail size={24} />
               </div>
               <h3 className="font-serif font-bold text-xl mb-4 text-nomad-black">Contact</h3>
               <div className="space-y-2">
                 <a href={`mailto:${siteContent.contact.email}`} className="block text-gray-500 hover:text-nomad-gold transition-colors">
                   {siteContent.contact.email}
                 </a>
                 <a href={`tel:${siteContent.contact.phone}`} className="block text-gray-500 hover:text-nomad-gold transition-colors">
                   {siteContent.contact.phone}
                 </a>
               </div>
            </div>

            {/* Hours Card (3rd Card) */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-12 h-12 bg-nomad-paper rounded-full flex items-center justify-center mb-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors">
                  <Clock size={24} />
               </div>
               <h3 className="font-serif font-bold text-xl mb-4 text-nomad-black">Opening Hours</h3>
               <p className="text-gray-500 mb-1">Mon - Sat: 11:00 AM - 10:00 PM</p>
               <p className="text-gray-400 text-sm">Sunday: Closed</p>
            </div>

          </div>

          {/* Right Column: Form */}
          <div className="w-full lg:w-2/3 fade-up" style={{ transitionDelay: '0.1s' }}>
             <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2.5rem] shadow-xl h-full">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-nomad-black">Send us a message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Name</label>
                         <input 
                           type="text"
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           placeholder="Your name"
                           className="w-full bg-nomad-paper border-0 rounded-xl px-6 py-4 focus:ring-2 focus:ring-nomad-gold/20 transition-all placeholder:text-gray-300 text-nomad-black font-medium"
                           required
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email</label>
                         <input 
                           type="email"
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           placeholder="email@example.com"
                           className="w-full bg-nomad-paper border-0 rounded-xl px-6 py-4 focus:ring-2 focus:ring-nomad-gold/20 transition-all placeholder:text-gray-300 text-nomad-black font-medium"
                           required
                         />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                      <textarea 
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="How can we help you?"
                        className="w-full bg-nomad-paper border-0 rounded-xl px-6 py-4 focus:ring-2 focus:ring-nomad-gold/20 transition-all placeholder:text-gray-300 text-nomad-black font-medium resize-none"
                        required
                      ></textarea>
                   </div>

                   <button 
                     type="submit" 
                     className="bg-nomad-black text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-colors shadow-lg flex items-center gap-3 group"
                   >
                     Send Message
                     <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </form>
             </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="pt-12 border-t border-gray-200 fade-up">
           <div className="text-center mb-16">
                <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Help Center</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-nomad-black">Frequently Asked Questions</h2>
           </div>
           
           <div className="max-w-4xl mx-auto space-y-4">
             {FAQS.map((faq, index) => (
               <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-300 transition-colors shadow-sm">
                 <button 
                   onClick={() => toggleFaq(index)}
                   className="w-full flex justify-between items-center p-6 text-left"
                 >
                   <span className="font-bold text-lg font-serif text-nomad-black pr-4">{faq.question}</span>
                   <span className={`transition-transform duration-300 flex-shrink-0 text-nomad-gold ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                        {openFaqIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                   </span>
                 </button>
                 <div 
                   className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                 >
                   <p className="text-gray-600 leading-relaxed">
                     {faq.answer}
                   </p>
                 </div>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;