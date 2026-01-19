import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import * as ReactRouterDOM from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X, Filter, Search, Check, ChevronRight } from 'lucide-react';

type SortOption = 'featured' | 'newest';

const { useSearchParams, Link, useParams } = ReactRouterDOM;

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const { products, categories, siteContent } = useStore();

  // Derived state from URL
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const searchParam = searchParams.get('search');

  // STRICT CATEGORY ENFORCEMENT
  // Using categories from StoreContext which mirrors NAVIGATION_LINKS
  const allCategories = categories;

  // Close drawers on resize or route change
  useEffect(() => {
    setIsFilterOpen(false);
    setIsSortOpen(false);
  }, [searchParams, collectionId]);

  // Prevent body scroll when filter is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterOpen]);

  // Filtering Logic
  let filteredProducts = products.filter(product => {
    // 0. Search Filter
    if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
    }

    // 1. Collection ID Path (Legacy / Direct Link)
    if (collectionId) {
       const normalizedCollection = collectionId.toLowerCase().replace(/-/g, ' ');
       if (normalizedCollection === 'all') return true;
       // Check against category or tags
       const matchesCategory = product.category?.toLowerCase() === normalizedCollection;
       const matchesTag = product.tags?.some(tag => tag.toLowerCase() === normalizedCollection);
       return matchesCategory || matchesTag;
    }

    // 2. Main Category Filter
    if (categoryParam) {
      const matchCat = product.category === categoryParam;
      // Also allow matching if the category name exists in tags (e.g. product is generic but tagged)
      const matchTag = product.tags?.includes(categoryParam);
      
      if (!matchCat && !matchTag) return false;
    }

    // 3. Subcategory Filter
    if (subcategoryParam) {
      const matchSub = product.tags?.some(t => t.toLowerCase() === subcategoryParam.toLowerCase());
      if (!matchSub) return false;
    }

    return true;
  });

  // Sorting Logic
  filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
          case 'newest': return 0; // Assuming API order is newest or random.
          default: return 0; // Featured
      }
  });

  // Toggle Main Category
  const toggleCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryParam === cat) {
        newParams.delete('category');
        newParams.delete('subcategory'); // Clear sub if main is cleared
    } else {
        newParams.set('category', cat);
        newParams.delete('subcategory'); // Clear sub when switching main
    }
    setSearchParams(newParams);
  };

  // Toggle Subcategory
  const toggleSubcategory = (sub: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (subcategoryParam === sub) {
        newParams.delete('subcategory');
    } else {
        newParams.set('subcategory', sub);
    }
    setSearchParams(newParams);
  };

  const getPageTitle = () => {
    if (searchParam) return `Search: "${searchParam}"`;
    if (collectionId) return collectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (categoryParam) return categoryParam;
    return siteContent.shop?.heroTitle || 'All Products';
  };

  const getPageSubtitle = () => {
      if (searchParam || categoryParam || collectionId) return `Explore our collection of ${filteredProducts.length} items.`;
      return siteContent.shop?.heroSubtitle || "Explore our complete collection of premium coffee and gear.";
  };

  const clearFilters = () => {
    setSearchParams({});
    setSortBy('featured');
    setIsFilterOpen(false);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-nomad-paper">
      
      {/* Editorial Header */}
      <div className="bg-nomad-black text-white pt-28 md:pt-40 pb-16 md:pb-20 rounded-b-[2rem] md:rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 md:px-12 text-center md:text-left relative z-10">
           <span className="block text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 animate-slide-up">Collection</span>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-4 md:mb-6 animate-slide-up leading-none" style={{ animationDelay: '0.1s' }}>
             {getPageTitle()}
           </h1>
           <p className="text-gray-400 text-sm md:text-lg max-w-xl animate-slide-up font-light mx-auto md:mx-0" style={{ animationDelay: '0.2s' }}>
             {getPageSubtitle()}
           </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[72px] md:top-[74px] z-30 bg-nomad-paper/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="container mx-auto px-6 md:px-12 py-3 md:py-4 flex flex-row justify-between items-center gap-4">
           <div className="flex items-center space-x-2 md:space-x-6">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group bg-white md:bg-transparent px-4 py-2 md:p-0 rounded-full border border-gray-100 md:border-none shadow-sm md:shadow-none"
                >
                    <SlidersHorizontal size={14} className="mr-2" /> Filter
                </button>
                {(searchParam || categoryParam || subcategoryParam) && (
                    <button onClick={clearFilters} className="flex items-center text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                        <X size={14} className="mr-1" /> Clear
                    </button>
                )}
           </div>

           <div className="flex items-center gap-4 md:gap-6">
               <span className="text-xs font-medium text-gray-500 hidden sm:block uppercase tracking-wider">{filteredProducts.length} items</span>
               <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
               <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group"
                  >
                        Sort <span className="hidden md:inline text-inherit">by</span> <span className="hidden md:inline ml-1 text-gray-400 font-normal capitalize">({sortBy})</span>
                        <ChevronDown size={14} className={`ml-1 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Sort Dropdown */}
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-4 w-40 md:w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in slide-in-from-top-2">
                        {[
                          { label: 'Featured', value: 'featured' },
                          { label: 'Newest', value: 'newest' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => { setSortBy(option.value as SortOption); setIsSortOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-nomad-gray flex justify-between items-center ${sortBy === option.value ? 'text-nomad-gold' : 'text-gray-600'}`}
                          >
                            {option.label}
                            {sortBy === option.value && <Check size={12} />}
                          </button>
                        ))}
                    </div>
                  )}
               </div>
           </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <div 
        className={`fixed inset-0 z-[60] bg-nomad-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      ></div>
      <div className={`fixed inset-y-0 right-0 z-[61] w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="font-serif font-bold text-xl">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-8">
                {/* Dynamic Category List */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h3>
                    <div className="space-y-2">
                        {allCategories.map(cat => {
                           const isSelected = categoryParam === cat.title;
                           
                           return (
                             <div key={cat.title} className="space-y-2">
                                {/* Main Category */}
                                <button 
                                    onClick={() => toggleCategory(cat.title)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${isSelected ? 'bg-nomad-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <span className="font-bold text-sm">{cat.title}</span>
                                    {isSelected && <Check size={14} />}
                                </button>
                                
                                {/* Subcategories (Visible only if Main is selected) */}
                                {isSelected && (
                                    <div className="pl-4 space-y-1 animate-slide-down">
                                        {cat.items.map(sub => (
                                            <button 
                                                key={sub}
                                                onClick={() => toggleSubcategory(sub)}
                                                className={`w-full flex items-center gap-2 p-2 text-sm transition-colors ${subcategoryParam === sub ? 'text-nomad-gold font-bold' : 'text-gray-500 hover:text-nomad-black'}`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${subcategoryParam === sub ? 'border-nomad-gold bg-nomad-gold' : 'border-gray-300'}`}>
                                                    {subcategoryParam === sub && <Check size={10} className="text-white" />}
                                                </div>
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                )}
                             </div>
                           );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-nomad-gray">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-nomad-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-colors"
                >
                    Show {filteredProducts.length} Results
                </button>
                <button 
                    onClick={clearFilters} 
                    className="w-full mt-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-nomad-black transition-colors"
                >
                    Reset All Filters
                </button>
            </div>
         </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="fade-up" style={{ transitionDelay: '0.2s' }}>
             {filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
                  {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} variant="poster" />
                  ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-32 text-center">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Search size={32} className="text-gray-400" />
                 </div>
                 <h3 className="text-3xl font-serif font-bold mb-4 text-gray-900">No matches found</h3>
                 <p className="text-gray-500 mb-8 max-w-md">We couldn't find any products matching your selection. Try checking for typos or browse our full collection.</p>
                 <Link to="/shop" onClick={clearFilters} className="bg-nomad-black text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-nomad-gold transition-colors shadow-lg">
                    View All Products
                 </Link>
               </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default Shop;