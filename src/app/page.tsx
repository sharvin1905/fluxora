'use client';

import { useState, useEffect } from 'react';
import { Eye, Heart, MessageCircle, Share2, PlayCircle, Users } from 'lucide-react';
import { CanvasBackground } from '@/components/ui/CanvasBackground';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { Layout } from '@/components/ui/Layout';
import { Dashboard, DashboardStateData } from '@/components/pages/Dashboard';
import { Analyze, AnalyzeStateData } from '@/components/pages/Analyze';
import { History, HistoryItem } from '@/components/pages/History';
import { About } from '@/components/pages/About';
import { AuthModal } from '@/components/ui/AuthModal';
import { LogoutModal } from '@/components/ui/LogoutModal';
import { AnimatePresence } from 'framer-motion';



export interface UserData {
  id: string;
  name: string;
  email: string;
  password?: string;
}

const initialHistory: HistoryItem[] = [
  { id: 1, title: 'The Future of AI Design 2027', date: '2026-06-19', trend: 94, growth: 88, success: 91, img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=200&h=100&fit=crop', url: 'https://youtube.com/watch?v=1' },
  { id: 2, title: 'Cyberpunk Workspace Setup Tour', date: '2026-06-18', trend: 82, growth: 76, success: 85, img: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=200&h=100&fit=crop', url: 'https://instagram.com/p/1' },
  { id: 3, title: 'I Built a Neural Network in 10 Minutes', date: '2026-06-15', trend: 98, growth: 95, success: 97, img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=100&fit=crop', url: 'https://twitter.com/1' },
];

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAbout, setShowAbout] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>(initialHistory);

  // Authentication State
  const [usersDB, setUsersDB] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // LocalStorage Persistence
  useEffect(() => {
    const storedUsers = localStorage.getItem('fluxora_users');
    const storedCurrentUser = localStorage.getItem('fluxora_currentUser');
    const storedHistory = localStorage.getItem('fluxora_history');
    
    if (storedUsers) setUsersDB(JSON.parse(storedUsers));
    if (storedCurrentUser) setCurrentUser(JSON.parse(storedCurrentUser));
    if (storedHistory) setHistory(JSON.parse(storedHistory));
    
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('fluxora_users', JSON.stringify(usersDB));
  }, [usersDB, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      if (currentUser) {
        localStorage.setItem('fluxora_currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('fluxora_currentUser');
      }
    }
  }, [currentUser, isLoaded]);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('fluxora_history', JSON.stringify(history));
  }, [history, isLoaded]);

  const [dashboardState, setDashboardState] = useState<DashboardStateData>({
    url: '',
    isAnalyzing: false,
    showResults: false,
    successScore: 87,
    chartData: [],
    yearlyTrendData: [],
    uploadDate: '',
    metrics: [
      { label: 'Views', value: '1.2M', icon: Eye, color: 'text-blue-400', growth: '+12.5%' },
      { label: 'Likes', value: '145K', icon: Heart, color: 'text-pink-500', growth: '+8.2%' },
      { label: 'Comments', value: '8.4K', icon: MessageCircle, color: 'text-yellow-400', growth: '+15.1%' },
      { label: 'Shares', value: '32K', icon: Share2, color: 'text-green-400', growth: '+5.4%' },
      { label: 'Watch Time', value: '84%', icon: PlayCircle, color: 'text-purple-400', growth: '+2.1%' },
      { label: 'Eng. Rate', value: '12.4%', icon: Users, color: 'text-orange-400', growth: '+4.5%' },
    ],
  });

  const [analyzeState, setAnalyzeState] = useState<AnalyzeStateData>({
    activeInput: 'upload',
    isAnalyzing: false,
    showResults: false,
    urlInput: '',
  });

  const handleNewAnalysis = (newItem: HistoryItem) => {
    setHistory(prev => {
      if (prev.length > 0 && prev[0].url === newItem.url) {
        return prev;
      }
      return [newItem, ...prev].slice(0, 10);
    });
  };

  const handleLogin = (user: UserData) => {
    setCurrentUser(user);
    setAuthModalMode(null);
  };

  const handleSignUp = (user: UserData) => {
    setUsersDB(prev => [...prev, user]);
    setCurrentUser(user);
    setAuthModalMode(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLogoutModal(false);
  };

  return (
    <>
      <CanvasBackground />
      
      {isLoading ? (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      ) : (
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          onOpenAbout={() => setShowAbout(true)}
          currentUser={currentUser}
          onOpenAuth={(mode) => setAuthModalMode(mode)}
          onOpenLogout={() => setShowLogoutModal(true)}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Dashboard key="dashboard" state={dashboardState} setState={setDashboardState} onAnalyze={handleNewAnalysis} />}
            {activeTab === 'analyze' && <Analyze key="analyze" state={analyzeState} setState={setAnalyzeState} />}
            {activeTab === 'history' && <History key="history" history={history} setHistory={setHistory} />}
          </AnimatePresence>
        </Layout>
      )}

      <AnimatePresence>
        {showAbout && <About onClose={() => setShowAbout(false)} />}
        {authModalMode && (
          <AuthModal 
            initialMode={authModalMode} 
            onClose={() => setAuthModalMode(null)} 
            onLogin={handleLogin}
            onSignUp={handleSignUp}
            usersDB={usersDB}
          />
        )}
        {showLogoutModal && (
          <LogoutModal 
            onConfirm={handleLogout}
            onCancel={() => setShowLogoutModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

