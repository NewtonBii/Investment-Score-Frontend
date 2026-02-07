import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label &&
        <label className="block text-sm font-medium text-gray-400">
            {label}
          </label>
        }
        <div className="relative group">
          {icon &&
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          }
          <input
            ref={ref}
            className={`
              w-full bg-surface/50 border border-white/10 rounded-lg 
              ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
              text-white placeholder-gray-600
              focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-danger/50 focus:border-danger focus:ring-danger/50' : ''}
              ${className}
            `}
            {...props} />

        </div>
        {error &&
        <motion.p
          initial={{
            opacity: 0,
            y: -5
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-xs text-danger">

            {error}
          </motion.p>
        }
      </div>);

  }
);
Input.displayName = 'Input';