
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { ModelType, TokenStats, HistoryItem } from './types';
import { MODEL_CONFIGS, MAX_TOKENS } from './constants';
import { estimateTokens, formatNumber, formatCurrency } from './services/tokenService';
import { ProgressBar } from './components/ProgressBar';
import { TokenComparison } from './components/TokenComparison';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<ModelType>(ModelType.GEMINI_3_FLASH);
  const [stats, setStats] = useState<TokenStats>({ tokens: 0, words: 0, characters: 0, estimatedCost: 0 });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'visualizer'>('calculator');

  // Update stats whenever text or model changes
  useEffect(() => {
    const newStats = estimateTokens(inputText, selectedModel);
    setStats(newStats);
  }, [inputText, selectedModel]);

  const handleClear = () => {
    setInputText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inputText);
  };

  const handleSimulateLoad = async () => {
    setIsSimulating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Generate a long and detailed technical report about the scaling laws of large language models, specifically focusing on context windows up to 1 million tokens. Be verbose.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Use a standard model for generation
        contents: prompt,
        config: {
          temperature: 0.7,
          topP: 0.95,
          maxOutputTokens: 1000
        }
      });

      const text = response.text || '';
      setInputText(prev => prev + (prev ? '\n\n' : '') + text);
      
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        text: text.substring(0, 100) + '...',
        tokens: estimateTokens(text, selectedModel).tokens,
        type: 'output'
      };
      setHistory(prev => [newItem, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Simulation failed:', error);
      alert('Generation error. Please check your connection.');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 7.5 14.6 3 12"></polyline><polyline points="21 12 16.5 14.6 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">TokenScale Pro</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Advanced Context Analytics</p>
            </div>
          </div>

          <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('calculator')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'calculator' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Calculator
            </button>
            <button 
              onClick={() => setActiveTab('visualizer')}
              className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${activeTab === 'visualizer' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Visualizer
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {activeTab === 'calculator' ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-220px)] min-h-[550px]">
                <div className="p-4 border-b border-slate-100 bg-slate-50/80 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <label htmlFor="model-select" className="text-xs font-black text-slate-400 uppercase tracking-widest">Model</label>
                    <select 
                      id="model-select"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                      className="bg-white border border-slate-300 text-slate-900 text-sm font-bold rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-3 py-1.5 outline-none cursor-pointer hover:border-slate-400 transition-all appearance-none"
                      style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1em', paddingRight: '2.5rem' }}
                    >
                      {Object.entries(MODEL_CONFIGS).map(([key, config]) => (
                        <option key={key} value={key} className="text-slate-900 bg-white">{config.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-1">
                    <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      <span className="text-xs font-bold uppercase tracking-tighter">Copy</span>
                    </button>
                    <button onClick={handleClear} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center space-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      <span className="text-xs font-bold uppercase tracking-tighter">Clear</span>
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow relative bg-white">
                  <textarea
                    className="absolute inset-0 w-full h-full p-8 text-slate-900 bg-white leading-relaxed focus:outline-none resize-none mono text-base placeholder-slate-300 font-medium"
                    placeholder="Enter your prompts or context data here to calculate tokens..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <div className="flex space-x-8">
                    <span>Characters: <span className="text-slate-900 font-mono">{formatNumber(stats.characters)}</span></span>
                    <span>Words: <span className="text-slate-900 font-mono">{formatNumber(stats.words)}</span></span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mr-2 animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                    Engine Active
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <TokenComparison currentTokens={stats.tokens} />
                <div className="bg-gradient-to-br from-slate-900 to-blue-900 p-8 rounded-2xl text-white shadow-2xl border border-white/10">
                  <h3 className="text-2xl font-black mb-3 tracking-tight">The Million-Token Context Era</h3>
                  <p className="text-slate-300 mb-8 leading-relaxed font-medium">
                    Industry leaders like Gemini, GPT, and Claude have broken the context barrier. 
                    Calculations below reflect current enterprise-grade token limits.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 group hover:bg-white/10 transition-all">
                      <div className="text-3xl font-black text-blue-400 mb-1">1M+</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Tokens Cap</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 group hover:bg-white/10 transition-all">
                      <div className="text-3xl font-black text-indigo-400 mb-1">12k+</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">File Lines</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 group hover:bg-white/10 transition-all">
                      <div className="text-3xl font-black text-emerald-400 mb-1">2.5k</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">PDF Pages</div>
                    </div>
                    <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-md border border-white/10 group hover:bg-white/10 transition-all">
                      <div className="text-3xl font-black text-rose-400 mb-1">1hr</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Video Data</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Stats Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Token Metrics</h2>
              
              <div className="space-y-10">
                <div>
                  <div className="text-5xl font-black text-slate-900 mono mb-2 tracking-tighter">
                    {formatNumber(stats.tokens)}
                  </div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Estimated Tokens</div>
                </div>

                <ProgressBar current={stats.tokens} />

                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Input Cost</span>
                    <span className="text-base font-black text-slate-900">{formatCurrency(stats.estimatedCost)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Output Cost</span>
                    <span className="text-base font-black text-slate-900">{formatCurrency(stats.tokens / 1000000 * MODEL_CONFIGS[selectedModel].costPerMillionOutput)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSimulateLoad}
                disabled={isSimulating}
                className={`w-full mt-10 py-4 px-6 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 transition-all shadow-xl active:scale-[0.97] ${isSimulating ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-200'}`}
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    <span>Generate Text Payload</span>
                  </>
                )}
              </button>
            </div>

            {/* Models Preview */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
              <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4 text-center">Top Tier Models Added</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {['GPT-5.2', 'Claude 3.5', 'Solar Pro', 'Grok-2', 'Llama 3.1'].map(m => (
                  <span key={m} className="px-2 py-1 bg-white/10 rounded text-[9px] font-black uppercase tracking-tighter border border-white/5">{m}</span>
                ))}
              </div>
            </div>

            {/* History Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Log</h2>
                {history.length > 0 && (
                  <button onClick={() => setHistory([])} className="text-[9px] text-red-500 hover:text-red-700 font-black uppercase tracking-widest">
                    Clear
                  </button>
                )}
              </div>
              
              {history.length === 0 ? (
                <div className="py-8 text-center text-slate-300 font-bold text-xs uppercase tracking-widest italic">Empty</div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {history.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 group transition-all">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase tracking-tighter">
                          {item.type}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2 font-medium leading-relaxed italic mb-2">"{item.text}"</p>
                      <div className="text-[10px] font-black text-slate-900 flex items-center">
                        <svg className="w-3 h-3 mr-1 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {formatNumber(item.tokens)} TOKENS
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <div className="flex space-x-8 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">GPT-5.2 Tier</span>
              <span className="text-xs font-black text-slate-900 tracking-tight">$15.00 / 1M Input</span>
            </div>
            <div className="w-[1px] h-8 bg-slate-200"></div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Solar Pro</span>
              <span className="text-xs font-black text-slate-900 tracking-tight">$0.25 / 1M Flat</span>
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">TokenScale Pro &copy; {new Date().getFullYear()} &bull; Professional AI Infrastructure</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
