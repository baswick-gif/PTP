import { Check, AlertCircle } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-[calc(env(safe-area-inset-top)+1rem)] left-4 right-4 sm:left-auto sm:right-4 z-[60] p-4 rounded-lg flex items-center gap-3 shadow-xl ${
        toast.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
      }`}
    >
      {toast.type === 'success' ? (
        <Check className="w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="font-medium">{toast.message}</span>
    </div>
  );
}
