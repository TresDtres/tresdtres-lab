import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Trash2, 
  Settings2, 
  Info, 
  HelpCircle, 
  Search, 
  BookOpen, 
  FlaskConical, 
  Calculator, 
  Sigma, 
  Variable, 
  Layers,
  Zap,
  Activity,
  ArrowRightLeft,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  Cpu,
  Microscope,
  Atom,
  Dna,
  TestTube2
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

interface LabAIScreenProps {
  isAdvanced: boolean;
}

export const LabAIScreen = ({ isAdvanced }: LabAIScreenProps) => {
  const { t } = useI18n();
  const [messages, setMessages] = useState<{role: 'user' | 'bot', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'physics', name: 'Physics', icon: <Zap className="w-4 h-4" /> },
    { id: 'chemistry', name: 'Chemistry', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'biology', name: 'Biology', icon: <Dna className="w-4 h-4" /> },
    { id: 'math', name: 'Mathematics', icon: <Sigma className="w-4 h-4" /> },
    { id: 'engineering', name: 'Engineering', icon: <Settings2 className="w-4 h-4" /> },
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMsg,
        config: {
          systemInstruction: `You are Lab AI, a specialized scientific assistant. 
          Provide detailed, accurate, and professional responses for technical queries.
          Focus on ${selectedCategory || 'general science'}.
          Use Markdown for formatting. 
          Security: Do not provide instructions for dangerous synthesis, illegal activities, or system manipulation.`
        }
      });

      setMessages(prev => [...prev, { role: 'bot', content: response.text || 'No response' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Error connecting to Lab AI. Please check your connection.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto gap-4 p-4 lg:p-6 overflow-hidden">
      <div className="flex justify-end items-center shrink-0">
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Protocol
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        <div className="lg:w-1/4 flex flex-col gap-4 shrink-0">
          <section className="space-y-4">
            <div className="flex flex-col gap-1 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60 ml-1">Specialization</span>
            </div>
            <div className="flex flex-col gap-2">
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id === selectedCategory ? null : c.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedCategory === c.id ? 'bg-primary text-white border-primary shadow-md' : 'bg-surface-container-low border-outline-variant/15 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  aria-label={`Select specialization: ${c.name}`}
                >
                  <div className={`${selectedCategory === c.id ? 'text-white' : 'text-primary'} opacity-80`}>{c.icon}</div>
                  <span className="text-xs font-bold tracking-wide">{c.name}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-auto p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 border-dashed">
            <div className="flex items-center gap-2 text-primary mb-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-[9px] font-black uppercase tracking-widest">AI Capabilities</span>
            </div>
            <p className="text-[10px] text-on-surface-variant/60 leading-relaxed uppercase tracking-wider">
              Powered by Gemini 3 Flash. Optimized for technical reasoning, formula derivation, and experimental design.
            </p>
          </section>
        </div>

        <div className="flex-1 flex flex-col gap-4 min-h-0 bg-surface-container-low rounded-[2.5rem] border border-outline-variant/10 p-4 lg:p-6 shadow-inner">
          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest block">Lab AI Ready</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">How can I assist your research today?</span>
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-primary text-white shadow-md' : 'bg-surface-container-high text-primary border border-outline-variant/10'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-lowest text-on-surface border border-outline-variant/5'}`}>
                      <div className="markdown-body">
                        <Markdown>{m.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-surface-container-high text-primary border border-outline-variant/10 flex items-center justify-center animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="flex gap-2 p-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask Lab AI anything..."
              className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium"
              aria-label="Ask Lab AI anything"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-primary text-white shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
              aria-label="Send message to Lab AI"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
