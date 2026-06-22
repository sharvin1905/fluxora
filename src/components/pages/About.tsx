'use client';

import { motion } from 'framer-motion';
import { X, Target, Zap, TrendingUp, Users, Brain, Activity } from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

export function About({ onClose }: AboutProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] glass rounded-3xl overflow-hidden flex flex-col relative border border-white/10 shadow-[0_0_50px_rgba(220,20,60,0.1)]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-crimson)] transition-colors text-white"
        >
          <X size={20} />
        </button>

        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-crimson)] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              ABOUT <span className="text-[var(--color-crimson)]">FLUXORA</span>
            </h2>
            <p className="text-lg text-[var(--color-soft-gray)] max-w-2xl leading-relaxed">
              Fluxora predicts future social media trends before they become viral. By leveraging deep learning, computer vision, and NLP models, we forecast content success with unprecedented accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { title: 'Social Media Analysis', icon: Activity, desc: 'Deep metric extraction across YouTube, TikTok, IG, and LinkedIn.' },
              { title: 'Future Trend Prediction', icon: Target, desc: 'Identify trends 30-90 days before they peak in the mainstream.' },
              { title: 'Viral Content Forecasting', icon: Zap, desc: 'Predict exactly how well a specific piece of content will perform.' },
              { title: 'Creator Growth Forecast', icon: TrendingUp, desc: 'Project follower and engagement growth trajectories.' },
              { title: 'AI Title Optimization', icon: Brain, desc: 'Generate high-CTR, SEO-optimized titles ranked by viral probability.' },
              { title: 'Facial Expression Analysis', icon: Users, desc: 'Analyze creator confidence, energy, and emotional alignment in thumbnails/videos.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--color-crimson)] transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-[var(--color-crimson)]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-[rgba(220,20,60,0.1)] border border-[var(--color-crimson)] rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-xl mb-2">Ready to maximize your viral potential?</h3>
              <p className="text-gray-300 text-sm">Join top creators using Fluxora to dominate algorithms.</p>
            </div>
            <button onClick={onClose} className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap">
              Start Analyzing
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
