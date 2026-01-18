import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus, MapPin, Mail, Phone, Clock, ArrowRight } from 'lucide-react';

const Contact: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="animate-fade-in bg-nomad-paper pt-32">
      {/* Header */}
      <div className="container mx-auto px-6 md:px-12 py-12 text-center fade-up">
         <span className="block text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">We're here to help</span>
         <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-nomad-black">Get in Touch</h1>
         <p className="text-gray-500 max-w-xl mx-auto text-lg">Have a question about our beans, shipping, or brewing equipment? Our team of coffee experts is ready to assist.</p>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Info Side */}
          <div className="w-full lg:w-1/3 space-y-10 fade-up">
             
             {/* Card 1 */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-nomad-gold/10 rounded-full flex items-center justify-center text-nomad-gold mr-4">
                        <MapPin size={20} />
                    </div>
                    <h3 className="font-serif font-bold text-xl">Visit Us</h3>
                </div>
                <p className="text-gray-600 leading-relaxed pl-14">
                   Nomad Coffee Studio<br/>
                   Building 12, Lane 4, Phase 6<br/>
                   DHA, Lahore, Pakistan
                </p>
             </div>

             {/* Card 2 */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-nomad-gold/10 rounded-full flex items-center justify-center text-nomad-gold mr-4">
                        <Mail size={20} />
                    </div>
                    <h3 className="font-serif font-bold text-xl">Contact</h3>
                </div>
                <div className="pl-14 space-y-2">
                    <a href="mailto:hello@nomadcoffeestudio.com" className="block text-gray-600 hover:text-black hover:underline transition-colors">hello@nomadcoffeestudio.com</a>
                    <a href="tel:+923001234567" className="block text-gray-600 hover:text-black hover:underline transition-colors">+92 300 123 4567</a>
                </div>
             </div>

             {/* Card 3 */}
             <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-nomad-gold/10 rounded-full flex items-center justify-center text-nomad-gold mr-4">
                        <Clock size={20} />
                    </div>
                    <h3 className="font-serif font-bold text-xl">Opening Hours</h3>
                </div>
                <p className="text-gray-600 leading-relaxed pl-14">
                   Mon - Fri: 8am - 10pm<br/>
                   Sat - Sun: 9am - 11pm
                </p>
             </div>
          </div>

          {/* Form Side */}
          <div className="w-full lg:w-2/3 bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl fade-up" style={{ transitionDelay: '0.2s' }}>
             <h3 className="font-serif font-bold text-2xl mb-8">Send us a message</h3>
             <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-nomad-gold transition-colors">Name</label>
                     <input type="text" className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors bg-transparent text-lg" placeholder="Jane Doe" />
                   </div>
                   <div className="space-y-2 group">
                     <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-nomad-gold transition-colors">Email</label>
                     <input type="email" className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors bg-transparent text-lg" placeholder="jane@example.com" />
                   </div>
                </div>
                <div className="space-y-2 group">
                   <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-focus-within:text-nomad-gold transition-colors">Message</label>
                   <textarea rows={4} className="w-full py-4 border-b border-gray-200 focus:border-black focus:outline-none transition-colors bg-transparent text-lg resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <div className="pt-4">
                    <button type="button" className="group bg-black text-white px-10 py-5 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-nomad-gold transition-all flex items-center shadow-lg hover:shadow-xl hover:-translate-y-1">
                      Send Message <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
             </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white border-t border-gray-100 py-24 mt-12 fade-up">
         <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <div className="text-center mb-16">
                 <span className="text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 block">Help Center</span>
                 <h2 className="text-3xl md:text-4xl font-serif font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div key={index} className="bg-nomad-paper rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-300 transition-colors">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-6 text-left"
                  >
                    <span className="font-bold text-lg font-serif">{faq.question}</span>
                    <span className={`transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`}>
                         {openFaqIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaqIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
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