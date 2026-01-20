import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Loader2, ArrowRight } from 'lucide-react';

const { Link } = ReactRouterDOM;

const Blogs: React.FC = () => {
  const { blogPosts, loading } = useStore();

  return (
    <div className="animate-fade-in bg-nomad-paper min-h-screen">
      
      {/* Header Section */}
      <div className="pt-32 md:pt-40 pb-12 md:pb-20 container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="text-center mb-16 md:mb-32 fade-up">
          <span className="text-nomad-gold text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase mb-4 md:mb-6 block">
            Coffee Culture
          </span>
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-serif font-bold mb-6 md:mb-8 text-nomad-black leading-[0.9]">
            The Journal
          </h1>
          <div className="w-16 md:w-24 h-1 bg-nomad-gold mx-auto mb-6 md:mb-8 opacity-50"></div>
          <p className="text-base md:text-2xl font-serif italic text-gray-500 max-w-2xl mx-auto leading-relaxed px-4">
            Stories, brewing guides, and news from the world of specialty coffee.
          </p>
        </div>

        {loading ? (
            <div className="flex justify-center py-32">
                <Loader2 size={40} className="animate-spin text-nomad-gold" />
            </div>
        ) : blogPosts.length === 0 ? (
            <div className="text-center py-32 border-t border-b border-nomad-black/5">
                <p className="text-2xl font-serif italic text-gray-400">No articles published yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 lg:gap-y-24">
            {blogPosts.map((post, index) => (
                <Link key={post.id} to={`/blogs/${post.id}`} className="group flex flex-col h-full fade-up cursor-pointer" style={{ transitionDelay: `${index * 0.1}s` }}>
                
                {/* Image Container */}
                <div className="overflow-hidden rounded-[2rem] md:rounded-[2.5rem] mb-6 md:mb-8 aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] shadow-lg relative bg-white">
                    <div className="absolute inset-0 bg-nomad-black/0 group-hover:bg-nomad-black/5 transition-colors duration-500 z-10"></div>
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                    />
                    
                    {/* Date Badge */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-md px-3 py-1.5 md:px-4 md:py-2 rounded-full z-20">
                        <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-nomad-black">{post.date}</span>
                    </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col items-start px-2 md:px-0">
                    <div className="flex items-center gap-3 mb-3 md:mb-4">
                        <span className="text-[10px] font-bold text-nomad-gold uppercase tracking-[0.2em]">Article</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{post.author}</span>
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-serif font-bold mb-3 md:mb-4 leading-tight text-nomad-black group-hover:text-nomad-gold transition-colors duration-300">
                        {post.title}
                    </h2>
                    
                    <p className="text-gray-500 line-clamp-3 mb-5 md:mb-6 leading-relaxed font-light text-sm md:text-base">
                        {post.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center text-xs font-bold uppercase tracking-[0.2em] text-nomad-black border-b border-nomad-black/30 pb-1 group-hover:border-nomad-gold group-hover:text-nomad-gold transition-all">
                        Read Story <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
                </Link>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Blogs;