import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ButtonVariant } from '../types';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock login
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login attempted:', { email });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative transition-colors duration-300 overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Base Image Background with heavy overlay */}
         <img 
            src="https://images.unsplash.com/photo-1492551557933-34265f7af79e?q=80&w=2000&auto=format&fit=crop" 
            alt="Login Background" 
            className="w-full h-full object-cover opacity-10 blur-sm"
         />
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-40 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-200 dark:from-brand-900/50 via-white dark:via-slate-950 to-white dark:to-slate-950"></div>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8 group">
            <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-950 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-display">orign8</span>
        </Link>
        
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl px-8 py-10 transition-colors">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 text-center">Welcome back</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">Enter your credentials to access your workspace</p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors placeholder:text-slate-400"
                placeholder="name@company.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white px-4 py-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-colors placeholder:text-slate-400"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
               <label className="flex items-center cursor-pointer">
                 <input type="checkbox" className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-brand-600 focus:ring-brand-500" />
                 <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
               </label>
               <a href="#" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors">Forgot password?</a>
            </div>

            <Button 
              variant={ButtonVariant.PRIMARY} 
              fullWidth 
              className="mt-2"
              disabled={isLoading}
            >
               {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
             <p className="text-sm text-slate-500 dark:text-slate-500">Don't have an account? <Link to="/contact" className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium transition-colors">Book a demo</Link></p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};