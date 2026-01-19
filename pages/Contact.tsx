import React, { useState } from 'react';
import { FAQS } from '../constants';
import { Plus, Minus, Instagram } from 'lucide-react';

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

      {/* Main Content: Map & Details */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col lg:flex-row fade-up">
          
          {/* Left: Map */}
          <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-[650px] relative order-2 lg:order-1">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.830694063854!2d74.29177197623126!3d31.49129534769024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391903d6d6014387%3A0x6b6697479707963!2sCity%20Star%20Mall!5e0!3m2!1sen!2s!4v1705678901234!5m2!1sen!2s" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
               title="Map Location"
             ></iframe>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-1/2 p-10 md:p-16 lg:p-20 flex flex-col justify-center order-1 lg:order-2">
             <h2 className="font-serif font-bold text-4xl lg:text-5xl mb-6 text-nomad-black">Reach Out to Us</h2>
             <div className="w-20 h-1.5 bg-nomad-gold mb-8"></div>
             
             <p className="text-gray-600 text-lg leading-relaxed mb-12">
               We’re here to assist you with any questions or concerns regarding your coffee machine needs.
             </p>

             <div className="space-y-10">
                <div>
                   <h3 className="text-lg font-bold text-nomad-black mb-2">Phone</h3>
                   <p className="text-gray-600 text-xl font-medium">+92 310 481 1011</p>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-nomad-black mb-2">Email</h3>
                   <a href="mailto:Coffeemachineshub@gmail.com" className="text-gray-600 text-xl hover:text-nomad-gold transition-colors block break-words">Coffeemachineshub@gmail.com</a>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-nomad-black mb-2">Address</h3>
                   <p className="text-gray-600 text-lg max-w-sm leading-relaxed">G-22, City Star Mall, Model Town Link Road, Lahore</p>
                </div>

                <div>
                   <h3 className="text-lg font-bold text-nomad-black mb-4">Social Media</h3>
                   <a 
                     href="https://www.instagram.com/" 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-nomad-paper text-nomad-gold hover:bg-nomad-gold hover:text-white transition-all transform hover:scale-110 shadow-sm"
                     aria-label="Instagram"
                   >
                      <Instagram size={28} />
                   </a>
                </div>
             </div>
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