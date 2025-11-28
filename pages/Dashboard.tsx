import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getSettings } from '../services/storageService';
import { User, AppSettings } from '../types';
import { AdUnit } from '../components/AdUnit';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate('/auth');
      return;
    }
    setUser(u);
    setSettings(getSettings());
  }, [navigate]);

  if (!user || !settings) return null;

  const categories = [
    { id: 'MATH', name: 'Math Problems', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', icon: '➗', desc: 'Arithmetic & Algebra' },
    { id: 'QUIZ', name: 'General Quiz', color: 'from-yellow-400 to-yellow-600', bg: 'bg-yellow-50', text: 'text-yellow-600', icon: '💡', desc: 'Knowledge Trivia' },
    { id: 'PUZZLE', name: 'Logic Puzzles', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600', icon: '🧩', desc: 'Brain Teasers' },
    { id: 'TYPING', name: 'Typing Test', color: 'from-green-400 to-green-600', bg: 'bg-green-50', text: 'text-green-600', icon: '⌨️', desc: 'Speed & Accuracy' },
  ];

  return (
    <div className="space-y-12 pb-10">
      {/* Header & Wallet Summary */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-2 tracking-tight">
            Hello, {user.name.split(' ')[0]} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">Ready to multiply your rewards today?</p>
        </div>
        
        <button 
          onClick={() => navigate('/wallet')}
          className="group relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 text-white px-8 py-5 rounded-[2rem] shadow-2xl hover:shadow-gray-900/40 transition-all transform hover:-translate-y-1 w-full md:w-auto text-left flex items-center justify-between border border-gray-700"
        >
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-india-saffron via-white to-india-green"></div>
           <div className="mr-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mb-1">Total Balance</p>
              <p className="text-3xl font-mono font-bold text-white group-hover:text-india-saffron transition-colors">{user.points.toLocaleString()} <span className="text-sm text-gray-500 font-sans">PTS</span></p>
           </div>
           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-white/20 transition-colors shadow-inner border border-white/5">
            💰
           </div>
        </button>
      </div>

      <AdUnit />

      {/* Categories Grid */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 mb-8 flex items-center">
          <span className="w-3 h-8 bg-india-saffron rounded-full mr-4 shadow-sm"></span>
          Choose Your Challenge
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/game/${cat.id}`)}
              className="group relative overflow-hidden glass-card p-0 rounded-[2rem] text-left hover:scale-[1.03] transition-all duration-300 border-0 shadow-lg hover:shadow-2xl"
            >
              <div className={`h-40 bg-gradient-to-br ${cat.color} p-6 relative overflow-hidden`}>
                <div className="absolute -bottom-6 -right-6 text-9xl opacity-20 transform rotate-12 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 filter blur-sm">{cat.icon}</div>
                <div className="absolute top-5 left-5 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30 shadow-lg">
                  <span className="text-white text-xs font-black tracking-widest uppercase">{settings.pointsPerQuestion} PTS / Q</span>
                </div>
              </div>
              
              <div className="p-8 bg-white/80 backdrop-blur-xl">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-2xl font-bold text-gray-800 group-hover:text-india-blue transition-colors">{cat.name}</h3>
                </div>
                <p className="text-gray-500 text-sm font-medium mb-6">{cat.desc}</p>
                <div className="flex items-center text-sm font-black uppercase tracking-wide text-gray-800 group-hover:text-india-saffron transition-colors">
                  Play Now <span className="ml-2 transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="glass-card p-10 rounded-[2.5rem] bg-gradient-to-r from-white/70 to-gray-50/50">
        <h3 className="text-xl font-bold text-gray-700 mb-8 flex items-center">
           <span className="text-2xl mr-3 bg-gray-100 p-2 rounded-xl">📊</span> Your Performance
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-md hover:shadow-lg transition-all">
             <div className="text-4xl font-black text-gray-800 mb-2">{user.solvedCount}</div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Questions Solved</p>
          </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-md hover:shadow-lg transition-all">
             <div className="text-4xl font-black text-green-600 mb-2">₹ {Math.floor(user.points / 10000 * settings.currencyRate)}</div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Estimated Value</p>
          </div>
           <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-md hover:shadow-lg transition-all">
             <div className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-green-100 text-green-700 font-bold text-sm mb-3">
               Active
             </div>
             <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Account Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};