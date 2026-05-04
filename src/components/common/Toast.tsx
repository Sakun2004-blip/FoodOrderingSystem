import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const colorMap: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-400 text-green-800',
  error: 'bg-red-50 border-red-400 text-red-800',
  info: 'bg-blue-50 border-blue-400 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${colorMap[type]} max-w-sm`}>
      <span>{icons[type]}</span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="text-current opacity-60 hover:opacity-100 font-bold">✕</button>
    </div>
  );
};

export default Toast;
