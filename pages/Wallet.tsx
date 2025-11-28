import React, { useEffect, useState } from 'react';
import { getCurrentUser, addRedeemRequest, getSettings } from '../services/storageService';
import { User, RedeemRequest, AppSettings } from '../types';
import { useNavigate } from 'react-router-dom';

export const Wallet: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [calcPoints, setCalcPoints] = useState<string>('10000');
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate('/auth');
      return;
    }
    setUser(u);
    setSettings(getSettings());
  }, []);

  if (!user || !settings) return null;

  const RATE_PER_POINT = settings.currencyRate / 10000; 
  const MIN_REDEEM_POINTS = settings.minRedeemPoints;

  const handleRedeem = () => {
    if (!user) return;
    if (user.points < MIN_REDEEM_POINTS) {
      alert(`You need at least ${MIN_REDEEM_POINTS} points to redeem.`);
      return;
    }

    const rupees = Math.floor(user.points * RATE_PER_POINT);
    
    const req: RedeemRequest = {
      id: Date.now().toString(),
      userId: user.id,
      userEmail: user.email,
      amountPoints: user.points,
      amountRupees: rupees,
      status: 'PENDING',
      date: new Date().toLocaleDateString()
    };

    addRedeemRequest(req);
    alert('Redeem request submitted successfully! Admin will review shortly.');
    navigate('/dashboard');
  };

  const progress = Math.min((user.points / MIN_REDEEM_POINTS) * 100, 100);

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-10">
      <div className="text-center md:text-left">
         <h1 className="text-4xl font-black text-gray-800 tracking-tight">Your Wallet</h1>
         <p className="text-gray-500 font-medium mt-2">Manage your earnings and payouts securely.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch">
        {/* Credit Card Style Balance */}
        <div className="relative h-72 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-[2.5rem] shadow-2xl p-10 text-white overflow-hidden flex flex-col justify-between group transform transition-transform hover:scale-[1.01]">
          {/* Card Decorations */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full blur-[80px] -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-india-saffron opacity-10 rounded-full blur-[60px] -ml-20 -mb-20"></div>
          <div className="absolute top-1/2 left-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="flex justify-between items-start z-10">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-india-saffron via-white to-india-green opacity-90 border border-white/20"></div>
                <div>
                   <span className="font-bold tracking-[0.2em] text-sm opacity-90 block leading-none">BHARAT</span>
                   <span className="font-light tracking-[0.2em] text-xs opacity-70 block leading-none">REWARDS</span>
                </div>
             </div>
             <div className="px-3 py-1 bg-white/10 rounded-lg border border-white/10 backdrop-blur-sm">
                <span className="text-xs font-mono opacity-80">PLATINUM</span>
             </div>
          </div>

          <div className="z-10 text-center my-4">
             <p className="text-xs uppercase tracking-[0.3em] opacity-50 mb-2">Available Balance</p>
             <h2 className="text-6xl font-mono font-bold tracking-tighter drop-shadow-2xl">{user.points.toLocaleString()}</h2>
             <div className="inline-block mt-3 px-4 py-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border border-green-400/30 backdrop-blur-md">
               <span className="text-base font-bold text-green-400">≈ ₹ {(user.points * RATE_PER_POINT).toFixed(2)} INR</span>
             </div>
          </div>

          <div className="flex justify-between items-end z-10">
             <div>
                <p className="text-[10px] opacity-50 uppercase tracking-widest mb-1">Card Holder</p>
                <p className="font-bold tracking-widest uppercase text-sm truncate max-w-[200px] shadow-sm">{user.name}</p>
             </div>
             <div className="w-14 h-10 bg-gradient-to-br from-yellow-200/20 to-yellow-600/20 rounded-lg border border-yellow-500/30 flex items-center justify-center backdrop-blur-sm">
                <div className="w-8 h-6 border border-white/40 rounded-sm relative overflow-hidden">
                   <div className="absolute top-2 left-0 w-full h-[1px] bg-white/30"></div>
                   <div className="absolute top-3 left-0 w-full h-[1px] bg-white/30"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="glass-card p-10 rounded-[2.5rem] h-full flex flex-col justify-center bg-white/60">
          <h3 className="font-bold text-xl text-gray-700 mb-8 flex items-center">
            <span className="bg-orange-100 text-orange-600 p-3 rounded-2xl mr-4 shadow-sm text-2xl">🧮</span> 
            Earnings Calculator
          </h3>
          <div className="space-y-8">
            <div>
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-3">If you earn points:</label>
              <div className="relative">
                 <input 
                  type="number" 
                  value={calcPoints}
                  onChange={(e) => setCalcPoints(e.target.value)}
                  className="w-full p-5 pl-6 border border-gray-200 bg-white rounded-2xl font-mono text-2xl outline-none focus:ring-4 focus:ring-india-blue/10 focus:border-india-blue/50 transition-all shadow-sm"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm tracking-wider">PTS</span>
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 font-bold z-10 border border-white text-xs">⬇</div>
               <div className="flex justify-between items-center bg-gradient-to-r from-india-blue/5 via-blue-50/50 to-transparent p-6 rounded-3xl border border-india-blue/10 shadow-sm">
                  <span className="text-gray-600 font-bold">You get real cash:</span>
                  <span className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-r from-india-blue to-blue-600">
                    ₹ {((parseInt(calcPoints) || 0) * RATE_PER_POINT).toFixed(2)}
                  </span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Redeem Section */}
      <div className="glass-card p-12 rounded-[3rem] text-center relative overflow-hidden border-t-4 border-india-saffron">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50/30 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-4 text-gray-800">Redeem Your Earnings</h3>
          <p className="text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed text-lg">
            Reach <strong className="text-gray-900 bg-orange-100 px-2 rounded">{MIN_REDEEM_POINTS.toLocaleString()} Points</strong> to unlock withdrawals.
            <br/>Money is sent directly to your registered account.
          </p>
          
          <div className="max-w-2xl mx-auto mb-10">
            <div className="flex justify-between text-xs font-black text-gray-400 uppercase mb-3 tracking-widest">
               <span>Start</span>
               <span className={user.points >= MIN_REDEEM_POINTS ? "text-green-600" : "text-orange-500"}>
                 {Math.floor(progress)}% Goal Reached
               </span>
               <span>Target</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner border border-gray-200 p-1">
              <div 
                className="bg-gradient-to-r from-india-saffron via-orange-500 to-india-green h-full rounded-full transition-all duration-1000 relative shadow-md"
                style={{ width: `${progress}%` }}
              >
                 <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.2)_50%,rgba(255,255,255,.2)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-shimmer opacity-50"></div>
              </div>
            </div>
            {user.points < MIN_REDEEM_POINTS && (
              <p className="text-xs text-orange-500 font-bold mt-4 bg-orange-50 inline-block px-4 py-2 rounded-full border border-orange-100">
                 ⚠️ Generate {MIN_REDEEM_POINTS - user.points} more points to unlock payout.
              </p>
            )}
          </div>

          <button
            onClick={handleRedeem}
            disabled={user.points < MIN_REDEEM_POINTS}
            className={`px-12 py-5 rounded-2xl font-bold text-white shadow-xl transition-all text-xl ${
              user.points >= MIN_REDEEM_POINTS 
              ? 'bg-gradient-to-r from-india-blue to-blue-700 hover:to-blue-900 hover:shadow-blue-500/40 transform hover:-translate-y-1' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            }`}
          >
            {user.points >= MIN_REDEEM_POINTS ? 'Request Payout Now' : 'Keep Playing to Earn'}
          </button>
        </div>
      </div>
    </div>
  );
};