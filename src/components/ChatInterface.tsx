import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Sparkles, AlertCircle, Leaf, Activity, Microscope } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message, AnalysisResult } from '../types';
import { getChatResponse } from '../services/gemini';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages, 
  onSendMessage, 
  isProcessing 
}) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    onSendMessage(inputValue);
    setInputValue('');
  };

  const latestResult = messages.slice().reverse().find(m => m.result)?.result;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Analysis Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4 shadow-xl shrink-0">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity size={14} className="text-green-500" />
          Real-time Bio-Diagnosis
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-end border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400">Species</span>
            <span className="text-xs font-bold text-white uppercase">{latestResult?.leafType || '---'}</span>
          </div>
          <div className="flex justify-between items-end border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400">Pathogen Status</span>
            <span className={`text-xs font-bold uppercase ${latestResult?.condition === 'diseased' ? 'text-amber-400' : latestResult?.condition === 'healthy' ? 'text-green-500' : 'text-slate-500'}`}>
              {latestResult?.condition || 'Awaiting'}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-400">AI Confidence</span>
            <span className="text-xs font-mono font-bold text-slate-200">
               {latestResult ? `${(latestResult.confidence * 100).toFixed(1)}%` : '00.0%'}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-well">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center px-8 space-y-4 opacity-30">
              <Sparkles size={40} className="text-slate-600" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Awaiting bio-input for analysis</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    <Bot size={16} className="text-green-500" />
                  </div>
                )}
                
                <div className="flex flex-col gap-2 max-w-[85%]">
                  {msg.image && (
                    <img src={msg.image} className="w-48 rounded-xl border border-slate-700 shadow-lg object-cover aspect-video" alt="Captured" />
                  )}
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-green-600/20 border border-green-500/30 text-slate-200 rounded-tr-none' 
                      : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot size={16} className="text-green-500 animate-pulse" />
              </div>
              <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce" />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1 h-1 bg-green-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isProcessing}
              placeholder="Ask Bio-Arch..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-green-500 transition-colors shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isProcessing}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 hover:text-green-400 disabled:opacity-20"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
    <div className="flex items-center gap-1.5 mb-1 opacity-50">
      {icon}
      <span className="text-[9px] uppercase tracking-wide font-bold">{label}</span>
    </div>
    <span className="text-[10px] text-zinc-300 block truncate">{value}</span>
  </div>
);
