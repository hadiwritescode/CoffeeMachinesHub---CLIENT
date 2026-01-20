import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { useStore } from '../../context/StoreContext';
import { Plus, Trash, User, Upload, Loader2, Link as LinkIcon, Save } from 'lucide-react';
import { TeamMember, Testimonial, FAQItem, CoreValue, LinkItem } from '../../types';

const AutoTextarea = ({ value, onChange, placeholder, className, minRows = 2 }: any) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            rows={minRows}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${className} resize-none overflow-hidden`}
        />
    );
};

const ContentManager: React.FC = () => {
  const { 
      siteContent, updateSiteContent, 
      testimonials, addTestimonial, updateTestimonial, removeTestimonial,
      uploadFile 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'services' | 'about' | 'contact' | 'global'>('home');
  const [subTab, setSubTab] = useState<string>('hero');
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Form States (Initialized with current content)
  const [heroForm, setHeroForm] = useState(siteContent.hero);
  const [homeTextForm, setHomeTextForm] = useState(siteContent.home);
  const [brands, setBrands] = useState(siteContent.home?.brands || []);
  const [trendingTags, setTrendingTags] = useState(siteContent.home?.trendingTags || []);
  
  const [shopForm, setShopForm] = useState(siteContent.shop || { heroTitle: '', heroSubtitle: '' });
  const [serviceForm, setServiceForm] = useState(siteContent.services);
  const [aboutForm, setAboutForm] = useState(siteContent.about);
  const [contactForm, setContactForm] = useState(siteContent.contact);
  const [socialsForm, setSocialsForm] = useState(siteContent.socials);
  const [teamList, setTeamList] = useState<TeamMember[]>(siteContent.team);
  const [footerForm, setFooterForm] = useState(siteContent.footer || { description: '', companyLinks: [], legalLinks: [] });
  
  // Local state for testimonials to allow editing
  const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
      setLocalTestimonials(testimonials);
  }, [testimonials]);

  // Save Handlers
  const saveHomeHero = async () => { await updateSiteContent('hero', heroForm); };
  const saveHomeText = async () => { await updateSiteContent('home', { ...homeTextForm, brands, trendingTags }); };
  const saveShop = async () => { await updateSiteContent('shop', shopForm); };
  const saveServices = async () => { await updateSiteContent('services', serviceForm); };
  const saveAbout = async () => { await updateSiteContent('about', aboutForm); };
  const saveTeam = async () => { await updateSiteContent('team', teamList); };
  const saveContact = async () => { await updateSiteContent('contact', contactForm); };
  const saveFooter = async () => { await updateSiteContent('footer', footerForm); await updateSiteContent('socials', socialsForm); };

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

  // List Helper Generic
  const updateLinkItem = (setter: any, list: LinkItem[], idx: number, field: keyof LinkItem, val: string) => {
      const newList = [...list];
      newList[idx] = { ...newList[idx], [field]: val };
      setter(newList);
  };
  const addLinkItem = (setter: any, list: LinkItem[]) => {
      setter([...list, { label: 'New Link', href: '/' }]);
  };
  const removeLinkItem = (setter: any, list: LinkItem[], idx: number) => {
      setter(list.filter((_, i) => i !== idx));
  };

  // Service List Helpers
  const addServicePoint = () => {
      const newList = [...(serviceForm.section1List || []), 'New Benefit'];
      setServiceForm({ ...serviceForm, section1List: newList });
  };
  const updateServicePoint = (index: number, val: string) => {
      const newList = [...(serviceForm.section1List || [])];
      newList[index] = val;
      setServiceForm({ ...serviceForm, section1List: newList });
  };
  const removeServicePoint = (index: number) => {
      const newList = (serviceForm.section1List || []).filter((_, i) => i !== index);
      setServiceForm({ ...serviceForm, section1List: newList });
  };

  // FAQ Helpers
  const addFaq = () => {
     setContactForm({ 
         ...contactForm, 
         faqs: [...(contactForm.faqs || []), { question: 'New Question', answer: 'New Answer' }] 
     });
  };
  const updateFaq = (idx: number, field: keyof FAQItem, val: string) => {
      const newFaqs = [...(contactForm.faqs || [])];
      newFaqs[idx] = { ...newFaqs[idx], [field]: val };
      setContactForm({ ...contactForm, faqs: newFaqs });
  };
  const removeFaq = (idx: number) => {
      const newFaqs = contactForm.faqs.filter((_, i) => i !== idx);
      setContactForm({ ...contactForm, faqs: newFaqs });
  };

  // Core Values Helpers
  const addCoreValue = () => {
      const currentValues = aboutForm.values || [];
      setAboutForm({ ...aboutForm, values: [...currentValues, { title: 'Title', text: 'Description' }] });
  };
  const updateCoreValue = (idx: number, field: keyof CoreValue, val: string) => {
      const currentValues = [...(aboutForm.values || [])];
      currentValues[idx] = { ...currentValues[idx], [field]: val };
      setAboutForm({ ...aboutForm, values: currentValues });
  };
  const removeCoreValue = (idx: number) => {
      const currentValues = (aboutForm.values || []).filter((_, i) => i !== idx);
      setAboutForm({ ...aboutForm, values: currentValues });
  };

  // Testimonial Helpers
  const handleAddTestimonial = async () => {
    await addTestimonial({ id: `new-${Date.now()}`, name: 'New User', role: 'Customer', text: 'Review...', rating: 5 });
  };
  const handleUpdateTestimonial = async (t: Testimonial) => {
      await updateTestimonial(t);
  };
  const handleDeleteTestimonial = async (id: string) => {
    await removeTestimonial(id);
  };
  const handleLocalTestimonialChange = (idx: number, field: keyof Testimonial, val: any) => {
      const newList = [...localTestimonials];
      newList[idx] = { ...newList[idx], [field]: val };
      setLocalTestimonials(newList);
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
         {['global', 'home', 'shop', 'services', 'about', 'contact'].map((tab) => (
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
         
         {/* GLOBAL / FOOTER TAB */}
         {activeTab === 'global' && (
             <div className="space-y-8 animate-fade-in">
                 <div>
                    <h3 className="font-bold text-lg mb-4">Footer Settings</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Footer Description</label>
                            <AutoTextarea className="w-full border p-3 rounded-xl" minRows={3} value={footerForm.description} onChange={(e: any) => setFooterForm({...footerForm, description: e.target.value})} />
                        </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                        <h4 className="font-bold text-sm uppercase text-nomad-gold mb-3">Company Links</h4>
                        <div className="space-y-3">
                            {(footerForm.companyLinks || []).map((link, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input className="w-1/3 border p-2 rounded-lg text-sm" placeholder="Label" value={link.label} onChange={e => updateLinkItem(l => setFooterForm({...footerForm, companyLinks: l}), footerForm.companyLinks || [], idx, 'label', e.target.value)} />
                                    <input className="w-2/3 border p-2 rounded-lg text-sm" placeholder="Link (/path)" value={link.href} onChange={e => updateLinkItem(l => setFooterForm({...footerForm, companyLinks: l}), footerForm.companyLinks || [], idx, 'href', e.target.value)} />
                                    <button onClick={() => removeLinkItem(l => setFooterForm({...footerForm, companyLinks: l}), footerForm.companyLinks || [], idx)} className="text-red-400"><Trash size={16}/></button>
                                </div>
                            ))}
                            <button onClick={() => addLinkItem(l => setFooterForm({...footerForm, companyLinks: l}), footerForm.companyLinks || [])} className="text-xs font-bold text-nomad-gold flex items-center gap-1"><Plus size={12}/> Add Link</button>
                        </div>
                     </div>
                     <div>
                        <h4 className="font-bold text-sm uppercase text-nomad-gold mb-3">Legal Links</h4>
                        <div className="space-y-3">
                            {(footerForm.legalLinks || []).map((link, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input className="w-1/3 border p-2 rounded-lg text-sm" placeholder="Label" value={link.label} onChange={e => updateLinkItem(l => setFooterForm({...footerForm, legalLinks: l}), footerForm.legalLinks || [], idx, 'label', e.target.value)} />
                                    <input className="w-2/3 border p-2 rounded-lg text-sm" placeholder="Link (/path)" value={link.href} onChange={e => updateLinkItem(l => setFooterForm({...footerForm, legalLinks: l}), footerForm.legalLinks || [], idx, 'href', e.target.value)} />
                                    <button onClick={() => removeLinkItem(l => setFooterForm({...footerForm, legalLinks: l}), footerForm.legalLinks || [], idx)} className="text-red-400"><Trash size={16}/></button>
                                </div>
                            ))}
                            <button onClick={() => addLinkItem(l => setFooterForm({...footerForm, legalLinks: l}), footerForm.legalLinks || [])} className="text-xs font-bold text-nomad-gold flex items-center gap-1"><Plus size={12}/> Add Link</button>
                        </div>
                     </div>
                 </div>

                 <div>
                    <h3 className="font-bold text-lg mb-4">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="Instagram" value={socialsForm.instagram} onChange={v => setSocialsForm({...socialsForm, instagram: v})} />
                        <InputGroup label="Facebook" value={socialsForm.facebook} onChange={v => setSocialsForm({...socialsForm, facebook: v})} />
                        <InputGroup label="YouTube" value={socialsForm.youtube} onChange={v => setSocialsForm({...socialsForm, youtube: v})} />
                        <InputGroup label="Twitter" value={socialsForm.twitter} onChange={v => setSocialsForm({...socialsForm, twitter: v})} />
                    </div>
                 </div>
                 <SaveButton onClick={saveFooter} />
             </div>
         )}

         {/* HOME TAB */}
         {activeTab === 'home' && (
             <div>
                <div className="flex gap-4 mb-6">
                    {['hero', 'sections', 'brands', 'testimonials'].map(st => (
                        <button key={st} onClick={() => setSubTab(st)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase ${subTab === st ? 'bg-nomad-black text-white' : 'bg-gray-100 text-gray-500'}`}>{st}</button>
                    ))}
                </div>

                {subTab === 'hero' && (
                    <div className="space-y-6 animate-fade-in">
                        <InputGroup label="Title" value={heroForm.title} onChange={v => setHeroForm({...heroForm, title: v})} />
                        <InputGroup label="Subtitle" value={heroForm.subtitle} onChange={v => setHeroForm({...heroForm, subtitle: v})} />
                        <InputGroup label="Video URL (Use link for video)" value={heroForm.videoUrl} onChange={v => setHeroForm({...heroForm, videoUrl: v})} />
                        <InputGroup label="Button Text" value={heroForm.buttonText} onChange={v => setHeroForm({...heroForm, buttonText: v})} />
                        
                        <div className="pt-4 border-t border-gray-100">
                             <InputGroup label="Marquee Text (Top Banner)" value={homeTextForm.marqueeText || ''} onChange={v => setHomeTextForm({...homeTextForm, marqueeText: v})} />
                             <p className="text-[10px] text-gray-400 mt-1">Text that scrolls horizontally. Use '•' to separate points.</p>
                        </div>

                        <div>
                             <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Trending Search Tags</label>
                             <div className="flex flex-wrap gap-2 mb-2">
                                 {trendingTags.map((tag, idx) => (
                                     <span key={idx} className="bg-gray-100 border px-3 py-1 rounded-full text-xs flex items-center gap-2">
                                         {tag} <button onClick={() => setTrendingTags(trendingTags.filter((_, i) => i !== idx))} className="text-gray-400 hover:text-red-500"><Trash size={12}/></button>
                                     </span>
                                 ))}
                             </div>
                             <div className="flex gap-2">
                                 <input id="newTagInput" className="border p-2 rounded-lg text-sm" placeholder="New Tag" />
                                 <button onClick={() => {
                                     const el = document.getElementById('newTagInput') as HTMLInputElement;
                                     if(el.value) { setTrendingTags([...trendingTags, el.value]); el.value = ''; }
                                 }} className="bg-gray-100 px-4 rounded-lg font-bold text-xs hover:bg-gray-200">Add</button>
                             </div>
                        </div>

                        <SaveButton onClick={saveHomeHero} />
                    </div>
                )}

                {subTab === 'sections' && (
                    <div className="space-y-6 animate-fade-in">
                        <h3 className="font-bold text-lg border-b pb-2">Collection Section</h3>
                        <InputGroup label="Title (Small)" value={homeTextForm.collectionTitle} onChange={v => setHomeTextForm({...homeTextForm, collectionTitle: v})} />
                        <InputGroup label="Heading" value={homeTextForm.collectionSubtitle} onChange={v => setHomeTextForm({...homeTextForm, collectionSubtitle: v})} />
                        
                        <h3 className="font-bold text-lg border-b pb-2 pt-4">Featured Machines Section</h3>
                        <InputGroup label="Heading" value={homeTextForm.featuredTitle} onChange={v => setHomeTextForm({...homeTextForm, featuredTitle: v})} />
                        
                        <h3 className="font-bold text-lg border-b pb-2 pt-4">Favorites Section</h3>
                        <InputGroup label="Title (Small)" value={homeTextForm.favoritesTitle} onChange={v => setHomeTextForm({...homeTextForm, favoritesTitle: v})} />
                        <InputGroup label="Heading" value={homeTextForm.favoritesSubtitle} onChange={v => setHomeTextForm({...homeTextForm, favoritesSubtitle: v})} />

                        <h3 className="font-bold text-lg border-b pb-2 pt-4">Partners Section</h3>
                        <InputGroup label="Text" value={homeTextForm.partnersText} onChange={v => setHomeTextForm({...homeTextForm, partnersText: v})} />
                        
                        <SaveButton onClick={saveHomeText} />
                    </div>
                )}

                {subTab === 'brands' && (
                    <div className="space-y-4 animate-fade-in">
                        <p className="text-gray-500 text-sm">Enter brand names separated by comma.</p>
                        <AutoTextarea className="w-full border p-4 rounded-xl" minRows={5} value={brands.join(', ')} onChange={(e: any) => setBrands(e.target.value.split(',').map((s: string) => s.trim()))} />
                        <SaveButton onClick={saveHomeText} />
                    </div>
                )}

                {subTab === 'testimonials' && (
                    <div className="space-y-6 animate-fade-in">
                        {localTestimonials.map((t, idx) => (
                            <div key={t.id} className="border p-4 rounded-xl flex gap-4 items-start bg-gray-50">
                                <div className="flex-grow grid grid-cols-2 gap-4">
                                    <div className="col-span-2 text-xs text-gray-400">ID: {t.id}</div>
                                    <InputGroup label="Name" value={t.name} onChange={(v) => handleLocalTestimonialChange(idx, 'name', v)} /> 
                                    <InputGroup label="Role" value={t.role} onChange={(v) => handleLocalTestimonialChange(idx, 'role', v)} />
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Review</label>
                                        <AutoTextarea 
                                            className="w-full border p-2 rounded-lg" 
                                            value={t.text} 
                                            onChange={(e: any) => handleLocalTestimonialChange(idx, 'text', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-between items-center mt-2">
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs font-bold uppercase text-gray-500">Rating:</label>
                                            <input 
                                                type="number" min="1" max="5" 
                                                className="border w-16 p-1 rounded" 
                                                value={t.rating} 
                                                onChange={(e) => handleLocalTestimonialChange(idx, 'rating', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <button 
                                            onClick={() => handleUpdateTestimonial(t)}
                                            className="flex items-center gap-2 bg-nomad-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-nomad-gold transition-colors"
                                        >
                                            <Save size={14} /> Save
                                        </button>
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteTestimonial(t.id)} className="text-red-400 hover:text-red-600 p-2"><Trash size={18} /></button>
                            </div>
                        ))}
                        <button onClick={handleAddTestimonial} className="flex items-center gap-2 text-nomad-gold font-bold uppercase text-xs hover:bg-nomad-gold/10 p-3 rounded-lg"><Plus size={16} /> Add Testimonial</button>
                    </div>
                )}
             </div>
         )}

         {/* SHOP TAB */}
         {activeTab === 'shop' && (
            <div className="space-y-6 animate-fade-in">
                <InputGroup label="Hero Title" value={shopForm.heroTitle} onChange={v => setShopForm({...shopForm, heroTitle: v})} />
                <InputGroup label="Hero Subtitle" value={shopForm.heroSubtitle} onChange={v => setShopForm({...shopForm, heroSubtitle: v})} />
                <SaveButton onClick={saveShop} />
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
                    onUrlChange={(val) => setServiceForm({...serviceForm, heroImage: val})}
                 />
                 
                 <h3 className="font-bold text-lg border-b pb-2 pt-6">Section 1 (Wholesale)</h3>
                 <InputGroup label="Title" value={serviceForm.section1Title} onChange={v => setServiceForm({...serviceForm, section1Title: v})} />
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text</label>
                 <AutoTextarea className="w-full border p-2 rounded-lg mb-4" minRows={3} value={serviceForm.section1Text} onChange={(e: any) => setServiceForm({...serviceForm, section1Text: e.target.value})} />
                 
                 {/* DYNAMIC LIST ADDED HERE */}
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-2">Key Benefits List</label>
                 <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    {(serviceForm.section1List || []).map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input 
                                className="flex-grow border p-2 rounded-lg text-sm"
                                value={point}
                                onChange={(e) => updateServicePoint(idx, e.target.value)}
                            />
                            <button onClick={() => removeServicePoint(idx)} className="text-red-400 hover:text-red-600 p-2"><Trash size={16} /></button>
                        </div>
                    ))}
                    <button onClick={addServicePoint} className="flex items-center gap-2 text-nomad-gold font-bold uppercase text-xs hover:bg-nomad-gold/10 p-2 rounded-lg transition-colors"><Plus size={14} /> Add Benefit</button>
                 </div>

                 <ImageUploadGroup 
                    label="Image" 
                    preview={serviceForm.section1Image} 
                    loading={uploadingField === 'section1Image'}
                    onChange={(e) => handleFileUpload(e, setServiceForm, 'section1Image', serviceForm)}
                    onUrlChange={(val) => setServiceForm({...serviceForm, section1Image: val})}
                 />

                 <h3 className="font-bold text-lg border-b pb-2 pt-6">Section 2 (Training)</h3>
                 <InputGroup label="Title" value={serviceForm.section2Title} onChange={v => setServiceForm({...serviceForm, section2Title: v})} />
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text</label>
                 <AutoTextarea className="w-full border p-2 rounded-lg mb-4" minRows={3} value={serviceForm.section2Text} onChange={(e: any) => setServiceForm({...serviceForm, section2Text: e.target.value})} />
                 <ImageUploadGroup 
                    label="Image" 
                    preview={serviceForm.section2Image} 
                    loading={uploadingField === 'section2Image'}
                    onChange={(e) => handleFileUpload(e, setServiceForm, 'section2Image', serviceForm)}
                    onUrlChange={(val) => setServiceForm({...serviceForm, section2Image: val})}
                 />

                 <h3 className="font-bold text-lg border-b pb-2 pt-6">Section 3 (Equipment Sourcing)</h3>
                 <InputGroup label="Title" value={serviceForm.section3Title} onChange={v => setServiceForm({...serviceForm, section3Title: v})} />
                 <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Text</label>
                 <AutoTextarea className="w-full border p-2 rounded-lg mb-4" minRows={3} value={serviceForm.section3Text} onChange={(e: any) => setServiceForm({...serviceForm, section3Text: e.target.value})} />
                 <ImageUploadGroup 
                    label="Image" 
                    preview={serviceForm.section3Image} 
                    loading={uploadingField === 'section3Image'}
                    onChange={(e) => handleFileUpload(e, setServiceForm, 'section3Image', serviceForm)}
                    onUrlChange={(val) => setServiceForm({...serviceForm, section3Image: val})}
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
                            onUrlChange={(val) => setAboutForm({...aboutForm, heroImage: val})}
                         />
                         <InputGroup label="Story Title" value={aboutForm.storyTitle} onChange={v => setAboutForm({...aboutForm, storyTitle: v})} />
                         <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Story Text</label>
                         <AutoTextarea className="w-full border p-2 rounded-lg" minRows={4} value={aboutForm.storyText} onChange={(e: any) => setAboutForm({...aboutForm, storyText: e.target.value})} />
                         
                         <h3 className="font-bold text-lg border-b pb-2 pt-6">Core Values</h3>
                         <div className="space-y-4">
                             {(aboutForm.values || []).map((val, idx) => (
                                 <div key={idx} className="border p-4 rounded-xl space-y-3 bg-gray-50">
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold uppercase text-gray-400">Value {idx + 1}</span>
                                         <button onClick={() => removeCoreValue(idx)} className="text-red-400 hover:text-red-600"><Trash size={16} /></button>
                                     </div>
                                     <input 
                                        className="w-full border p-2 rounded-lg" 
                                        placeholder="Title" 
                                        value={val.title} 
                                        onChange={e => updateCoreValue(idx, 'title', e.target.value)} 
                                     />
                                     <AutoTextarea 
                                        className="w-full border p-2 rounded-lg" 
                                        placeholder="Description" 
                                        minRows={2} 
                                        value={val.text} 
                                        onChange={(e: any) => updateCoreValue(idx, 'text', e.target.value)} 
                                     />
                                 </div>
                             ))}
                             <button onClick={addCoreValue} className="flex items-center gap-2 text-nomad-gold font-bold uppercase text-xs hover:bg-nomad-gold/10 p-2 rounded-lg"><Plus size={16} /> Add Value</button>
                         </div>

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
                                        <div className="flex flex-col gap-2">
                                            <label className="cursor-pointer bg-gray-50 border p-2 rounded flex items-center gap-2 hover:bg-gray-100">
                                                {uploadingField === `team-${i}` ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} 
                                                <span className="text-xs">Upload</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleTeamUpload(e, i)} />
                                            </label>
                                            <input 
                                                className="w-full border p-1 rounded text-xs" 
                                                placeholder="Or paste URL..."
                                                value={member.img} 
                                                onChange={e => updateTeamMember(i, 'img', e.target.value)} 
                                            />
                                        </div>
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
                 <h3 className="font-bold text-lg border-b pb-2">Contact Details</h3>
                 <InputGroup label="Address" value={contactForm.address} onChange={v => setContactForm({...contactForm, address: v})} />
                 <InputGroup label="Email" value={contactForm.email} onChange={v => setContactForm({...contactForm, email: v})} />
                 <InputGroup label="Phone" value={contactForm.phone} onChange={v => setContactForm({...contactForm, phone: v})} />
                 
                 <h3 className="font-bold text-lg border-b pb-2 pt-6">FAQs</h3>
                 <div className="space-y-4">
                     {(contactForm.faqs || []).map((faq, idx) => (
                         <div key={idx} className="border p-4 rounded-xl space-y-3 bg-gray-50">
                             <div className="flex justify-between items-center">
                                 <span className="text-xs font-bold uppercase text-gray-400">Question {idx + 1}</span>
                                 <button onClick={() => removeFaq(idx)} className="text-red-400 hover:text-red-600"><Trash size={16} /></button>
                             </div>
                             <input className="w-full border p-2 rounded-lg" placeholder="Question" value={faq.question} onChange={e => updateFaq(idx, 'question', e.target.value)} />
                             <AutoTextarea className="w-full border p-2 rounded-lg" placeholder="Answer" minRows={2} value={faq.answer} onChange={(e: any) => updateFaq(idx, 'answer', e.target.value)} />
                         </div>
                     ))}
                     <button onClick={addFaq} className="flex items-center gap-2 text-nomad-gold font-bold uppercase text-xs"><Plus size={16} /> Add FAQ</button>
                 </div>

                 <SaveButton onClick={saveContact} />
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

const ImageUploadGroup = ({ label, preview, onChange, onUrlChange, loading }: { label: string, preview: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, onUrlChange: (val: string) => void, loading: boolean }) => (
    <div>
        <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{label}</label>
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
                {preview && <img src={preview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border" />}
                <label className={`cursor-pointer bg-gray-50 border border-dashed border-gray-300 rounded-xl px-4 py-3 hover:bg-gray-100 transition-colors flex items-center gap-2 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {loading ? <Loader2 size={16} className="animate-spin text-nomad-gold" /> : <Upload size={16} className="text-gray-500" />}
                    <span className="text-sm font-medium text-gray-600">{loading ? 'Uploading...' : 'Upload Image'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={onChange} />
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
                        value={preview}
                        onChange={(e) => onUrlChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    </div>
);

const SaveButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="bg-nomad-black text-white px-8 py-3 rounded-xl font-bold uppercase hover:bg-nomad-gold transition-colors">Save Changes</button>
);

export default ContentManager;