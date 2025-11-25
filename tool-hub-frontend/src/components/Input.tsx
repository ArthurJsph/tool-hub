import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={`
            w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder:text-muted-foreground
            ${error ? 'border-destructive focus:ring-destructive focus:border-destructive' : ''}
            ${className}
          `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
