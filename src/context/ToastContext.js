"use client";
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {toasts.map(toast => (
          <div 
            key={toast.id}
            style={{
              background: toast.type === 'error' ? 'rgba(220, 53, 69, 0.95)' : (toast.type === 'info' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(212, 162, 58, 0.95)'),
              color: toast.type === 'error' ? 'white' : (toast.type === 'info' ? 'var(--gold)' : 'var(--black)'),
              padding: '14px 24px',
              borderRadius: '6px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.95rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '280px',
              animation: 'slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              backdropFilter: 'blur(10px)',
              border: toast.type === 'info' ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <span>{toast.message}</span>
            <button 
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', marginLeft: '15px', cursor: 'pointer', opacity: 0.7, fontSize: '1.2rem', padding: '0 5px' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
