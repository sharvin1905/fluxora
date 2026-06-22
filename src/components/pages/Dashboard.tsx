'use client';

import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, BarChart2, Eye, Heart, MessageCircle, Share2, PlayCircle, Users, X } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Cell } from 'recharts';

export interface DashboardStateData {
  url: string;
  isAnalyzing: boolean;
  showResults: boolean;
  successScore: number;
  chartData: {day: string, score: number}[];
  yearlyTrendData: {month: string, trend: number}[];
  metrics: { label: string, value: string, icon: any, color: string, growth: string }[];
  uploadDate: string;
}

interface DashboardProps {
  state: DashboardStateData;
  setState: React.Dispatch<React.SetStateAction<DashboardStateData>>;
  onAnalyze?: (item: any) => void;
}

// Simple deterministic hash function
const hashString = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Deterministic pseudo-random number generator
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

export function Dashboard({ state, setState, onAnalyze }: DashboardProps) {
  const { url, isAnalyzing, showResults, successScore, chartData, yearlyTrendData, metrics, uploadDate } = state;

  const isHighSuccess = successScore > 75;
  const mainColor = isHighSuccess ? '#10B981' : 'var(--color-crimson)';
  const mainColorClass = isHighSuccess ? 'text-[#10B981]' : 'text-[var(--color-crimson)]';

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setState(prev => ({ ...prev, isAnalyzing: true, showResults: false }));

    setTimeout(() => {
      const seed = hashString(url);
      
      const baseScore = Math.floor(pseudoRandom(seed) * 20) + 75; // 75-95
      
      const today = new Date();
      const uploadD = new Date(today);
      uploadD.setDate(uploadD.getDate() - 29);
      const formattedUploadDate = uploadD.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      let currentViews = Math.floor(pseudoRandom(seed + 5) * 50000) + 10000;
      
      const newChartData = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date(uploadD);
        d.setDate(d.getDate() + i);
        
        // Random walk for views
        const change = (pseudoRandom(seed + i) * 1.5) - 0.5; // slight upward bias
        currentViews = Math.max(0, currentViews * (1 + change));
        
        return {
          day: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          score: Math.floor(currentViews),
        };
      });

      // Yearly trend data
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = today.getMonth();
      const newYearlyTrendData = Array.from({ length: 12 }).map((_, i) => {
        const mIdx = (currentMonth - 11 + i + 12) % 12;
        return {
          month: months[mIdx],
          trend: Math.floor(pseudoRandom(seed + 300 + i) * 80) + 20, // Trend score 20-100
        };
      });

      const formatNum = (num: number) => num > 1000000 ? (num/1000000).toFixed(1) + 'M' : num > 1000 ? (num/1000).toFixed(1) + 'K' : num.toString();
      
      const newMetrics = [
        { label: 'Views', value: formatNum(Math.floor(pseudoRandom(seed + 100) * 5000000) + 100000), icon: Eye, color: 'text-blue-400', growth: `+${(pseudoRandom(seed + 101) * 15 + 1).toFixed(1)}%` },
        { label: 'Likes', value: formatNum(Math.floor(pseudoRandom(seed + 102) * 500000) + 10000), icon: Heart, color: 'text-pink-500', growth: `+${(pseudoRandom(seed + 103) * 10 + 1).toFixed(1)}%` },
        { label: 'Comments', value: formatNum(Math.floor(pseudoRandom(seed + 104) * 50000) + 1000), icon: MessageCircle, color: 'text-yellow-400', growth: `+${(pseudoRandom(seed + 105) * 20 + 1).toFixed(1)}%` },
        { label: 'Shares', value: formatNum(Math.floor(pseudoRandom(seed + 106) * 100000) + 5000), icon: Share2, color: 'text-green-400', growth: `+${(pseudoRandom(seed + 107) * 12 + 1).toFixed(1)}%` },
        { label: 'Watch Time', value: `${Math.floor(pseudoRandom(seed + 108) * 40) + 50}%`, icon: PlayCircle, color: 'text-purple-400', growth: `+${(pseudoRandom(seed + 109) * 5 + 1).toFixed(1)}%` },
        { label: 'Eng. Rate', value: `${(pseudoRandom(seed + 110) * 10 + 5).toFixed(1)}%`, icon: Users, color: 'text-orange-400', growth: `+${(pseudoRandom(seed + 111) * 8 + 1).toFixed(1)}%` },
      ];

      const isVideo = url.includes('youtube') || url.includes('tiktok') || url.includes('instagram');
      const cleanUrl = url.replace('https://', '').replace('http://', '').split('/')[0];
      const mockTitle = isVideo ? `Video Analysis: ${cleanUrl}` : `Post Analysis: ${cleanUrl}`;

      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        showResults: true,
        successScore: baseScore,
        chartData: newChartData,
        yearlyTrendData: newYearlyTrendData,
        metrics: newMetrics,
        uploadDate: formattedUploadDate,
      }));

      if (onAnalyze) {
        onAnalyze({
          id: Date.now(),
          title: mockTitle,
          date: new Date().toISOString().split('T')[0],
          trend: Math.floor(pseudoRandom(seed + 200) * 20) + 80,
          growth: Math.floor(pseudoRandom(seed + 201) * 20) + 75,
          success: baseScore,
          img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&h=100&fit=crop',
          url: url
        });
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Search Header */}
      <div className="flex flex-col items-center justify-center space-y-6 pt-4 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-white text-center tracking-tight">
          PREDICT <span className="text-[var(--color-crimson)]">VIRAL</span> TRENDS
        </h1>
        <p className="text-[var(--color-soft-gray)] text-center max-w-2xl">
          Enter a social media URL below. Our AI engine will analyze the content and predict its future popularity across multiple platforms.
        </p>

        <form onSubmit={handleAnalyze} className="relative w-full max-w-3xl mt-4 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-crimson)] to-[#800000] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-[rgba(17,17,17,0.8)] border border-[rgba(255,255,255,0.1)] rounded-2xl overflow-hidden backdrop-blur-xl">
            <div className="pl-6 text-[var(--color-soft-gray)]">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setState(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Paste YouTube, Instagram, TikTok, X, or LinkedIn URL..."
              className="w-full bg-transparent border-none outline-none py-5 px-4 text-white placeholder-[var(--color-soft-gray)]"
            />
            {url && (
              <button
                type="button"
                onClick={() => setState(prev => ({ ...prev, url: '' }))}
                className="p-2 text-[var(--color-soft-gray)] hover:text-[var(--color-crimson)] transition-colors flex items-center justify-center mr-2"
                aria-label="Clear input"
              >
                <X size={18} />
              </button>
            )}
            <button
              type="submit"
              disabled={isAnalyzing || !url}
              className="bg-[var(--color-crimson)] hover:bg-[#ff1744] text-white font-bold py-5 px-8 transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Search size={18} />
                  </motion.div>
                  ANALYZING
                </>
              ) : (
                'ANALYZE'
              )}
            </button>
          </div>
        </form>
      </div>

      {showResults && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Main Success Prediction Score */}
          <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity" style={{ backgroundColor: mainColor }}></div>
            <h3 className="text-[var(--color-soft-gray)] font-medium mb-6 uppercase tracking-widest text-sm z-10">Success Probability</h3>
            
            <div className="relative flex items-center justify-center w-48 h-48 z-10">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <motion.circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke={mainColor}
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "0 300" }}
                  animate={{ strokeDasharray: `${(successScore / 100) * 283} 300` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white">{successScore}<span className={`text-2xl ${mainColorClass}`}>%</span></span>
                <span className={`text-xs font-mono mt-1 ${mainColorClass}`}>+{(pseudoRandom(hashString(url)) * 15 + 5).toFixed(1)}% vs avg</span>
              </div>
            </div>
            
            <div className="mt-8 w-full p-4 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-xl relative z-10">
              <p className="text-sm text-gray-300 text-center">
                "If you create similar content, estimated success rate: <span className={`font-bold ${mainColorClass}`}>{successScore}%</span>"
              </p>
              <div className="flex justify-between text-xs mt-3 text-[var(--color-soft-gray)] font-mono">
                <span>Audience Match: {Math.floor(pseudoRandom(hashString(url) + 1) * 15) + 85}%</span>
                <span>Trend Match: {Math.floor(pseudoRandom(hashString(url) + 2) * 15) + 80}%</span>
              </div>
            </div>
          </div>

          {/* Center: Popularity Chart */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">Historical Views & Growth</h3>
                <p className="text-[var(--color-soft-gray)] text-sm">Past views since upload date: <span className="text-white font-bold">{uploadDate}</span></p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 text-xs rounded-full bg-[rgba(16,185,129,0.1)] text-[#10B981] border border-[rgba(16,185,129,0.2)]">
                  Tracking Live
                </span>
              </div>
            </div>
            
            <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScoreLine" x1="0" y1="0" x2="1" y2="0">
                      {chartData.map((d, i, arr) => {
                        if (i === 0) return <stop key={i} offset="0%" stopColor="#10B981" />;
                        const prev = arr[i - 1].score;
                        const isUp = d.score >= prev;
                        const color = isUp ? '#10B981' : '#DC143C';
                        const offsetPercent = (i / (arr.length - 1)) * 100;
                        const prevOffsetPercent = ((i - 1) / (arr.length - 1)) * 100;
                        return (
                          <Fragment key={i}>
                            <stop offset={`${prevOffsetPercent}%`} stopColor={color} />
                            <stop offset={`${offsetPercent}%`} stopColor={color} />
                          </Fragment>
                        );
                      })}
                    </linearGradient>
                    <linearGradient id="colorScoreFill" x1="0" y1="0" x2="1" y2="0">
                      {chartData.map((d, i, arr) => {
                        if (i === 0) return <stop key={i} offset="0%" stopColor="#10B981" stopOpacity={0.3} />;
                        const prev = arr[i - 1].score;
                        const isUp = d.score >= prev;
                        const color = isUp ? '#10B981' : '#DC143C';
                        const offsetPercent = (i / (arr.length - 1)) * 100;
                        const prevOffsetPercent = ((i - 1) / (arr.length - 1)) * 100;
                        return (
                          <Fragment key={i}>
                            <stop offset={`${prevOffsetPercent}%`} stopColor={color} stopOpacity={0.3} />
                            <stop offset={`${offsetPercent}%`} stopColor={color} stopOpacity={0.3} />
                          </Fragment>
                        );
                      })}
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => val > 1000 ? `${(val/1000).toFixed(0)}k` : val} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [value.toLocaleString(), 'Views']}
                    labelStyle={{ color: '#888', marginBottom: '4px' }}
                  />
                  {chartData.length > 0 && (
                    <ReferenceLine x={chartData[0].day} stroke="rgba(255,255,255,0.2)" strokeDasharray="3 3" label={{ position: 'top', value: 'UPLOADED', fill: '#888', fontSize: 10 }} />
                  )}
                  <Area type="linear" dataKey="score" stroke="url(#colorScoreLine)" strokeWidth={3} fillOpacity={1} fill="url(#colorScoreFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Full Width Row: Yearly Trend BarChart */}
          <div className="lg:col-span-3 glass rounded-3xl p-6 flex flex-col mt-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-white font-bold text-lg">Past Year Trend: Related Content</h3>
                <p className="text-[var(--color-soft-gray)] text-sm">Performance of similar videos across the ecosystem over the last 12 months.</p>
              </div>
            </div>
            <div className="flex-1 min-h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [value, 'Trend Score']}
                  />
                  <Bar dataKey="trend" radius={[4, 4, 0, 0]}>
                    {yearlyTrendData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.trend > 75 ? '#10B981' : 'var(--color-crimson)'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Left: Engagement Metrics */}
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6">Projected Engagement Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {metrics.map((metric, idx) => (
                <div key={idx} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <metric.icon size={18} className={metric.color} />
                    <span className="text-[10px] text-[var(--color-crimson)] font-mono">{metric.growth}</span>
                  </div>
                  <div className="text-2xl font-black text-white">{metric.value}</div>
                  <div className="text-xs text-[var(--color-soft-gray)] mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Right: Current Trending Feed */}
          <div className="glass rounded-3xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp size={20} className="text-[var(--color-crimson)]" />
              <h3 className="text-white font-bold text-lg">Current Trending Feed</h3>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { tag: '#AIRevolution', type: 'Topic', views: '2.4M' },
                { tag: 'Tech Minimalist Setup', type: 'Video', views: '1.8M' },
                { tag: 'Future of Work 2027', type: 'Article', views: '950K' },
                { tag: '#CyberpunkAesthetics', type: 'Photo', views: '3.1M' },
              ].map((trend, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] cursor-pointer hover:border-[var(--color-crimson)] transition-colors group">
                  <div>
                    <div className="text-sm font-bold text-white group-hover:text-[var(--color-crimson)] transition-colors">{trend.tag}</div>
                    <div className="text-xs text-[var(--color-soft-gray)] mt-1">{trend.type}</div>
                  </div>
                  <div className="text-xs font-mono text-[var(--color-soft-gray)] bg-black px-2 py-1 rounded">
                    {trend.views}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}

