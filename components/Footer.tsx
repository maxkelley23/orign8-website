import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const handleSocialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // In a real app, these would link to actual profiles
    console.log("Social link clicked");
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-10 font-sans relative z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 p-1.5 rounded-lg">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white font-display">orign8</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm text-sm leading-relaxed mb-6">
              Built by lenders, for lenders. We revolutionize client retention through hyper-realistic Voice AI.
            </p>
          </div>
          
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/product" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Voice AI</Link></li>
              <li><Link to="/product" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Integrations</Link></li>
              <li><Link to="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Security</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              <li><Link to="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Contact</Link></li>
              <li><Link to="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" onClick={(e) => e.preventDefault()} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} Orign8 Technologies Inc. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" onClick={handleSocialClick} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Linkedin size={18} /></a>
            <a href="#" onClick={handleSocialClick} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Twitter size={18} /></a>
            <a href="#" onClick={handleSocialClick} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Github size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};