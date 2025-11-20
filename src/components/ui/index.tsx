'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', hover = false }, ref) => (
    <div
      ref={ref}
      className={`
        bg-white dark:bg-neutral-900
        rounded-xl border border-neutral-200 dark:border-neutral-800
        shadow-sm transition-all duration-200
        ${hover ? 'hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }: any) => (
  <div className={`px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 rounded-b-xl ${className}`}>
    {children}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute left-3 top-3 text-neutral-500">{icon}</div>}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 ${icon ? 'pl-10' : ''}
            bg-white dark:bg-neutral-900
            border border-neutral-300 dark:border-neutral-700
            rounded-lg text-neutral-900 dark:text-white
            placeholder-neutral-400 dark:placeholder-neutral-600
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            transition-all duration-200
            disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed
            ${error ? 'border-danger-500 ring-danger-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>
      )}
    </div>
  )
);

Input.displayName = 'Input';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string }
>(({ label, error, className = '', ...props }, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={`
        w-full px-4 py-2
        bg-white dark:bg-neutral-900
        border border-neutral-300 dark:border-neutral-700
        rounded-lg text-neutral-900 dark:text-white
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
        transition-all duration-200
        ${error ? 'border-danger-500' : ''}
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">{error}</p>
    )}
  </div>
));

Select.displayName = 'Select';

export const Badge = ({ children, variant = 'primary', className = '' }: any) => {
  const variants: Record<string, string> = {
    primary: 'bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100',
    success: 'bg-success-100 dark:bg-success-900 text-success-800 dark:text-success-100',
    warning: 'bg-warning-100 dark:bg-warning-900 text-warning-800 dark:text-warning-100',
    danger: 'bg-danger-100 dark:bg-danger-900 text-danger-800 dark:text-danger-100',
    neutral: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
        ${variants[variant] || variants.primary}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

export const Avatar = ({ src, name, size = 'md' }: any) => {
  const sizes: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={`
        ${sizes[size]}
        rounded-full bg-gradient-to-br from-primary-400 to-primary-600
        text-white font-semibold flex items-center justify-center
        ${src ? 'bg-cover' : ''}
      `}
      style={src ? { backgroundImage: `url(${src})` } : {}}
    >
      {!src && initials}
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md', className = '' }: any) => {
  const sizes: Record<string, string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`${sizes[size]} animate-spin text-primary-600 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

export const Alert = ({
  variant = 'info',
  title,
  children,
  className = '',
}: any) => {
  const variants: Record<string, string> = {
    info: 'bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-800 text-primary-800 dark:text-primary-100',
    success: 'bg-success-50 dark:bg-success-900 border-success-200 dark:border-success-800 text-success-800 dark:text-success-100',
    warning: 'bg-warning-50 dark:bg-warning-900 border-warning-200 dark:border-warning-800 text-warning-800 dark:text-warning-100',
    danger: 'bg-danger-50 dark:bg-danger-900 border-danger-200 dark:border-danger-800 text-danger-800 dark:text-danger-100',
  };

  return (
    <div
      className={`
        rounded-lg border p-4
        ${variants[variant]}
        ${className}
      `}
    >
      {title && <h3 className="font-semibold mb-1">{title}</h3>}
      <p className="text-sm">{children}</p>
    </div>
  );
};
