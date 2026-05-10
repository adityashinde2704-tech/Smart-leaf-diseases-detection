import React, { useState } from 'react';
import { CameraFeed } from './components/CameraFeed';
import { ChatInterface } from './components/ChatInterface';
import { Message, AnalysisResult } from './types';
import { analyzeLeaf, getChatResponse } from './services/gemini';
import { motion } from 'motion/react';
import { Leaf, Info } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = async (base64Image: string) => {
    setIsProcessing(true);
    
    // Create optimistic user message with image
    const userMsg: Message = {
      role: 'user',
      content: 'Scanning leaf for identification and health check...',
      image: base64Image,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await analyzeLeaf(base64Image);
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: result.explanation,
        timestamp: Date.now(),
        result: result,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Apologies, I encountered an error while analyzing the image. Please ensure the leaf is clearly visible and try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    setIsProcessing(true);
    
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const responseText = await getChatResponse(messages, text);
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: responseText || 'I am processing your request.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to generate response. Please try again.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-lg shadow-green-500/20">
            <Leaf size={18} className="text-slate-950" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white">Smart Leaf <span className="text-green-500">Bio-Arch</span></h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">ESP32-CAM: Online</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Latency: 42ms</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 gap-4 overflow-hidden">
        {/* Left Panel: Camera Feed (60%) */}
        <section className="w-full lg:w-[60%] flex flex-col min-h-0">
          <CameraFeed onCapture={handleCapture} isProcessing={isProcessing} />
        </section>

        {/* Right Panel: Chat Interface (40%) */}
        <section className="w-full lg:w-[40%] flex flex-col min-h-0">
          <ChatInterface 
            messages={messages} 
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </section>
      </main>

      {/* Status Bar Footer */}
      <footer className="h-8 bg-slate-950 border-t border-slate-900 px-6 flex items-center justify-between text-[10px] font-mono text-slate-500 shrink-0">
        <div>BIO-NODE VERSION: 2.1.0-STABLE</div>
        <div className="flex gap-4">
          <span className="text-green-600">SECURE CLOUD LINK ACTIVE</span>
        </div>
      </footer>
    </div>
  );
}
