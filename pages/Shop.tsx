import React from 'react';
import ProductCard from '../components/ProductCard';
import { ALL_PRODUCTS } from '../constants';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { ChevronDown, SlidersHorizontal, X, Filter, Search } from 'lucide-react';

const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { collectionId } = useParams<{ collectionId: string }>();

  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');
  const searchParam = searchParams.get('search');

  const filteredProducts = ALL_PRODUCTS.filter(product => {
    // 0. Search Filter (Priority)
    if (searchParam) {
        const query = searchParam.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(query);
        const matchesDesc = product.description?.toLowerCase().includes(query);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
    }

    // 1. URL Path Collection Filter (e.g., /collections/blends)
    if (collectionId) {
       const normalizedCollection = collectionId.toLowerCase().replace(/-/g, ' ');
       
       // Handle 'blends' specifically
       if (normalizedCollection === 'blends') {
         return product.tags?.some(tag => tag.toLowerCase() === 'blends');
       }
       
       // Handle 'all'
       if (normalizedCollection === 'all') return true;

       // General tag/category matching
       const matchesCategory = product.category?.toLowerCase() === normalizedCollection;
       const matchesTag = product.tags?.some(tag => tag.toLowerCase() === normalizedCollection);
       
       return matchesCategory || matchesTag;
    }

    // 2. Filter by specific subcategory (e.g., 'Blends', 'Pour Over')
    if (subcategoryParam) {
      if (product.tags) {
        return product.tags.some(tag => tag.toLowerCase() === subcategoryParam.toLowerCase() || tag.includes(subcategoryParam));
      }
      return false; 
    }

    // 3. Filter by main category if no subcategory is present
    if (categoryParam) {
      if (categoryParam === 'Coffee' && product.category === 'Coffee') return true;
      if (categoryParam === 'Brew Equipment' && product.category === 'Gear') return true;
      if (categoryParam === 'Merchandise' && product.category === 'Merchandise') return true;
      if (product.category === categoryParam) return true;
      return false;
    }

    return true;
  });

  // Determine Page Title & Description
  let pageTitle = 'All Products';
  let pageDescription = 'Explore our complete collection of premium coffee and gear.';

  if (searchParam) {
    pageTitle = `Search Results: "${searchParam}"`;
    pageDescription = `Found ${filteredProducts.length} items matching your search.`;
  } else if (collectionId) {
    const formattedTitle = collectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    pageTitle = formattedTitle;
    if (collectionId.toLowerCase() === 'blends') {
       pageDescription = 'Our signature blends, crafted for perfect balance and depth.';
    } else {
       pageDescription = `Browse our ${formattedTitle} collection.`;
    }
  } else if (subcategoryParam) {
    pageTitle = subcategoryParam;
    pageDescription = `Browse our finest selection of ${subcategoryParam}.`;
  } else if (categoryParam) {
    pageTitle = categoryParam;
    if (categoryParam === 'Coffee') pageDescription = 'Sustainably sourced, meticulously roasted.';
    if (categoryParam === 'Brew Equipment') pageDescription = 'Professional tools for the home barista.';
  }

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="animate-fade-in min-h-screen bg-nomad-paper">
      
      {/* Editorial Header */}
      <div className="bg-nomad-black text-white pt-40 pb-20 rounded-b-[3rem] shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-6 md:px-12 text-center md:text-left relative z-10">
           <span className="block text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-6 animate-slide-up">Collection</span>
           <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 animate-slide-up leading-none" style={{ animationDelay: '0.1s' }}>{pageTitle}</h1>
           <p className="text-gray-400 text-lg max-w-xl animate-slide-up font-light" style={{ animationDelay: '0.2s' }}>{pageDescription}</p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[64px] z-30 bg-nomad-paper/95 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="container mx-auto px-6 md:px-12 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
           <div className="flex items-center space-x-6">
                <button className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group">
                    <Filter size={16} className="mr-2" /> Filter
                </button>
                {(searchParam || categoryParam || subcategoryParam) && (
                    <button onClick={clearFilters} className="flex items-center text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors">
                        <X size={16} className="mr-1" /> Clear All
                    </button>
                )}
           </div>

           <div className="flex items-center gap-6">
               <span className="text-xs font-medium text-gray-500 hidden sm:block uppercase tracking-wider">{filteredProducts.length} items</span>
               <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
               <button className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-nomad-gold transition-colors group">
                    Sort by
                    <ChevronDown size={14} className="ml-1 group-hover:translate-y-0.5 transition-transform" />
               </button>
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="fade-up" style={{ transitionDelay: '0.2s' }}>
             {filteredProducts.length > 0 ? (
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
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
                 <Link to="/shop" onClick={clearFilters} className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-nomad-gold transition-colors shadow-lg">
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