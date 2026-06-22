'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { UserData } from '@/app/page'; // We'll export this type from page.tsx

interface AuthModalProps {
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onLogin: (user: UserData) => void;
  onSignUp: (user: UserData) => void;
  usersDB: UserData[];
}

export function AuthModal({ initialMode, onClose, onLogin, onSignUp, usersDB }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [identifier, setIdentifier] = useState(''); // email or name for login
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!name || !email || !password) {
        setError('All fields are required.');
        return;
      }
      
      const existingUser = usersDB.find(u => u.email === email || u.name === name);
      if (existingUser) {
        setError('An account with this email or name already exists.');
        return;
      }

      const newUser: UserData = { id: Date.now().toString(), name, email, password };
      onSignUp(newUser);
    } else {
      if (!identifier || !password) {
        setError('Please enter your email/name and password.');
        return;
      }

      const user = usersDB.find(u => 
        (u.email === identifier || u.name === identifier) && u.password === password
      );

      if (user) {
        onLogin(user);
      } else {
        setError('Email/Name or password is incorrect.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md glass rounded-3xl p-8 border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-[var(--color-crimson)] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--color-soft-gray)] hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white mb-2">
            {mode === 'login' ? 'WELCOME BACK' : 'CREATE ACCOUNT'}
          </h2>
          <p className="text-[var(--color-soft-gray)] text-sm">
            {mode === 'login' 
              ? 'Enter your credentials to access the system.' 
              : 'Join the next generation of AI trend prediction.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[rgba(220,20,60,0.1)] border border-[rgba(220,20,60,0.3)] rounded-xl flex items-center gap-2 text-[var(--color-crimson)] text-sm font-medium">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-soft-gray)]">
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" 
                className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[var(--color-crimson)] transition-colors"
              />
            </div>
          )}

          {mode === 'signup' ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-soft-gray)]">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address" 
                className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[var(--color-crimson)] transition-colors"
              />
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-soft-gray)]">
                <User size={18} />
              </div>
              <input 
                type="text" 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Email or Name" 
                className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[var(--color-crimson)] transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--color-soft-gray)]">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password" 
              className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-[var(--color-crimson)] transition-colors"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-6 bg-[var(--color-crimson)] hover:bg-[#ff1744] text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group"
          >
            {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-[var(--color-soft-gray)]">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setError(''); }} className="text-white hover:text-[var(--color-crimson)] font-bold transition-colors">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} className="text-white hover:text-[var(--color-crimson)] font-bold transition-colors">
                Sign in
              </button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
