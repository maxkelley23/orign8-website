import React from 'react';
import { ButtonVariant } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = ButtonVariant.PRIMARY, 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-tight transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    [ButtonVariant.PRIMARY]: "bg-slate-900 text-white hover:bg-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.1)] border border-transparent active:scale-[0.98] dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 dark:shadow-white/5",
    [ButtonVariant.SECONDARY]: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 active:scale-[0.98] dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-slate-600",
    [ButtonVariant.OUTLINE]: "bg-transparent text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 active:bg-slate-100 dark:text-slate-300 dark:border-slate-700 dark:hover:border-slate-500 dark:hover:text-white dark:hover:bg-slate-800",
    [ButtonVariant.GHOST]: "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};