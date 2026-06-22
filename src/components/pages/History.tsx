'use client';

import { Trash2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HistoryItem {
  id: number;
  title: string;
  date: string;
  trend: number;
  growth: number;
  success: number;
  img: string;
  url: string;
}

interface HistoryProps {
  history: HistoryItem[];
  setHistory: (history: HistoryItem[]) => void;
}

export function History({ history, setHistory }: HistoryProps) {
  const handleDelete = (id: number) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col items-center justify-center space-y-4 pt-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white text-center tracking-tight">
          ANALYSIS <span className="text-[var(--color-crimson)]">HISTORY</span>
        </h1>
        <p className="text-[var(--color-soft-gray)] text-center text-sm">
          Your last 10 predictive analyses. Oldest records are automatically pruned.
        </p>
      </div>

      <div className="glass rounded-3xl p-6 overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                <th className="pb-4 pl-4 font-bold">Content</th>
                <th className="pb-4 text-center font-bold">Date Analyzed</th>
                <th className="pb-4 text-center font-bold">Trend Score</th>
                <th className="pb-4 text-center font-bold">Growth Score</th>
                <th className="pb-4 text-center font-bold text-white">Success Prediction</th>
                <th className="pb-4 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {history.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={6} className="text-center py-12 text-[var(--color-soft-gray)]">
                      No history found. Run an analysis to see results here.
                    </td>
                  </motion.tr>
                ) : (
                  history.map((item) => (
                    <motion.tr 
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <td className="py-4 pl-4">
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-12 rounded-md bg-black overflow-hidden relative border border-white/10 group-hover:border-[var(--color-crimson)] transition-colors">
                            <img src={item.img} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm font-bold text-white line-clamp-1 max-w-[200px]">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-4 text-center text-sm text-gray-400 font-mono">{item.date}</td>
                      <td className="py-4 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 font-mono text-sm border border-blue-500/20">
                          {item.trend}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10 text-green-400 font-mono text-sm border border-green-500/20">
                          {item.growth}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="inline-flex flex-col items-center justify-center relative">
                          <span className={`text-xl font-black ${item.success > 75 ? 'text-[#10B981] drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'text-[var(--color-crimson)] drop-shadow-[0_0_10px_rgba(220,20,60,0.5)]'}`}>
                            {item.success}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                            className="p-2 rounded-lg bg-[rgba(220,20,60,0.1)] hover:bg-[var(--color-crimson)] text-[var(--color-crimson)] hover:text-white transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-6 text-xs text-[var(--color-soft-gray)] border-t border-white/5 pt-4">
          <span>Displaying {history.length} of 10 max entries</span>
          <button 
            onClick={() => setHistory([])}
            className="hover:text-[var(--color-crimson)] transition-colors"
          >
            Clear History
          </button>
        </div>
      </div>
    </div>
  );
}
