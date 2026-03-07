
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../supabase';
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, currentUser } = useStore();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect if already logged in via effect
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else navigate('/profile');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register(email, password, name);
        showToast("Account created! Please sign in.", "success");
        setIsRegister(false);
        setPassword('');
        setIsSubmitting(false);
      } else {
        await login(email, password);
        
        // Explicitly check role to route properly
        const { data } = await supabase.from('users').select('role').eq('email', email).single();
        
        setTimeout(() => {
             if (data?.role === 'admin') {
                 window.location.href = '/admin';
             } else {
                 window.location.href = '/profile';
             }
        }, 500);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "An error occurred", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-nomad-paper flex flex-col items-center justify-center py-32 animate-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4C5B0]/20 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B08B5B]/10 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="w-full max-w-md px-8 relative z-10">
        <div className="text-center mb-12 fade-up">
            <span className="text-nomad-gold text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block">
              {isRegister ? 'Join the Hub' : 'Members Only'}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-3 text-nomad-black">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-500 font-sans font-light">
                {isRegister ? 'Sign up to manage your inquiries and wishlist.' : 'Sign in to access your profile.'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl border border-white fade-up" style={{ transitionDelay: '0.1s' }}>
          
          {isRegister && (
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-nomad-gray border border-transparent focus:border-nomad-black rounded-xl px-5 py-4 pl-12 text-sm focus:outline-none transition-all placeholder:text-gray-300 font-medium" 
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-nomad-gray border border-transparent focus:border-nomad-black rounded-xl px-5 py-4 pl-12 text-sm focus:outline-none transition-all placeholder:text-gray-300 font-medium" 
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Password</label>
                {!isRegister && <a href="#" className="text-[10px] font-bold uppercase tracking-wider text-nomad-gold hover:text-nomad-black transition-colors">Forgot?</a>}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-nomad-gray border border-transparent focus:border-nomad-black rounded-xl px-5 py-4 pl-12 text-sm focus:outline-none transition-all placeholder:text-gray-300 font-medium" 
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-nomad-black text-white py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-all shadow-lg transform hover:-translate-y-1 duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500 fade-up" style={{ transitionDelay: '0.2s' }}>
          {isRegister ? 'Already have an account?' : 'New to Coffee Machines Hub?'} 
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-nomad-black hover:text-nomad-gold transition-colors ml-1 border-b border-nomad-black pb-0.5 hover:border-nomad-gold"
          >
            {isRegister ? 'Sign In' : 'Create account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
