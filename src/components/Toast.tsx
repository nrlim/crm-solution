'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'error' | 'success' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', duration = 3000) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

// Toast Display Component
export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

function Toast({ toast, onClose }: ToastProps) {
  const bgColor = {
    error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800',
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800',
    info: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800',
  };

  const textColor = {
    error: 'text-danger-800 dark:text-danger-200',
    success: 'text-success-800 dark:text-success-200',
    info: 'text-primary-800 dark:text-primary-200',
    warning: 'text-warning-800 dark:text-warning-200',
  };

  const iconColor = {
    error: 'text-danger-600 dark:text-danger-400',
    success: 'text-success-600 dark:text-success-400',
    info: 'text-primary-600 dark:text-primary-400',
    warning: 'text-warning-600 dark:text-warning-400',
  };

  const Icon = {
    error: AlertCircle,
    success: CheckCircle,
    info: Info,
    warning: AlertCircle,
  }[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border animate-fade-in ${bgColor[toast.type]} shadow-lg`}
    >
      <Icon size={20} className={iconColor[toast.type]} />
      <p className={`flex-1 text-sm font-medium ${textColor[toast.type]}`}>
        {toast.message}
      </p>
      <button
        onClick={onClose}
        className={`p-1 hover:bg-black/10 rounded transition ${textColor[toast.type]}`}
      >
        <X size={18} />
      </button>
    </div>
  );
}
