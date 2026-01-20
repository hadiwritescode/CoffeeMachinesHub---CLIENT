import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X, Search, Check } from 'lucide-react';

type SortOption = 'featured' | 'newest' | 'price-low' | 'price-high';

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

  // Categories from context (Navigation structure)
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

  // --- Filtering Logic ---
  let filteredProducts = products.filter(product => {
    // 1. Search Filter
    if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
    }

    // 2. Collection ID Path
    if (collectionId && collectionId !== 'all') {
       const normalizedCollection = collectionId.toLowerCase().replace(/-/g, ' ');
       const matchesCategory = product.category?.toLowerCase() === normalizedCollection;
       const matchesTag = product.tags?.some(tag => tag.toLowerCase() === normalizedCollection);
       if (!matchesCategory && !matchesTag) return false;
    }

    // 3. Main Category Filter
    if (categoryParam) {
      const matchCat = product.category === categoryParam;
      const matchTag = product.tags?.includes(categoryParam);
      if (!matchCat && !matchTag) return false;
    }

    // 4. Subcategory Filter
    if (subcategoryParam) {
      const matchSub = product.tags?.some(t => t.toLowerCase() === subcategoryParam.toLowerCase());
      if (!matchSub) return false;
    }

    return true;
  });

  // --- Sorting Logic ---
  filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
          case 'newest': 
            return -1; 
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          default: 
            return (a.isFeatured === b.isFeatured) ? 0 : a.isFeatured ? -1 : 1;
      }
  });

  // Update URL helpers
  const toggleCategory = (cat: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (categoryParam === cat) {
        newParams.delete('category');
        newParams.delete('subcategory');
    } else {
        newParams.set('category', cat);
        newParams.delete('subcategory');
    }
    setSearchParams(newParams);
  };

  const toggleSubcategory = (sub: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (subcategoryParam === sub) {
        newParams.delete('subcategory');
    } else {
        newParams.set('subcategory', sub);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSortBy('featured');
    setIsFilterOpen(false);
  };

  const getPageTitle = () => {
    if (searchParam) return `Results for "${searchParam}"`;
    if (collectionId && collectionId !== 'all') return collectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (categoryParam) return categoryParam;
    return siteContent.shop?.heroTitle || 'All Products';
  };

  const getPageSubtitle = () => {
      if (searchParam) return `Found ${filteredProducts.length} items matching your search.`;
      if (categoryParam) return `Browse our selection of ${categoryParam}.`;
      return siteContent.shop?.heroSubtitle || "Explore our complete collection of premium coffee and gear.";
  };

  return (
    <div className="animate-fade-in min-h-screen bg-nomad-paper">
      
      {/* --- Editorial Header (Rectangular Bottom) --- */}
      <div className="bg-nomad-black text-white pt-32 pb-32 md:pt-40 md:pb-48 relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        {/* Abstract Gradient Blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nomad-gold/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>

        <div className="container mx-auto px-6 md:px-12 text-center md:text-left relative z-10">
           <span className="block text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 animate-slide-up">
             Collection
           </span>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-4 md:mb-6 animate-slide-up leading-none" style={{ animationDelay: '0.1s' }}>
             {getPageTitle()}
           </h1>
           <p className="text-gray-400 text-sm md:text-lg max-w-xl animate-slide-up font-light mx-auto md:mx-0 leading-relaxed" style={{ animationDelay: '0.2s' }}>
             {getPageSubtitle()}
           </p>
        </div>
      </div>

      {/* --- Main Content Area (Rounded Cut Top) --- */}
      <div className="bg-nomad-paper rounded-t-[3rem] md:rounded-t-[5rem] -mt-16 md:-mt-24 relative z-20 pt-8 pb-20 shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
          
          {/* --- Sticky Filter Bar --- */}
          <div className="sticky top-[70px] md:top-[74px] z-40 transition-all duration-300 mb-8">
            <div className="container mx-auto px-6 md:px-12">
               {/* Inner container with backdrop for stickiness */}
               <div className="bg-nomad-paper/95 backdrop-blur-md border border-nomad-black/5 rounded-2xl shadow-sm py-3 md:py-4 px-4 flex flex-row justify-between items-center gap-4">
                   {/* Left: Filter Toggle */}
                   <div className="flex items-center space-x-3 md:space-x-6">
                        <button 
                          onClick={() => setIsFilterOpen(true)}
                          className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group bg-white md:bg-transparent px-4 py-2.5 md:p-0 rounded-full border border-gray-100 md:border-none shadow-sm md:shadow-none"
                        >
                            <SlidersHorizontal size={14} className="mr-2" /> 
                            <span className="hidden md:inline">Filter</span>
                            <span className="md:hidden">Filters</span>
                        </button>
                        
                        {(searchParam || categoryParam || subcategoryParam) && (
                            <button onClick={clearFilters} className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                                <X size={14} className="mr-1" /> Clear
                            </button>
                        )}
                   </div>

                   {/* Right: Count & Sort */}
                   <div className="flex items-center gap-4 md:gap-6">
                       <span className="text-xs font-medium text-gray-500 hidden sm:block uppercase tracking-wider">
                           {filteredProducts.length} Results
                       </span>
                       <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
                       
                       <div className="relative">
                          <button 
                            onClick={() => setIsSortOpen(!isSortOpen)}
                            className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group"
                          >
                                Sort <span className="hidden md:inline text-inherit px-1">by</span> 
                                <span className="hidden md:inline text-gray-400 font-normal capitalize">
                                    {sortBy.replace('-', ' ')}
                                </span>
                                <ChevronDown size={14} className={`ml-1 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {/* Sort Dropdown */}
                          {isSortOpen && (
                            <div className="absolute right-0 top-full mt-4 w-40 md:w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 overflow-hidden">
                                {[
                                  { label: 'Featured', value: 'featured' },
                                  { label: 'Newest', value: 'newest' },
                                  { label: 'Price: Low to High', value: 'price-low' },
                                  { label: 'Price: High to Low', value: 'price-high' }
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => { setSortBy(option.value as SortOption); setIsSortOpen(false); }}
                                    className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-nomad-gray flex justify-between items-center transition-colors ${sortBy === option.value ? 'text-nomad-gold bg-gray-50' : 'text-gray-600'}`}
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
          </div>

          {/* --- Product Grid --- */}
          <div className="container mx-auto px-6 md:px-12">
            <div className="fade-up" style={{ transitionDelay: '0.2s' }}>
                 {filteredProducts.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} variant="poster" />
                      ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-32 text-center border-t border-b border-nomad-black/5">
                     <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                        <Search size={32} className="text-gray-300" />
                     </div>
                     <h3 className="text-3xl font-serif font-bold mb-4 text-nomad-black">No matches found</h3>
                     <p className="text-gray-500 mb-8 max-w-md mx-auto">
                        We couldn't find any products matching your selection. Try checking for typos or browse our full collection.
                     </p>
                     <Link to="/shop" onClick={clearFilters} className="bg-nomad-black text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-nomad-gold transition-colors shadow-lg">
                        Clear Filters
                     </Link>
                   </div>
                 )}
            </div>
          </div>
      </div>

      {/* --- Filter Drawer (Right Side) --- */}
      <div 
        className={`fixed inset-0 z-[60] bg-nomad-black/50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsFilterOpen(false)}
      ></div>
      
      <div className={`fixed inset-y-0 right-0 z-[61] w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <h2 className="font-serif font-bold text-xl text-nomad-black">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <X size={20} />
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-6 space-y-8">
                {/* Categories List */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Categories</h3>
                    <div className="space-y-2">
                        {allCategories.map(cat => {
                           const isSelected = categoryParam === cat.title;
                           
                           return (
                             <div key={cat.title} className="space-y-1">
                                {/* Main Category Button */}
                                <button 
                                    onClick={() => toggleCategory(cat.title)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all duration-200 ${isSelected ? 'bg-nomad-black text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <span className="font-bold text-sm tracking-wide">{cat.title}</span>
                                    {isSelected && <Check size={14} />}
                                </button>
                                
                                {/* Subcategories (Animated Expansion) */}
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="pl-4 pt-1 space-y-1 border-l-2 border-gray-100 ml-4 my-2">
                                        {cat.items.map(sub => (
                                            <button 
                                                key={sub}
                                                onClick={() => toggleSubcategory(sub)}
                                                className={`w-full flex items-center gap-3 p-2 text-sm transition-colors rounded-lg ${subcategoryParam === sub ? 'text-nomad-gold font-bold bg-nomad-gold/5' : 'text-gray-500 hover:text-nomad-black hover:bg-gray-50'}`}
                                            >
                                                <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-colors ${subcategoryParam === sub ? 'border-nomad-gold bg-nomad-gold' : 'border-gray-300'}`}>
                                                </div>
                                                {sub}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             </div>
                           );
                        })}
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 mt-auto">
                <button 
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full bg-nomad-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-all shadow-lg"
                >
                    Show {filteredProducts.length} Results
                </button>
                <button 
                    onClick={clearFilters} 
                    className="w-full mt-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                >
                    Reset All Filters
                </button>
            </div>
      </div>
    </div>
  );
};

export default Shop;