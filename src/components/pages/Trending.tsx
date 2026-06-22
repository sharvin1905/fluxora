import { motion } from 'framer-motion';
import { Flame, TrendingUp, PlayCircle, Hash, Instagram, Youtube, Twitter } from 'lucide-react';

interface TrendingItem {
  id: string;
  title: string;
  platform: 'youtube' | 'instagram' | 'twitter' | 'tiktok';
  views: string;
  growth: string;
  heatScore: number;
  category: string;
  thumbnail: string;
}

const trendingData: TrendingItem[] = [
  {
    id: 't1',
    title: 'The AI Singularity is Closer Than You Think',
    platform: 'youtube',
    views: '2.4M',
    growth: '+450%',
    heatScore: 98,
    category: 'Technology',
    thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=200&fit=crop',
  },
  {
    id: 't2',
    title: 'Cyberpunk 2077 Real Life POV',
    platform: 'instagram',
    views: '850K',
    growth: '+120%',
    heatScore: 88,
    category: 'Gaming',
    thumbnail: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=400&h=200&fit=crop',
  },
  {
    id: 't3',
    title: 'Next Gen Quantum Computing Explained',
    platform: 'youtube',
    views: '1.1M',
    growth: '+210%',
    heatScore: 92,
    category: 'Science',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
  },
  {
    id: 't4',
    title: 'Zero Gravity Desk Setup',
    platform: 'twitter',
    views: '400K',
    growth: '+340%',
    heatScore: 95,
    category: 'Lifestyle',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop',
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24
    }
  }
};

export function Trending() {
  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'youtube': return <Youtube size={16} className="text-red-500" />;
      case 'instagram': return <Instagram size={16} className="text-pink-500" />;
      case 'twitter': return <Twitter size={16} className="text-blue-400" />;
      default: return <PlayCircle size={16} className="text-gray-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 pb-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <Flame className="text-[var(--color-crimson)]" size={32} />
            LIVE TRENDING FEED
          </h1>
          <p className="text-[var(--color-soft-gray)] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--color-crimson)] animate-pulse shadow-[0_0_8px_var(--color-crimson)]"></span>
            Real-time viral content monitor
          </p>
        </div>
        
        <div className="glass px-4 py-2 rounded-xl flex items-center gap-3 border border-[rgba(255,215,0,0.2)] bg-[rgba(255,215,0,0.02)]">
          <TrendingUp className="text-[#FFD700]" size={20} />
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono">GLOBAL HEAT INDEX</span>
            <span className="text-sm font-bold text-[#FFD700]">EXTREME</span>
          </div>
        </div>
      </motion.div>

      {/* Feed Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {trendingData.map((item) => (
          <motion.div 
            key={item.id}
            variants={itemVariants}
            className="group glass rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.05)] hover:border-[var(--color-crimson)] transition-colors cursor-pointer relative"
          >
            {/* Background Image */}
            <div className="h-48 w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-[rgba(0,0,0,0.5)] to-transparent z-10"></div>
              <img 
                src={item.thumbnail} 
                alt={item.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Heat Score Badge */}
              <div className="absolute top-4 right-4 z-20 glass rounded-lg px-2 py-1 flex items-center gap-1 border border-[rgba(220,20,60,0.3)] bg-[rgba(220,20,60,0.15)]">
                <Flame size={14} className="text-[var(--color-crimson)]" />
                <span className="font-bold font-mono text-white text-xs">{item.heatScore}</span>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4 z-20 glass rounded-lg px-2 py-1 flex items-center gap-1">
                <Hash size={12} className="text-gray-400" />
                <span className="font-medium text-xs text-gray-200 uppercase tracking-wider">{item.category}</span>
              </div>
            </div>

            {/* Content Info */}
            <div className="p-5 flex flex-col gap-4 relative z-20 bg-black/40 backdrop-blur-md">
              <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[var(--color-crimson)] transition-colors">
                {item.title}
              </h3>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 glass px-2 py-1 rounded-md">
                    {getPlatformIcon(item.platform)}
                    <span className="text-xs font-medium text-gray-300 capitalize">{item.platform}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 font-mono uppercase">Views</span>
                    <span className="text-sm font-bold">{item.views}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">Growth</span>
                  <span className="text-sm font-bold text-green-400">{item.growth}</span>
                </div>
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[rgba(220,20,60,0.1)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
