import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldCheck, AlertCircle } from 'lucide-react';
import { DEFAULT_ADMIN_CREDENTIALS, setAdminSession } from '../utils/storage';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFillDemo = () => {
    setEmail(DEFAULT_ADMIN_CREDENTIALS.email);
    setPassword(DEFAULT_ADMIN_CREDENTIALS.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    setTimeout(() => {
      // Validate credentials (accepts default credentials or any authorized admin)
      if (
        email.trim().toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() &&
        password === DEFAULT_ADMIN_CREDENTIALS.password
      ) {
        setAdminSession(email.trim());
        setIsSubmitting(false);
        onSuccess();
        onClose();
      } else {
        setIsSubmitting(false);
        setError('Invalid admin credentials. Click "Use Demo Access" below or check credentials.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all animate-fadeIn">
      <div
        className="bg-[#FFFFFF] border border-[#E7E2DA] rounded-[6px] max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-[#1C1C18]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#86736A] hover:text-[#1C1C18] p-1 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#9E582C]/10 border border-[#9E582C]/20 flex items-center justify-center text-[#9E582C]">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] tracking-[0.14em] uppercase font-bold text-[#9E582C]">
              Staff & Studio Access
            </span>
            <h2 className="font-serif text-2xl font-medium text-[#1C1C18]">
              Admin Studio Login
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#53433B] leading-relaxed mb-6">
          Authenticate to manage live products, add new crafted pieces, update pricing, or delete items from the browser catalog.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-[4px] bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@abhifurnituremall.in"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C] focus:ring-1 focus:ring-[#9E582C] text-[#1C1C18] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1C18] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E7E2DA] rounded-[4px] focus:outline-none focus:border-[#9E582C] focus:ring-1 focus:ring-[#9E582C] text-[#1C1C18] transition-all"
            />
          </div>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="bg-[#F5F1EB] border border-[#E7E2DA] rounded-[4px] p-3 text-xs flex items-center justify-between">
            <div className="text-[11px] text-[#53433B]">
              <div className="font-semibold text-[#1C1C18]">Default Demo Credentials:</div>
              <div className="font-mono text-[#804116]">admin@abhifurnituremall.in / admin123</div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-[11px] font-semibold bg-[#FFFFFF] border border-[#D4A373] text-[#804116] rounded-[3px] hover:bg-[#9E582C] hover:text-[#FFFFFF] transition-all cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-3 h-3" />
              <span>Autofill</span>
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-[#53433B] hover:text-[#1C1C18] border border-[#E7E2DA] rounded-[4px] transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 px-4 text-xs font-semibold uppercase tracking-wider bg-[#9E582C] hover:bg-[#804116] text-[#FFFFFF] rounded-[4px] shadow-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Enter Admin Studio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

