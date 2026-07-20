import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

export default function Toast({ type = 'success', message, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className="fixed bottom-6 right-6 z-[1500] flex items-center gap-3 rounded-xl border px-5 py-4 shadow-2xl shadow-black/40 backdrop-blur-sm"
      style={{
        background: isSuccess ? 'rgba(5, 46, 22, 0.95)' : 'rgba(69, 10, 10, 0.95)',
        borderColor: isSuccess ? 'rgba(74, 222, 128, 0.3)' : 'rgba(252, 129, 129, 0.3)',
        animation: 'toastSlideUp 0.3s cubic-bezier(.21,1.02,.73,1) both',
      }}
    >
      {isSuccess ? (
        <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
      ) : (
        <XCircle className="h-5 w-5 shrink-0 text-red-400" />
      )}
      <span className="text-sm font-semibold text-white">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-white/40 transition-colors hover:text-white/80"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
