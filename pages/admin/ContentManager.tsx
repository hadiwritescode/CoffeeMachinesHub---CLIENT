import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';

const ContentManager: React.FC = () => {
  const { siteContent, updateSiteContent } = useStore();
  const [activeTab, setActiveTab] = useState<'hero' | 'contact' | 'socials' | 'team'>('hero');

  // Local state for forms to avoid excessive re-renders, sync on save
  const [heroForm, setHeroForm] = useState(siteContent.hero);
  const [contactForm, setContactForm] = useState(siteContent.contact);
  const [socialsForm, setSocialsForm] = useState(siteContent.socials);

  const handleSaveHero = () => {
    updateSiteContent('hero', heroForm);
    alert('Hero section updated!');
  };

  const handleSaveContact = () => {
    updateSiteContent('contact', contactForm);
    alert('Contact info updated!');
  };

  const handleSaveSocials = () => {
    updateSiteContent('socials', socialsForm);
    alert('Social links updated!');
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-serif font-bold text-nomad-black mb-8">Content Management</h1>
      
      <div className="flex space-x-4 mb-8 border-b border-gray-200 pb-1">
         {['hero', 'contact', 'socials', 'team'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 px-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'border-b-2 border-nomad-gold text-nomad-black' : 'text-gray-400 hover:text-nomad-black'}`}
             >
                 {tab}
             </button>
         ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-3xl">
         {activeTab === 'hero' && (
             <div className="space-y-6">
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Main Title</label>
                     <input className="w-full border p-3 rounded-xl" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Subtitle</label>
                     <input className="w-full border p-3 rounded-xl" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Video URL (MP4)</label>
                     <input className="w-full border p-3 rounded-xl" value={heroForm.videoUrl} onChange={e => setHeroForm({...heroForm, videoUrl: e.target.value})} />
                 </div>
                 <button onClick={handleSaveHero} className="bg-nomad-black text-white px-8 py-3 rounded-xl font-bold uppercase">Save Changes</button>
             </div>
         )}

         {activeTab === 'contact' && (
             <div className="space-y-6">
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Address</label>
                     <input className="w-full border p-3 rounded-xl" value={contactForm.address} onChange={e => setContactForm({...contactForm, address: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Email</label>
                     <input className="w-full border p-3 rounded-xl" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Phone</label>
                     <input className="w-full border p-3 rounded-xl" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} />
                 </div>
                 <button onClick={handleSaveContact} className="bg-nomad-black text-white px-8 py-3 rounded-xl font-bold uppercase">Save Contact Info</button>
             </div>
         )}

         {activeTab === 'socials' && (
             <div className="space-y-6">
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Instagram URL</label>
                     <input className="w-full border p-3 rounded-xl" value={socialsForm.instagram} onChange={e => setSocialsForm({...socialsForm, instagram: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Facebook URL</label>
                     <input className="w-full border p-3 rounded-xl" value={socialsForm.facebook} onChange={e => setSocialsForm({...socialsForm, facebook: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">YouTube URL</label>
                     <input className="w-full border p-3 rounded-xl" value={socialsForm.youtube} onChange={e => setSocialsForm({...socialsForm, youtube: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Twitter/Threads URL</label>
                     <input className="w-full border p-3 rounded-xl" value={socialsForm.twitter} onChange={e => setSocialsForm({...socialsForm, twitter: e.target.value})} />
                 </div>
                 <button onClick={handleSaveSocials} className="bg-nomad-black text-white px-8 py-3 rounded-xl font-bold uppercase">Save Social Links</button>
             </div>
         )}
         
         {activeTab === 'team' && (
             <div>
                 <p className="text-gray-500 italic mb-4">Team management coming soon. For now, edit in constants.tsx or StoreContext.</p>
                 <div className="grid grid-cols-1 gap-4">
                     {siteContent.team.map((member, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
                             <img src={member.img} className="w-12 h-12 rounded-full object-cover" alt="" />
                             <div>
                                 <h4 className="font-bold">{member.name}</h4>
                                 <p className="text-xs text-gray-500 uppercase">{member.role}</p>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
         )}
      </div>
    </AdminLayout>
  );
};

export default ContentManager;