import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToAI } from './services/ai';
import { Bot, Send, Sparkles, User, Zap, Stars } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

function App() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [chatStarted, setChatStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleStartLearning = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setChatStarted(true);
    setIsLoading(true);
    setError('');

    const initialMessage = `I want to learn about "${topic}" at a ${level} level. Let's begin!`;
    const initialHistory = [{ role: 'user', text: initialMessage }];
    
    setMessages(initialHistory);

    try {
      const response = await sendMessageToAI(initialHistory);
      setMessages([...initialHistory, { role: 'model', text: response }]);
    } catch (err) {
      setError('Failed to connect to the AI. Please check your connection or API key.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newHistory = [...messages, { role: 'user', text: userMessage }];
    setMessages(newHistory);
    setIsLoading(true);
    setError('');

    try {
      const response = await sendMessageToAI(newHistory);
      setMessages([...newHistory, { role: 'model', text: response }]);
    } catch (err) {
      setError('Failed to get a response.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 font-['Outfit'] text-slate-50 flex flex-col">
      {/* Animated Background Mesh */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 z-10 backdrop-blur-md bg-slate-950/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
              <div className="relative bg-slate-900 ring-1 ring-white/10 p-2 rounded-xl">
                <Zap className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 animate-gradient-x">
              LearnMate AI
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-200">
            <Stars className="w-4 h-4 text-fuchsia-400" />
            <span>Interactive Learning</span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center items-center">
        {!chatStarted ? (
          /* Start Screen */
          <div className="w-full max-w-2xl text-center space-y-8 animate-in fade-in zoom-in duration-700 ease-out">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-sm font-medium animate-float">
              <Sparkles className="w-4 h-4" /> AI Learning Assistant
            </div>
            
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              What do you want to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">learn</span> today?
            </h2>

            <form onSubmit={handleStartLearning} className="relative group w-full mt-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-indigo-500 rounded-2xl blur opacity-25 group-focus-within:opacity-60 transition duration-1000 animate-gradient-x"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/10 flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="e.g. React Native, Machine Learning, Guitar..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="flex-1 px-5 py-4 outline-none text-white bg-transparent placeholder:text-slate-500 text-lg font-medium"
                  required
                />
                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0 sm:pl-2">
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="bg-slate-800/50 border border-white/5 text-slate-200 py-4 px-4 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <button
                    type="submit"
                    disabled={!topic.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
                  >
                    <span>Start Learning</span>
                    <Zap className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          /* Chat Interface */
          <div className="w-full h-full max-h-[80vh] flex flex-col bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-white">Learning: {topic}</h3>
                <p className="text-xs text-indigo-300">{level} Level</p>
              </div>
              <button 
                onClick={() => setChatStarted(false)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Change Topic
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scroll-smooth">
              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-500' : 'bg-fuchsia-600'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-100' : 'bg-slate-800 border border-slate-700 text-slate-200'}`}>
                    {msg.role === 'model' ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 max-w-none">
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-fuchsia-600">
                    <Bot className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-fuchsia-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="text-center p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-slate-900/80 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative flex items-center gap-2 max-w-4xl mx-auto">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question or request more details..."
                  className="flex-1 bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
