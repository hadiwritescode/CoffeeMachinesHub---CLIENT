import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash, User, Upload, Loader2 } from 'lucide-react';
import { TeamMember, Testimonial } from '../../types';

const ContentManager: React.FC = () => {
  const { 
      siteContent, updateSiteContent, 
      testimonials, addTestimonial, removeTestimonial,
      uploadFile 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'about' | 'contact' | 'socials'>('home');
  const [subTab, setSubTab] = useState<string>('hero');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form States
  const [heroForm, setHeroForm] = useState(siteContent.hero);
  const [brands, setBrands] = useState(siteContent.home.brands);
  const [serviceForm, setServiceForm] = useState(siteContent.services);
  const [aboutForm, setAboutForm] = useState(siteContent.about);
  const [contactForm, setContactForm] = useState(siteContent.contact);
  const [socialsForm, setSocialsForm] = useState(siteContent.socials);
  const [teamList, setTeamList] = useState<TeamMember[]>(siteContent.team);

  const saveHomeHero = async () => { await updateSiteContent('hero', heroForm); alert('Saved!'); };
  const saveBrands = async () => { await updateSiteContent('home', { ...siteContent.home, brands }); alert('Saved!'); };
  const saveServices = async () => { await updateSiteContent('services', serviceForm); alert('Saved!'); };
  const saveAbout = async () => { await updateSiteContent('about', aboutForm); alert('Saved!'); };
  const saveTeam = async () => { await updateSiteContent('team', teamList); alert('Saved!'); };
  const saveContact = async () => { await updateSiteContent('contact', contactForm); alert('Saved!'); };
  const saveSocials = async () => { await updateSiteContent('socials', socialsForm); alert('Saved!'); };

  const handleFileUpload = async (
      e: React.ChangeEvent<HTMLInputElement>, 
      setter: React.Dispatch<React.SetStateAction<any>>, 
      field: string,
      obj: any
  ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setUploadingField(field);
      try {
          const url = await uploadFile(file, 'content');
          setter({ ...obj, [field]: url });
      } catch (e) {
          alert('Upload failed');
      } finally {
          setUploadingField(null);
      }
  };

  const handleTeamUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setUploadingField(`team-${index}`);
      try {
          const url = await uploadFile(file, 'team');
          const newList = [...teamList];
          newList[index].img = url;
          setTeamList(newList);
      } catch(e) {
          alert('Upload failed');
      } finally {
          setUploadingField(null);
      }
  };

  // Testimonial Helpers
  const handleAddTestimonial = async () => {
    await addTestimonial({ id: `new-${Date.now()}`, name: 'New User', role: 'Customer', text: 'Review...', rating: 5 });
  };
  const handleDeleteTestimonial = async (id: string) => {
    await removeTestimonial(id);
  };

  // Team Helpers
  const addTeamMember = () => setTeamList([...teamList, { name: 'Name', role: 'Role', img: 'https://via.placeholder.com/150' }]);
  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newList = [...teamList];
    newList[index] = { ...newList[index], [field]: value };
    setTeamList(newList);
  };
  const removeTeamMember = (index: number) => setTeamList(teamList.filter((_, i) => i !== index));

  return (
    <AdminLayout>
      <h1 className="text-3xl font-serif font-bold text-nomad-black mb-8">Content Management</h1>
      
      {/* Top Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200">
         {['home', 'services', 'about', 'contact', 'socials'].map((tab) => (
             <button 
                key={tab}
                onClick={() => { setActiveTab(tab as any); setSubTab('hero'); }} // Reset subtab
                className={`pb-3 px-6 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === tab ? 'border-b-2 border-nomad-gold text-nomad-black' : 'text-gray-400 hover:text-nomad-black'}`}
             >
                 {tab}
             </button>
         ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm max-w-5xl">
         
         {/* HOME TAB */}
         {activeTab === 'home' && (
             <div>
                <div className="flex gap-4 mb-6">
                    {['hero', 'brands', 'testimonials'].map(st => (
                        <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${subTab === st ? 'bg-nomad-black text-white' : 'bg-gray-100 text-gray-500'}`}>{st}</button>
                    ))}
                </div>

                {subTab === 'hero' && (
                    <div className="space-y-6 animate-fade-in">
                        <InputGroup label="Title" value={heroForm.title} onChange={v => setHeroForm({...heroForm, title: v})} />
                        <InputGroup label="Subtitle" value={heroForm.subtitle} onChange={v => setHeroForm({...heroForm, subtitle: v})} />
                        <InputGroup label="Video URL (Use link for video)" value={heroForm.videoUrl} onChange={v => setHeroForm({...heroForm, videoUrl: v})} />
                        <InputGroup label="Button Text" value={heroForm.buttonText} onChange={v => setHeroForm({...heroForm, buttonText: v})} />
                        <SaveButton onClick={saveHomeHero} />
                    </div>
                )}

                {subTab === 'brands' && (
                    <div className="space-y-4 animate-fade-in">
                        <p className="text-gray-500 text-sm">Enter brand names (text only for this demo).</p>
                        <textarea className="w-full border p-4 rounded-xl" rows={5} value={brands.join(', ')} onChange={e => setBrands(e.target.value.split(',').map(s => s.trim()))} />
                        <SaveButton onClick={saveBrands} />
                    </div>
                )}

                {subTab === 'testimonials' && (
                    <div className="space-y-6 animate-fade-in">
                        {testimonials.map(t => (
                            <div key={t.id} className="border p-4 rounded-xl flex gap-4 items-start">
                                <div className="flex-grow grid grid-cols-2 gap-4">
                                    <div className="col-span-2 text-xs text-gray-400">ID: {t.id} (Managed via Firebase)</div>
                                    <InputGroup label="Name" value={t.name} onChange={() => {}} /> 
                                    <InputGroup label="Role" value={t.role} onChange={() => {}} />
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Review</label>
                                        <textarea className="w-full border p-2 rounded-lg" value={t.text} readOnly />
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-400 hover:text-red-600 p-2"><Trash size={18} /></button>
                            </div>
                        ))}
                        <button onClick={handleAddTestimonial} className="flex items-center gap-2 text-nomad-gold font-bold uppercase text-xs"><Plus size={16} /> Add Testimonial (Placeholder)</button>
                    </div>
                )}
             </div>
         )}

         {/* SERVICES TAB */}
         {activeTab === 'services' && (
             <div className="space-y-6 animate-fade-in">
                 <h3 className="font-bold text-lg border-b pb-2">Hero Section</h3>
                 <InputGroup label="Title" value={serviceForm.heroTitle} onChange={v => setServiceForm({...serviceForm, heroTitle: v})} />
                 <InputGroup label="Subtitle" value={serviceForm.heroSubtitle} onChange={v => setServiceForm({...serviceForm, heroSubtitle: v})} />
                 <ImageUploadGroup 
                    label="Hero Image" 
                    preview={serviceForm.heroImage} 
                    loading={uploadingField === 'heroImage'}
                    onChange={(e) => handleFileUpload(e, setServiceForm, 'heroImage', serviceForm)} 
                 />
                 
                 <h3 className="font-bold text-lg border-b pb-2 pt-6">Section 1 (Wholesale)</h3>
                 <InputGroup label="Title" value={serviceForm.section1Title} onChange={v => setServiceForm({...serviceForm, section1Title: v})} />
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text</label>
                 <textarea className="w-full border p-2 rounded-lg mb-4" rows={3} value={serviceForm.section1Text} onChange={e => setServiceForm({...serviceForm, section1Text: e.target.value})} />
                 <ImageUploadGroup 
                    label="Image" 
                    preview={serviceForm.section1Image} 
                    loading={uploadingField === 'section1Image'}
                    onChange={(e) => handleFileUpload(e, setServiceForm, 'section1Image', serviceForm)} 
                 />

                 <h3 className="font-bold text-lg border-b pb-2 pt-6">Section 2 (Training)</h3>
                 <InputGroup label="Title" value={serviceForm.section2Title} onChange={v => setServiceForm({...serviceForm, section2Title: v})} />
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text</label>
                 <textarea className="w-full border p-2 rounded-lg mb-4" rows={3} value={serviceForm.section2Text} onChange={e => setServiceForm({...serviceForm, section2Text: e.target.value})} />
                 <ImageUploadGroup 
                    label="Image" 
                    preview={serviceForm.section2Image} 
                    loading={uploadingField === 'section2Image'}
                    onChange={(e) => handleFileUpload(e, setServiceForm, 'section2Image', serviceForm)} 
                 />

                 <SaveButton onClick={saveServices} />
             </div>
         )}

         {/* ABOUT TAB */}
         {activeTab === 'about' && (
             <div>
                 <div className="flex gap-4 mb-6">
                    {['content', 'team'].map(st => (
                        <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${subTab === st ? 'bg-nomad-black text-white' : 'bg-gray-100 text-gray-500'}`}>{st}</button>
                    ))}
                 </div>

                 {subTab === 'content' && (
                     <div className="space-y-6 animate-fade-in">
                         <InputGroup label="Hero Title" value={aboutForm.heroTitle} onChange={v => setAboutForm({...aboutForm, heroTitle: v})} />
                         <InputGroup label="Hero Subtitle" value={aboutForm.heroSubtitle} onChange={v => setAboutForm({...aboutForm, heroSubtitle: v})} />
                         <ImageUploadGroup 
                            label="Hero Image" 
                            preview={aboutForm.heroImage} 
                            loading={uploadingField === 'heroImage'}
                            onChange={(e) => handleFileUpload(e, setAboutForm, 'heroImage', aboutForm)} 
                         />
                         <InputGroup label="Story Title" value={aboutForm.storyTitle} onChange={v => setAboutForm({...aboutForm, storyTitle: v})} />
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Story Text</label>
                         <textarea className="w-full border p-2 rounded-lg" rows={4} value={aboutForm.storyText} onChange={e => setAboutForm({...aboutForm, storyText: e.target.value})} />
                         <SaveButton onClick={saveAbout} />
                     </div>
                 )}

                 {subTab === 'team' && (
                     <div className="space-y-6 animate-fade-in">
                         {teamList.map((member, i) => (
                             <div key={i} className="flex gap-4 items-center border p-4 rounded-xl">
                                 <img src={member.img} alt="" className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                                 <div className="flex-grow grid grid-cols-3 gap-4">
                                     <InputGroup label="Name" value={member.name} onChange={v => updateTeamMember(i, 'name', v)} />
                                     <InputGroup label="Role" value={member.role} onChange={v => updateTeamMember(i, 'role', v)} />
                                     <div>
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Photo</label>
                                        <label className="cursor-pointer bg-gray-50 border p-2 rounded flex items-center gap-2 hover:bg-gray-100">
                                            {uploadingField === `team-${i}` ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
                                            <span className="text-xs">Upload</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTeamUpload(e, i)} />
                                        </label>
                                     </div>
                                 </div>
                                 <button onClick={() => removeTeamMember(i)} className="text-red-400 p-2"><Trash size={18} /></button>
                             </div>
                         ))}
                         <button onClick={addTeamMember} className="flex items-center gap-2 text-nomad-gold font-bold uppercase text-xs"><Plus size={16} /> Add Member</button>
                         <SaveButton onClick={saveTeam} />
                     </div>
                 )}
             </div>
         )}

         {/* CONTACT TAB */}
         {activeTab === 'contact' && (
             <div className="space-y-6 animate-fade-in">
                 <InputGroup label="Address" value={contactForm.address} onChange={v => setContactForm({...contactForm, address: v})} />
                 <InputGroup label="Email" value={contactForm.email} onChange={v => setContactForm({...contactForm, email: v})} />
                 <InputGroup label="Phone" value={contactForm.phone} onChange={v => setContactForm({...contactForm, phone: v})} />
                 <SaveButton onClick={saveContact} />
             </div>
         )}

         {/* SOCIALS TAB */}
         {activeTab === 'socials' && (
             <div className="space-y-6 animate-fade-in">
                 <InputGroup label="Instagram" value={socialsForm.instagram} onChange={v => setSocialsForm({...socialsForm, instagram: v})} />
                 <InputGroup label="Facebook" value={socialsForm.facebook} onChange={v => setSocialsForm({...socialsForm, facebook: v})} />
                 <InputGroup label="YouTube" value={socialsForm.youtube} onChange={v => setSocialsForm({...socialsForm, youtube: v})} />
                 <InputGroup label="Twitter" value={socialsForm.twitter} onChange={v => setSocialsForm({...socialsForm, twitter: v})} />
                 <SaveButton onClick={saveSocials} />
             </div>
         )}
      </div>
    </AdminLayout>
  );
};

// Helper Components
const InputGroup = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">{label}</label>
        <input className="w-full border p-3 rounded-xl" value={value} onChange={e => onChange(e.target.value)} />
    </div>
);

const ImageUploadGroup = ({ label, preview, onChange, loading }: { label: string, preview: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, loading: boolean }) => (
    <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>
        <div className="flex items-center gap-4">
            {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border" />}
            <label className={`cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? <Loader2 size={16} className="animate-spin text-nomad-gold" /> : <Upload size={16} className="text-gray-500" />}
                <span className="text-sm font-medium text-gray-600">{loading ? 'Uploading...' : 'Upload Image'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={onChange} />
            </label>
        </div>
    </div>
);

const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="bg-nomad-black text-white px-8 py-3 rounded-xl font-bold uppercase hover:bg-nomad-gold transition-colors">Save Changes</button>
);

export default ContentManager;