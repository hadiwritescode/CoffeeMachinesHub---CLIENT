import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { ArrowLeft } from 'lucide-react';

const { useParams, Link } = ReactRouterDOM;

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = BLOG_POSTS.find(p => p.id === id);

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

         {/* Hero Content - Added pt-32 to push content down from navbar visually if needed, though flex center handles most */}
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
            <p className="lead text-xl text-black font-serif italic mb-10">
                {post.excerpt}
            </p>
            {post.content.split('\n').map((paragraph, idx) => (
              <p key={idx} className="mb-6">{paragraph}</p>
            ))}
            <p className="mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <h3 className="text-3xl font-serif font-bold text-black mt-12 mb-8">The Perfect Brew</h3>
            <p className="mb-6">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <div className="my-12 p-8 bg-gray-50 rounded-2xl border-l-4 border-nomad-gold">
                <h4 className="font-bold text-lg mb-2 uppercase tracking-wide text-nomad-black">Pro Tip</h4>
                <p className="m-0 text-gray-600 italic">Always pre-wet your paper filter to remove any papery taste before brewing.</p>
            </div>

            <p>
               Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
               Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
            </p>
          </div>
          
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