'use client';

import { Upload, Link as LinkIcon, Camera, CheckCircle, Zap, Image as ImageIcon, Video, Star, BarChart } from 'lucide-react';
import { motion } from 'framer-motion';

import { useRef, useState, useEffect } from 'react';

export interface AnalyzeStateData {
  activeInput: 'url' | 'upload';
  isAnalyzing: boolean;
  showResults: boolean;
  urlInput: string;
  selectedFile?: File | null;
  error?: string | null;
}

interface AnalyzeProps {
  state: AnalyzeStateData;
  setState: React.Dispatch<React.SetStateAction<AnalyzeStateData>>;
}

export function Analyze({ state, setState }: AnalyzeProps) {
  const { activeInput, isAnalyzing, showResults, urlInput, selectedFile, error } = state;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedTopic, setDetectedTopic] = useState<string>("Awesome Content");
  const [hasFace, setHasFace] = useState<boolean>(false);

  useEffect(() => {
    let raw = "Tech Startup";
    if (activeInput === 'upload' && selectedFile) {
      raw = selectedFile.name.replace(/\.[^/.]+$/, "");
    } else if (activeInput === 'url' && urlInput) {
      if (urlInput.includes('http')) {
        const parts = urlInput.split('/').filter(Boolean);
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length > 3 && !lastPart.startsWith('watch?')) {
          raw = decodeURIComponent(lastPart);
        } else {
          raw = "Viral Content";
        }
      } else {
        raw = urlInput;
      }
    }
    if (!raw || raw.length < 2) raw = "Awesome Content";
    setDetectedTopic(raw.replace(/[-_]/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()));
    
    // Reset face detection on new input
    setHasFace(false);
  }, [selectedFile, urlInput, activeInput]);

  const handleImageLoad = async () => {
    if (!imgRef.current) return;
    try {
      const tf = await import('@tensorflow/tfjs');
      const mobilenet = await import('@tensorflow-models/mobilenet');
      const blazeface = await import('@tensorflow-models/blazeface');
      await tf.ready();
      
      // Topic Detection
      const model = await mobilenet.load();
      const predictions = await model.classify(imgRef.current);
      if (predictions && predictions.length > 0) {
        const topPrediction = predictions[0].className.split(',')[0];
        const formattedPrediction = topPrediction.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
        setDetectedTopic(formattedPrediction);
      }

      // Face Detection
      const faceModel = await blazeface.load();
      const faces = await faceModel.estimateFaces(imgRef.current, false);
      setHasFace(faces.length > 0);
      
    } catch (error) {
      console.error("AI Analysis failed:", error);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setState(prev => ({ ...prev, selectedFile: e.target.files![0] }));
    }
  };

  const handleAnalyze = () => {
    setState(prev => ({ ...prev, isAnalyzing: true, error: null, showResults: false }));
    setTimeout(() => {
      // Simulate validation failure (e.g., 30% chance of blurry/unclear input) ONLY for file uploads
      const isUnclear = activeInput === 'upload' && Math.random() < 0.3;
      if (isUnclear) {
        setState(prev => ({ 
          ...prev, 
          isAnalyzing: false, 
          error: "unable to recognize : please retry"
        }));
      } else {
        // For URLs, we mock the face detection to true since we cannot fetch and analyze external video pixels directly in the browser due to CORS.
        if (activeInput === 'url') {
          setHasFace(true);
        }
        setState(prev => ({ ...prev, isAnalyzing: false, showResults: true }));
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center space-y-4 pt-4 pb-4">
        <h1 className="text-3xl md:text-4xl font-black text-white text-center tracking-tight">
          DEEP AI <span className="text-[var(--color-crimson)]">ANALYSIS</span> TOOL
        </h1>
      </div>

      {/* Input Section Wrapper */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto items-stretch justify-center w-full">
        {/* Main Input Area */}
        <div className="glass rounded-3xl p-8 flex-1 flex flex-col items-center relative overflow-hidden w-full max-w-3xl">
          {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--color-crimson)] rounded-full blur-[150px] opacity-10"></div>
        
        <div className="flex bg-[rgba(0,0,0,0.5)] p-1 rounded-xl mb-8 relative z-10 w-full max-w-md">
          <button 
            onClick={() => setState(prev => ({ ...prev, activeInput: 'upload' }))}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeInput === 'upload' ? 'bg-[var(--color-crimson)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <Upload size={16} /> Upload Media
          </button>
          <button 
            onClick={() => setState(prev => ({ ...prev, activeInput: 'url' }))}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeInput === 'url' ? 'bg-[var(--color-crimson)] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
          >
            <LinkIcon size={16} /> Paste URL
          </button>
        </div>

        {activeInput === 'upload' ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 border-2 border-dashed border-[rgba(255,255,255,0.1)] hover:border-[var(--color-crimson)] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors group relative z-10 bg-[rgba(0,0,0,0.2)]"
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,video/*" 
              onChange={handleFileChange} 
            />
            {selectedFile ? (
              <>
                <div className="flex gap-4 mb-4 text-[var(--color-crimson)]">
                  <CheckCircle size={32} />
                </div>
                <p className="text-sm font-bold text-white text-center px-4 truncate w-full max-w-sm">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-2">Click to change file</p>
              </>
            ) : (
              <>
                <div className="flex gap-4 mb-4 text-[var(--color-soft-gray)] group-hover:text-white transition-colors">
                  <ImageIcon size={32} />
                  <Video size={32} />
                </div>
                <p className="text-sm font-medium text-gray-300">Click to Select Image or Video</p>
                <p className="text-xs text-gray-500 mt-2">Maximum file size 500MB</p>
              </>
            )}
          </div>
        ) : (
          <div className="w-full relative z-10">
            <input 
              type="text" 
              value={urlInput}
              onChange={(e) => setState(prev => ({ ...prev, urlInput: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (!isAnalyzing && urlInput) handleAnalyze();
                }
              }}
              placeholder="https://..." 
              className="w-full bg-[rgba(0,0,0,0.4)] border border-[rgba(255,255,255,0.1)] rounded-xl py-4 px-6 text-white focus:outline-none focus:border-[var(--color-crimson)] transition-colors"
            />
          </div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 w-full p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm font-bold text-center flex items-center justify-center gap-2"
          >
            <Zap size={16} className="text-red-400" />
            {error}
          </motion.div>
        )}

        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || (activeInput === 'url' && !urlInput) || (activeInput === 'upload' && !selectedFile)}
          className="mt-8 bg-white text-black hover:bg-gray-200 font-bold py-4 px-12 rounded-xl transition-colors relative z-10 disabled:opacity-50 flex items-center gap-2"
        >
          {isAnalyzing ? (
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
               <Zap size={18} />
             </motion.div>
          ) : <Zap size={18} />}
          {isAnalyzing ? 'Processing AI Models...' : 'Run Deep Analysis'}
        </button>
        </div>

        {/* New Preview Box on the Right */}
        {activeInput === 'upload' && selectedFile && previewUrl && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            className="w-full lg:w-72 shrink-0 p-6 glass rounded-3xl flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-crimson)] opacity-5 blur-[100px]"></div>
            <p className="text-xs text-gray-400 mb-4 uppercase tracking-wider font-bold relative z-10">Upload Preview</p>
            {selectedFile.type.startsWith('video/') ? (
              <video src={previewUrl} controls className="max-h-48 rounded-lg object-contain w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.05)] relative z-10" />
            ) : (
              <img ref={imgRef} src={previewUrl} alt="Preview" crossOrigin="anonymous" onLoad={handleImageLoad} className="max-h-48 rounded-lg object-contain w-full bg-[rgba(0,0,0,0.5)] border border-[rgba(255,255,255,0.05)] relative z-10" />
            )}
          </motion.div>
        )}
      </div>

      {showResults && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Facial Expression Analysis */}
          <div className="glass rounded-3xl p-6 relative overflow-hidden group flex flex-col">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Camera className="text-[var(--color-crimson)]" />
              <h3 className="text-xl font-bold text-white">Facial Expression Analysis</h3>
            </div>
            
            {hasFace ? (
              <>
                <div className="flex items-center justify-between bg-[rgba(0,0,0,0.4)] p-4 rounded-xl border border-green-500/30 mb-6 relative z-10">
                  <span className="text-green-400 font-bold tracking-widest text-sm">OVERALL STATUS</span>
                  <span className="text-green-400 font-black flex items-center gap-2">GOOD TO GO 👍 😊</span>
                </div>

                <div className="space-y-4 relative z-10">
                  {[
                    { trait: 'Confidence', score: 92 },
                    { trait: 'Smile / Warmth', score: 88 },
                    { trait: 'Eye Contact', score: 95 },
                    { trait: 'Energy Level', score: 84 },
                    { trait: 'Emotion Alignment', score: 90 },
                  ].map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1 text-gray-300">
                        <span>{item.trait}</span>
                        <span className="font-mono">{item.score}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-crimson)]" style={{ width: `${item.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[rgba(0,0,0,0.4)] rounded-xl border border-[rgba(255,255,255,0.05)] relative z-10 min-h-[250px]">
                <Camera size={48} className="text-[rgba(255,255,255,0.1)] mb-4" />
                <p className="text-gray-300 font-bold text-lg">No facial recognition found</p>
                <p className="text-sm text-gray-500 mt-2">No human interaction detected in the uploaded media or URL.</p>
              </div>
            )}
          </div>

          {/* Content Comparison & Improvements */}
          <div className="glass rounded-3xl p-6 flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart className="text-[var(--color-crimson)]" />
                <h3 className="text-xl font-bold text-white">Content Comparison</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 text-center border border-[rgba(255,255,255,0.05)]">
                  <div className="text-2xl font-black text-white">88%</div>
                  <div className="text-xs text-gray-400 mt-1">Similarity Score</div>
                </div>
                <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 text-center border border-[rgba(255,255,255,0.05)]">
                  <div className="text-2xl font-black text-white">94%</div>
                  <div className="text-xs text-gray-400 mt-1">Trend Alignment</div>
                </div>
                <div className="bg-[rgba(0,0,0,0.3)] rounded-xl p-4 text-center border border-[rgba(255,255,255,0.05)]">
                  <div className="text-2xl font-black text-[var(--color-crimson)]">High</div>
                  <div className="text-xs text-gray-400 mt-1">Viral Potential</div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">Improvement Suggestions</h3>
              <div className="space-y-3">
                {[
                  { area: 'Lighting', boost: '+12%', color: 'text-yellow-400' },
                  { area: 'Thumbnail Concept', boost: '+18%', color: 'text-blue-400' },
                  { area: 'Title Optimization', boost: '+23%', color: 'text-[var(--color-crimson)]' },
                  { area: 'Hook (First 3s)', boost: '+15%', color: 'text-green-400' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.02)] transition-colors">
                    <span className="text-sm text-gray-200">{item.area}</span>
                    <span className={`text-sm font-bold ${item.color}`}>Potential: {item.boost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Title Optimizer */}
          <div className="glass rounded-3xl p-6 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Star className="text-[var(--color-crimson)]" />
              <h3 className="text-xl font-bold text-white">AI Title Optimizer</h3>
            </div>

            <div className="bg-black/50 p-4 rounded-xl mb-6 border border-white/10">
              <p className="text-sm text-gray-400 mb-2">Original Title Context Detected</p>
              <p className="text-lg font-medium text-white">"{detectedTopic}"</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 pl-4">Suggested Title</th>
                    <th className="pb-3 w-24 text-center">Viral Score</th>
                    <th className="pb-3 w-24 text-center">SEO Score</th>
                    <th className="pb-3 w-24 text-center">Trend Match</th>
                    <th className="pb-3 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { title: `I Built ${detectedTopic} (Here's How)`, vs: 98, seo: 95, tm: 99 },
                    { title: `30 Days to Master ${detectedTopic}`, vs: 92, seo: 98, tm: 90 },
                    { title: `The Brutal Truth About ${detectedTopic}`, vs: 95, seo: 85, tm: 94 },
                    { title: `I Tried ${detectedTopic} (It Got Weird)`, vs: 94, seo: 82, tm: 96 },
                    { title: `The Ultimate Guide to ${detectedTopic}`, vs: 89, seo: 97, tm: 88 },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 pl-4 text-sm font-medium text-white">{row.title}</td>
                      <td className="py-4 text-center text-sm font-mono text-[var(--color-crimson)]">{row.vs}</td>
                      <td className="py-4 text-center text-sm font-mono text-green-400">{row.seo}</td>
                      <td className="py-4 text-center text-sm font-mono text-blue-400">{row.tm}</td>
                      <td className="py-4 pr-4 text-right">
                        <button className="opacity-0 group-hover:opacity-100 bg-white text-black px-3 py-1 rounded text-xs font-bold transition-opacity">Copy</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
