import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[clamp(0.3rem,1vw,0.5rem)] w-full">
        
        {label && (
          <label 
            htmlFor={id} 
            className="text-[clamp(0.7rem,1vw,0.8rem)] font-bold text-[#475569] uppercase tracking-wide"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Main Input Field */}
        <input
          ref={ref}
          id={id}
          className={`
            w-full bg-[var(--color-secondary-bg)] text-[#1E293B] placeholder-[#94A3B8]
            rounded-md outline-none transition-all duration-200 border border-transparent
            focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm
            p-[clamp(0.6rem,1.5vw,0.875rem)]
            text-[clamp(0.875rem,1vw+0.2rem,1rem)]
            ${className}
          `}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';