import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-24 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all animate-slide-right min-w-[300px] backdrop-blur-md ${
                toast.type === 'success' ? 'bg-white/95 border-green-500/20 text-nomad-black' : 
                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 
                'bg-white border-gray-200 text-nomad-black'
            }`}
          >
             {toast.type === 'success' && <CheckCircle className="text-green-500 shrink-0" size={20} />}
             {toast.type === 'error' && <AlertCircle className="text-red-500 shrink-0" size={20} />}
             <p className="text-sm font-bold flex-grow">{toast.message}</p>
             <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-nomad-black">
                <X size={16} />
             </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};