import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: React.ReactNode;
}
export function Button({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'relative inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background';
  const variants = {
    primary:
    'bg-primary text-background hover:bg-primary/90 shadow-[0_0_20px_rgba(0,212,170,0.3)] hover:shadow-[0_0_30px_rgba(0,212,170,0.5)]',
    secondary:
    'bg-surface border border-white/10 text-white hover:bg-white/5 hover:border-white/20',
    outline:
    'bg-transparent border border-primary/50 text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-white/5'
  };
  return (
    <motion.button
      whileHover={{
        scale: disabled || isLoading ? 1 : 1.02
      }}
      whileTap={{
        scale: disabled || isLoading ? 1 : 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}>

      {isLoading ?
      <Loader2 className="w-5 h-5 animate-spin mr-2" /> :
      icon ?
      <span className="mr-2">{icon}</span> :
      null}
      {children}
    </motion.button>);

}