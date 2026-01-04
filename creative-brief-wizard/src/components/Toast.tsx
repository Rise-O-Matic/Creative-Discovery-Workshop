import React, { useEffect } from 'react';
import { useToast, type Toast as ToastType } from '../contexts/ToastContext';

/**
 * Individual Toast Component
 * Displays a single toast notification with auto-dismiss capability
 */
interface ToastProps {
  toast: ToastType;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();

  // Auto-dismiss progress bar
  const showProgress = toast.duration !== undefined;
  const progressDuration = toast.duration || 0;

  useEffect(() => {
    // For accessibility: announce toast to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', toast.type === 'error' ? 'assertive' : 'polite');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.textContent = toast.message;
    document.body.appendChild(announcement);

    return () => {
      document.body.removeChild(announcement);
    };
  }, [toast]);

  // Define styles based on toast type
  const getToastStyles = () => {
    switch (toast.type) {
      case 'warning':
        return {
          bg: 'bg-orange-500',
          border: 'border-orange-600',
          text: 'text-white',
          icon: '⚠',
        };
      case 'error':
        return {
          bg: 'bg-red-600',
          border: 'border-red-700',
          text: 'text-white',
          icon: '✕',
        };
      case 'success':
        return {
          bg: 'bg-green-500',
          border: 'border-green-600',
          text: 'text-white',
          icon: '✓',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-500',
          border: 'border-blue-600',
          text: 'text-white',
          icon: 'ℹ',
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        ${styles.bg} ${styles.border} ${styles.text}
        border-2 rounded-lg shadow-xl
        min-w-[280px] md:min-w-[320px] max-w-md
        overflow-hidden
        slide-in
      `}
      role="alert"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3 p-4">
        <span className="text-2xl leading-none flex-shrink-0" aria-hidden="true">
          {styles.icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-relaxed break-words">{toast.message}</p>
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 text-white hover:text-gray-200 font-bold text-xl leading-none transition-colors"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>

      {/* Progress bar for auto-dismiss */}
      {showProgress && (
        <div className="h-1 bg-black bg-opacity-20">
          <div
            className="h-full bg-white bg-opacity-60 transition-all"
            style={{
              animation: `shrink ${progressDuration}ms linear`,
              transformOrigin: 'left',
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Toast Container Component
 * Renders all active toasts in a fixed position container
 */
export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <>
      <style>
        {`
          @keyframes shrink {
            from {
              transform: scaleX(1);
            }
            to {
              transform: scaleX(0);
            }
          }
        `}
      </style>
      <div
        className="fixed top-20 md:top-4 right-4 flex flex-col gap-3 pointer-events-none"
        style={{ zIndex: 'var(--z-popover)' }}
        aria-live="polite"
        aria-relevant="additions"
      >
        <div className="flex flex-col gap-3 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ToastContainer;
