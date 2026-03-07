import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, ChevronDown, Map } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Contact: React.FC = () => {
  const { siteContent, addMessage } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Fallback if FAQs haven't been saved to DB yet
  const faqs = siteContent.contact.faqs || [];

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
    
    // 2. Open WhatsApp - Clean number
    let rawPhone = siteContent.contact.phone.replace(/[^0-9]/g, '') || '923104811010';
    if (rawPhone.startsWith('0')) {
      rawPhone = '92' + rawPhone.substring(1);
    } else if (!rawPhone.startsWith('92') && rawPhone.length === 10) {
      rawPhone = '92' + rawPhone;
    }

    const whatsappMessage = `Name: ${formData.name}%0AEmail: ${formData.email}%0AMessage: ${formData.message}`;
    window.open(`https://wa.me/${rawPhone}?text=${whatsappMessage}`, '_blank');
    
    // Reset
    setFormData({ name: '', email: '', message: '' });
    // Optional: show a toast or alert. The store might handle logic, but here we just alert.
    alert('Message sent! We will get back to you shortly.');
  };

  return (
    <div className="animate-fade-in bg-nomad-paper min-h-screen">
      
      {/* 1. HERO HEADER */}
      <div className="pt-32 md:pt-40 pb-12 md:pb-20 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16 md:mb-32 fade-up">
            <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 block">
                Customer Support
            </span>
            <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif font-bold mb-6 md:mb-8 text-nomad-black leading-[0.9]">
                Get In Touch
            </h1>
            <div className="w-16 md:w-24 h-1 bg-nomad-gold mx-auto mb-6 md:mb-8 opacity-50"></div>
            <p className="text-base md:text-2xl font-serif italic text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
                Have questions about our machines or need brewing advice? We're here to help.
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-24 md:mb-48 fade-up">
            
            {/* Left Column: Contact Info */}
            <div className="w-full lg:w-1/3">
                <h3 className="text-2xl md:text-3xl font-serif font-bold mb-6 md:mb-8 text-nomad-black">Contact Details</h3>
                <div className="space-y-8 md:space-y-10">
                    <div className="flex items-start group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-nomad-gold/10 flex items-center justify-center mr-4 md:mr-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors shrink-0">
                            <MapPin size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 md:mb-2 text-nomad-black">Visit Us</h4>
                            <p className="text-gray-600 leading-relaxed mb-2 md:mb-3 text-base md:text-lg">{siteContent.contact.address}</p>
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
                    </div>

                    <div className="flex items-start group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-nomad-gold/10 flex items-center justify-center mr-4 md:mr-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors shrink-0">
                            <Mail size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 md:mb-2 text-nomad-black">Email Us</h4>
                            <a href={`mailto:${siteContent.contact.email}`} className="text-gray-600 hover:text-nomad-gold transition-colors text-base md:text-lg block">
                                {siteContent.contact.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start group">
                         <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-nomad-gold/10 flex items-center justify-center mr-4 md:mr-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors shrink-0">
                            <Phone size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 md:mb-2 text-nomad-black">Call Us</h4>
                            <a href={`tel:${siteContent.contact.phone}`} className="text-gray-600 hover:text-nomad-gold transition-colors text-base md:text-lg block">
                                {siteContent.contact.phone}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-start group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-nomad-gold/10 flex items-center justify-center mr-4 md:mr-6 text-nomad-gold group-hover:bg-nomad-gold group-hover:text-white transition-colors shrink-0">
                            <Clock size={20} className="md:w-6 md:h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm uppercase tracking-wider mb-1 md:mb-2 text-nomad-black">Opening Hours</h4>
                            <p className="text-gray-600 text-base md:text-lg">Mon - Sat: 11:00 AM - 10:00 PM</p>
                            <p className="text-gray-400 text-xs md:text-sm mt-1">Sunday: Closed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-2/3">
                <div className="bg-white p-8 md:p-12 lg:p-16 rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-nomad-gold/5 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <h2 className="text-2xl md:text-4xl font-serif font-bold mb-6 md:mb-8 text-nomad-black relative z-10">Send us a message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Name</label>
                                <input 
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Your name"
                                    className="w-full bg-nomad-paper/50 border-b border-gray-200 px-4 py-4 focus:outline-none focus:border-nomad-gold transition-colors placeholder:text-gray-300 text-nomad-black font-medium"
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
                                    className="w-full bg-nomad-paper/50 border-b border-gray-200 px-4 py-4 focus:outline-none focus:border-nomad-gold transition-colors placeholder:text-gray-300 text-nomad-black font-medium"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Message</label>
                            <textarea 
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                placeholder="How can we help you?"
                                className="w-full bg-nomad-paper/50 border-b border-gray-200 px-4 py-4 focus:outline-none focus:border-nomad-gold transition-colors placeholder:text-gray-300 text-nomad-black font-medium resize-none"
                                required
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit" 
                                className="bg-nomad-black text-white px-8 py-4 md:px-10 md:py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-colors shadow-lg flex items-center gap-3 group w-full md:w-auto justify-center"
                            >
                                Send Message
                                <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        {/* FAQ Section */}
        {faqs.length > 0 && (
            <div className="max-w-4xl mx-auto fade-up border-t border-nomad-black/5 pt-16 md:pt-20">
                <div className="text-center mb-12 md:mb-16">
                    <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Help Center</span>
                    <h2 className="text-2xl md:text-5xl font-serif font-bold text-nomad-black">Frequently Asked Questions</h2>
                </div>
                
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border-b border-gray-200">
                            <button 
                                onClick={() => toggleFaq(index)}
                                className="w-full flex justify-between items-center py-5 md:py-6 text-left group hover:bg-gray-50/50 transition-colors px-2 md:px-4 rounded-lg"
                            >
                                <span className="font-bold text-lg md:text-xl font-serif text-nomad-black group-hover:text-nomad-gold transition-colors pr-6">
                                    {faq.question}
                                </span>
                                <span className={`transition-transform duration-300 text-nomad-gold shrink-0 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} className="md:w-6 md:h-6" />
                                </span>
                            </button>
                            <div 
                                className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] px-2 md:px-4 ${openFaqIndex === index ? 'max-h-96 opacity-100 pb-6 md:pb-8' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg font-light">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Contact;