"use client";

import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-[clamp(0.3rem,1vw,0.5rem)] w-full relative">
        
        {label && (
          <label 
            htmlFor={id} 
            className="text-[clamp(0.7rem,1vw,0.8rem)] font-bold text-[#475569] uppercase tracking-wide"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative group">
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={`
              w-full bg-[var(--color-secondary-bg)] text-[#1E293B] placeholder-[#94A3B8]
              rounded-md outline-none transition-all duration-200 border border-transparent
              focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm
              p-[clamp(0.6rem,1.5vw,0.875rem)]
              text-[clamp(0.875rem,1vw+0.2rem,1rem)]
              ${isPassword ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#475569] transition-colors p-1 rounded-md hover:bg-slate-100"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';