import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { ALL_PRODUCTS } from '../constants';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X, Filter, Search, Check } from 'lucide-react';

type SortOption = 'featured' | 'newest';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { collectionId } = useParams<{ collectionId: string }>();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Derived state from URL
  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const searchParam = searchParams.get('search');

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
  let filteredProducts = ALL_PRODUCTS.filter(product => {
    // 0. Search Filter
    if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
    }

    // 1. Collection ID Path
    if (collectionId) {
       const normalizedCollection = collectionId.toLowerCase().replace(/-/g, ' ');
       if (normalizedCollection === 'blends') return product.tags?.some(tag => tag.toLowerCase() === 'blends');
       if (normalizedCollection === 'all') return true;
       const matchesCategory = product.category?.toLowerCase() === normalizedCollection;
       const matchesTag = product.tags?.some(tag => tag.toLowerCase() === normalizedCollection);
       return matchesCategory || matchesTag;
    }

    // 2. Subcategory (Tag)
    if (subcategoryParam) {
      return product.tags?.some(tag => tag.toLowerCase() === subcategoryParam.toLowerCase() || tag.includes(subcategoryParam));
    }

    // 3. Category
    if (categoryParam) {
      if (categoryParam === 'Coffee' && product.category === 'Coffee') return true;
      if (categoryParam === 'Brew Equipment' && product.category === 'Gear') return true;
      if (categoryParam === 'Merchandise' && product.category === 'Merchandise') return true;
      if (product.category === categoryParam) return true;
      return false;
    }

    return true;
  });

  // Sorting Logic
  filteredProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
          case 'newest': return 0; // Assuming API order is newest or random. Real app would have date.
          default: return 0; // Featured
      }
  });

  // Helper for filter links
  const toggleCategory = (cat: string) => {
    if (categoryParam === cat) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('category');
        setSearchParams(newParams);
    } else {
        setSearchParams({ category: cat });
    }
  };

  const getPageTitle = () => {
    if (searchParam) return `Search: "${searchParam}"`;
    if (collectionId) return collectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    if (subcategoryParam) return subcategoryParam;
    if (categoryParam) return categoryParam;
    return 'All Products';
  };

  const clearFilters = () => {
    setSearchParams({});
    setSortBy('featured');
    setIsFilterOpen(false);
  };

  return (
    <div className="animate-fade-in min-h-screen bg-nomad-paper">
      
      {/* Editorial Header */}
      <div className="bg-nomad-black text-white pt-32 md:pt-40 pb-16 md:pb-20 rounded-b-[2rem] md:rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 md:px-12 text-center md:text-left relative z-10">
           <span className="block text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 animate-slide-up">Collection</span>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-4 md:mb-6 animate-slide-up leading-none" style={{ animationDelay: '0.1s' }}>
             {getPageTitle()}
           </h1>
           <p className="text-gray-400 text-sm md:text-lg max-w-xl animate-slide-up font-light mx-auto md:mx-0" style={{ animationDelay: '0.2s' }}>
             Explore our complete collection of premium coffee and gear.
           </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-30 bg-nomad-paper/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="container mx-auto px-6 md:px-12 py-4 flex flex-row justify-between items-center gap-4">
           <div className="flex items-center space-x-4 md:space-x-6">
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group bg-white md:bg-transparent px-4 py-2 md:p-0 rounded-full border border-gray-100 md:border-none shadow-sm md:shadow-none"
                >
                    <SlidersHorizontal size={14} className="mr-2" /> Filter
                </button>
                {(searchParam || categoryParam || subcategoryParam) && (
                    <button onClick={clearFilters} className="hidden md:flex items-center text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
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
                        Sort by <span className="hidden md:inline ml-1 text-gray-400 font-normal capitalize">({sortBy})</span>
                        <ChevronDown size={14} className={`ml-1 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Sort Dropdown */}
                  {isSortOpen && (
                    <div className="absolute right-0 top-full mt-4 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-40 animate-in fade-in slide-in-from-top-2">
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

      {/* Filter Drawer (Mobile & Desktop) */}
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
                {/* Categories */}
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Category</h3>
                    <div className="space-y-3">
                        {['Coffee', 'Brew Equipment', 'Merchandise'].map(cat => (
                            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${categoryParam === cat ? 'bg-nomad-black border-nomad-black' : 'border-gray-300 group-hover:border-nomad-black'}`}>
                                    {categoryParam === cat && <Check size={12} className="text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={categoryParam === cat} 
                                    onChange={() => toggleCategory(cat)}
                                    className="hidden" 
                                />
                                <span className={`text-sm font-medium transition-colors ${categoryParam === cat ? 'text-nomad-black' : 'text-gray-600'}`}>{cat}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Roast Level (Mock - only shows if Coffee) */}
                {(!categoryParam || categoryParam === 'Coffee') && (
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Roast Level</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Light', 'Medium', 'Dark', 'Espresso'].map(roast => (
                                <button key={roast} className="px-4 py-2 bg-nomad-gray rounded-full text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-nomad-black hover:text-white transition-colors">
                                    {roast}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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