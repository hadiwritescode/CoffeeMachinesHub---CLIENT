import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Loader2, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '../../components/Logo';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { login, currentUser } = useStore();
  const navigate = useNavigate();

  // Redirect if already logged in as admin
  React.useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await login(email, password);
      // The useEffect above will handle redirection upon successful auth state change
    } catch (err: any) {
      console.error(err);
      setError('Invalid credentials or insufficient permissions.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-nomad-black flex flex-col items-center justify-center py-20 px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-nomad-gold rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-nomad-dark-gold rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/10">
                <ShieldCheck className="text-nomad-gold" size={32} />
            </div>
            <h1 className="text-3xl font-serif font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Secure access for Coffee Machines Hub staff.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3 rounded-xl text-center">
                {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Admin Email</label>
            <div className="relative">
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 focus:border-nomad-gold rounded-xl px-5 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                placeholder="admin@coffeemachineshub.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 focus:border-nomad-gold rounded-xl px-5 py-4 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600 font-medium" 
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-nomad-gold text-white py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-nomad-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                Access Dashboard
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
            <a href="/" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2">
                &larr; Back to Shop
            </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;