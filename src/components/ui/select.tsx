import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  label?: string
  error?: string
}

export const Select = ({
  options,
  label,
  error,
  id,
  className,
  ...props
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-[clamp(0.3rem,1vw,0.5rem)] w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-[clamp(0.7rem,1vw,0.8rem)] font-bold text-[#475569] uppercase tracking-wide cursor-pointer"
        >
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative w-full">
        <select
          id={id}
          className={cn(
            'appearance-none w-full bg-[var(--color-secondary-bg)] text-[#1E293B]',
            'rounded-md outline-none transition-all duration-200 border border-transparent',
            'focus:border-[var(--color-primary)] focus:bg-white focus:shadow-sm',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'py-[clamp(0.6rem,1.5vw,0.875rem)] pl-[clamp(0.6rem,1.5vw,0.875rem)] pr-10',
            'text-[clamp(0.875rem,1vw+0.2rem,1rem)]',
            // Error states
            error && 'border-red-400 focus:border-red-400',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* icon */}
        <ChevronDown
          className="pointer-events-none absolute right-[clamp(0.6rem,1.5vw,0.875rem)] top-1/2 -translate-y-1/2 text-[#94A3B8]"
          size={18}
          strokeWidth={2}
        />
      </div>

      {error && (
        <p className="text-[clamp(0.8rem,1vw,0.875rem)] text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  )
}