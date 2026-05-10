import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Power, Settings, ShieldAlert, CheckCircle2, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraFeedProps {
  onCapture: (base64Image: string) => void;
  isProcessing: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ onCapture, isProcessing }) => {
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(true);
  const videoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleConnect = () => {
    if (!streamUrl) {
      setError('Please enter a valid ESP32-CAM URL');
      return;
    }
    setError(null);
    setIsConnected(true);
    setShowSettings(false);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setShowSettings(true);
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = videoRef.current.naturalWidth;
    canvas.height = videoRef.current.naturalHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    
    const base64 = canvas.toDataURL('image/jpeg', 0.82);
    onCapture(base64);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Viewport */}
      <div className="flex-1 bg-black rounded-2xl border border-slate-800 relative overflow-hidden flex items-center justify-center group shadow-2xl">
        {isConnected ? (
          <>
            <img
              ref={videoRef}
              src={streamUrl}
              alt="ESP32 Stream"
              className="max-w-full max-h-full object-contain"
              onError={() => {
                setError('Failed to connect to stream. Check URL and connectivity.');
                setIsConnected(false);
              }}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Status Overlays */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div className="bg-green-500/20 border border-green-500/50 px-2 py-1 rounded text-[10px] font-mono text-green-400 backdrop-blur-md">
                INFERENCE: ACTIVE (0.98 CONF)
              </div>
              <div className="bg-black/40 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono text-slate-300 backdrop-blur-md uppercase">
                MODEL: BIOVISION-V3
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 text-slate-700">
            <Camera size={64} strokeWidth={0.5} className="opacity-20" />
            <p className="text-xs font-mono uppercase tracking-[0.3em] opacity-40">MJPEG Stream Offline</p>
          </div>
        )}

        {/* Settings Overlay */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md"
            >
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-well">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Settings size={16} className="text-green-500"/>
                   Stream Config
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                      ESP32-CAM LOCAL IP
                    </label>
                    <input
                      type="text"
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      placeholder="http://192.168.1.XX/stream"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-200 text-sm focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-[10px] font-mono">
                      <ShieldAlert size={14} className="shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    onClick={handleConnect}
                    className="w-full p-3.5 bg-green-500 hover:bg-green-400 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Power size={18} />
                    Integrate Stream
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Bar */}
      <div className="h-24 bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex gap-3">
          <button
            onClick={captureImage}
            disabled={!isConnected || isProcessing}
            className="px-6 py-3 bg-green-500 hover:bg-green-400 text-slate-950 font-black rounded-xl transition-all flex items-center gap-3 disabled:opacity-20 active:scale-95"
          >
            <Camera size={20} />
            CAPTURE SNAPSHOT
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-3 bg-slate-800 border border-slate-700 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
          >
            <Settings size={20} />
          </button>
        </div>

        <div className="hidden md:grid grid-cols-3 gap-8 px-8 border-l border-slate-800">
          <div className="text-center">
            <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">FPS</div>
            <div className="text-xl font-mono text-white leading-none">24.2</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">Signal</div>
            <div className="text-xl font-mono text-white leading-none">-42dB</div>
          </div>
          <div className="text-center">
            <div className="text-[9px] text-slate-500 uppercase font-black tracking-tighter mb-1">Mode</div>
            <div className="text-xl font-mono text-green-500 leading-none">HD</div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
