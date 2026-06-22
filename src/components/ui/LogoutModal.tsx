'use client';

import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function LogoutModal({ onConfirm, onCancel }: LogoutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-sm glass rounded-3xl p-8 border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-crimson)] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

        <div className="w-16 h-16 bg-[rgba(220,20,60,0.1)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[rgba(220,20,60,0.3)]">
          <LogOut size={28} className="text-[var(--color-crimson)]" />
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          LOGOUT
        </h2>
        <p className="text-[var(--color-soft-gray)] text-sm mb-8">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-4">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.05)] text-white font-bold transition-colors"
          >
            No
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl bg-[var(--color-crimson)] hover:bg-[#ff1744] text-white font-bold transition-colors shadow-[0_0_15px_rgba(220,20,60,0.3)]"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
}
