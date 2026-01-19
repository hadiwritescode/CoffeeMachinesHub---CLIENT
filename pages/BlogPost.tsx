import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Loader2, Link as LinkIcon } from 'lucide-react';

const { useParams, Link } = ReactRouterDOM;

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogPosts, loading } = useStore();
  const post = blogPosts.find(p => p.id === id);

  if (loading) {
      return (
        <div className="h-[60vh] flex items-center justify-center bg-nomad-paper">
            <Loader2 size={40} className="animate-spin text-nomad-gold" />
        </div>
      );
  }

  if (!post) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center pt-32 bg-nomad-paper">
        <h2 className="text-2xl font-serif font-bold mb-4">Article not found</h2>
        <Link to="/blogs" className="text-nomad-gold underline uppercase tracking-widest text-xs font-bold">Return to Journal</Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in bg-nomad-paper pb-20">
      
      {/* Hero Section with Image Behind Text */}
      <div className="relative w-full h-[70vh] min-h-[500px] flex flex-col justify-center items-center text-center px-6">
         
         {/* Background Image */}
         <div className="absolute inset-0 overflow-hidden">
            <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-nomad-paper via-transparent to-black/30"></div>
         </div>

         {/* Hero Content */}
         <div className="relative z-10 max-w-4xl mx-auto pt-20 fade-up">
            <Link to="/blogs" className="inline-flex items-center text-white/80 hover:text-white mb-8 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors border-b border-white/20 pb-1 hover:border-white">
                <ArrowLeft size={16} className="mr-2" /> Back to Journal
            </Link>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-8 leading-tight drop-shadow-xl">
                {post.title}
            </h1>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-white/90">
                 <span>{post.date}</span>
                 <span className="hidden md:block w-1 h-1 bg-white rounded-full"></span>
                 <span>By {post.author}</span>
            </div>
         </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-8 max-w-3xl -mt-20 relative z-20 fade-up" style={{ transitionDelay: '0.2s' }}>
        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl border border-gray-100">
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-loose font-sans">
            {post.excerpt && (
                <p className="lead text-xl text-black font-serif italic mb-10">
                    {post.excerpt}
                </p>
            )}
            {post.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6 whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>

          {post.sourceLink && (
             <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-xs font-bold uppercase text-gray-400 mb-2">Reference / Source</p>
                <a href={post.sourceLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-nomad-gold hover:underline">
                   <LinkIcon size={14} /> {post.sourceLink}
                </a>
             </div>
          )}
          
          <div className="mt-16 pt-10 border-t border-gray-100 flex justify-between items-center">
             <div className="text-sm font-bold text-gray-500">Share this article</div>
             <div className="flex gap-4">
                 <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">FB</button>
                 <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">TW</button>
                 <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">LI</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;