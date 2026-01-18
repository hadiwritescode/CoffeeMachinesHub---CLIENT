import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';

const Blogs: React.FC = () => {
  return (
    <div className="pt-40 pb-20 animate-fade-in bg-nomad-paper">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20 fade-up">
          <span className="block text-nomad-gold text-xs font-bold tracking-[0.3em] uppercase mb-4">Coffee Culture</span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-nomad-black">The Journal</h1>
          <div className="w-20 h-1 bg-gray-200 mx-auto mb-6"></div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-serif italic">Stories, brewing guides, and news from the world of specialty coffee.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {BLOG_POSTS.map((post, index) => (
            <Link key={post.id} to={`/blogs/${post.id}`} className="group flex flex-col h-full fade-up" style={{ transitionDelay: `${index * 0.1}s` }}>
              <div className="overflow-hidden rounded-[2rem] mb-6 aspect-[4/3] shadow-md relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="flex-1 flex flex-col">
                 <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-bold text-nomad-gold uppercase tracking-[0.2em]">{post.date}</span>
                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{post.author}</span>
                 </div>
                 <h2 className="text-2xl font-serif font-bold mb-4 leading-tight group-hover:text-nomad-gold transition-colors">{post.title}</h2>
                 <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">{post.excerpt}</p>
                 <span className="mt-auto inline-block border-b-2 border-black w-max pb-1 text-[10px] font-bold uppercase tracking-[0.2em] group-hover:border-nomad-gold group-hover:text-nomad-gold transition-colors">
                   Read Article
                 </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogs;