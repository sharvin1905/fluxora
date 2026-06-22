'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Activity, Clock, LayoutDashboard, User, LogIn, UserPlus, LogOut, Info, Flame } from 'lucide-react';
import { UserData } from '@/app/page';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAbout: () => void;
  currentUser: UserData | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onOpenLogout: () => void;
}

export function Layout({ children, activeTab, setActiveTab, onOpenAbout, currentUser, onOpenAuth, onOpenLogout }: LayoutProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze', icon: Activity },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div className="relative min-h-screen w-full flex flex-col text-white pointer-events-none">
      {/* Top Left: Logo & About & Auth */}
      <div className="absolute top-6 left-6 z-40 pointer-events-auto flex flex-col items-start gap-2">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-black border border-[rgba(255,215,0,0.5)] shadow-[0_0_15px_rgba(255,215,0,0.3)] flex items-center justify-center transition-transform group-hover:scale-105">
            {/* Using a sleek golden Feather icon to match the Fluxora vibe without needing external files */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]">
              <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"/>
              <path d="M16 8 2 22"/>
              <path d="M17.5 15H9"/>
            </svg>
          </div>
          <span className="font-bold text-xl tracking-wide text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">FLUXORA</span>
        </div>
        <button 
          onClick={onOpenAbout}
          className="text-[var(--color-soft-gray)] hover:text-white flex items-center gap-1.5 text-sm transition-colors mt-1 ml-1 mb-2"
        >
          <Info size={14} /> About System
        </button>

        {/* Authentication */}
        <div 
          className="glass rounded-2xl p-2 flex flex-col gap-2 overflow-hidden transition-all duration-300 ml-1"
          onMouseEnter={() => setShowAuth(true)}
          onMouseLeave={() => setShowAuth(false)}
        >
          <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <User size={18} className={currentUser ? "text-[var(--color-crimson)]" : "text-[var(--color-soft-gray)]"} />
          </div>

          <div className={`flex flex-col gap-1 transition-all duration-300 origin-top ${showAuth ? 'opacity-100 max-h-40 mt-1' : 'opacity-0 max-h-0'}`}>
            {!currentUser ? (
              <>
                <button 
                  onClick={() => onOpenAuth('login')}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors w-full text-left whitespace-nowrap"
                >
                  <LogIn size={14} /> Sign In
                </button>
                <button 
                  onClick={() => onOpenAuth('signup')}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors w-full text-left whitespace-nowrap"
                >
                  <UserPlus size={14} /> Sign Up
                </button>
              </>
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-bold text-white border-b border-[rgba(255,255,255,0.05)] mb-1 truncate max-w-[120px]">
                  {currentUser.name}
                </div>
                <button 
                  onClick={onOpenLogout}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-gray-300 hover:text-[var(--color-crimson)] hover:bg-[rgba(255,255,255,0.05)] rounded-lg transition-colors w-full text-left whitespace-nowrap"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Top Right: Notifications */}
      <div className="absolute top-6 right-6 z-40 pointer-events-auto">
        <button 
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)] transition-colors group"
        >
          <Bell className="text-[var(--color-soft-gray)] group-hover:text-white transition-colors" size={20} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[var(--color-crimson)] rounded-full border-2 border-black shadow-[0_0_8px_var(--color-crimson)]"></span>
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-16 right-0 w-80 glass rounded-2xl p-4 border border-[rgba(255,255,255,0.1)] shadow-2xl origin-top-right"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">Alerts</h3>
                <button className="text-xs text-[var(--color-crimson)] hover:text-white transition-colors">Clear All</button>
              </div>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                  <div className="text-xs text-[var(--color-crimson)] font-mono mb-1">VIRAL OPPORTUNITY</div>
                  <p className="text-sm text-gray-300">A new trend pattern detected in Tech niche. 87% confidence.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Center Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
        <div className="glass rounded-full px-2 py-2 flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-6 py-2.5 rounded-full flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-white' : 'text-[var(--color-soft-gray)] hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[rgba(220,20,60,0.15)] border border-[rgba(220,20,60,0.3)] shadow-[0_0_15px_rgba(220,20,60,0.2)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon size={16} className="relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full h-full pt-28 pb-32 px-6 lg:px-12 pointer-events-auto overflow-y-auto z-10 relative">
        {children}
      </main>
    </div>
  );
}
