import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const { Link, useNavigate } = ReactRouterDOM;

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
        login(email);
        if (email.includes('admin')) {
            navigate('/admin');
        } else {
            navigate('/profile');
        }
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
            <span className="text-nomad-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-4 block">Members Only</span>
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-3 text-nomad-black">Welcome Back</h1>
            <p className="text-gray-500 font-sans font-light">
                Sign in to access your rewards. <br/>
                <span className="text-xs opacity-60">(Hint: Use 'admin@nomad.com' for Admin Panel)</span>
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-10 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-white fade-up" style={{ transitionDelay: '0.1s' }}>
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-nomad-gray border border-transparent focus:border-nomad-black rounded-xl px-5 py-4 text-sm focus:outline-none transition-all placeholder:text-gray-300 font-medium" 
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Password</label>
                <a href="#" className="text-[10px] font-bold uppercase tracking-wider text-nomad-gold hover:text-nomad-black transition-colors">Forgot?</a>
            </div>
            <input 
              type="password" 
              className="w-full bg-nomad-gray border border-transparent focus:border-nomad-black rounded-xl px-5 py-4 text-sm focus:outline-none transition-all placeholder:text-gray-300 font-medium" 
              placeholder="••••••••"
              defaultValue="password" // Mock password
            />
          </div>
          
          <button type="submit" className="w-full bg-nomad-black text-white py-5 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-nomad-gold transition-colors shadow-lg transform hover:-translate-y-1 duration-200">
            Sign In
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-gray-500 fade-up" style={{ transitionDelay: '0.2s' }}>
          New to Coffee Machines Hub? <Link to="/contact" className="font-bold text-nomad-black hover:text-nomad-gold transition-colors ml-1 border-b border-nomad-black pb-0.5 hover:border-nomad-gold">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;