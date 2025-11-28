import React from 'react';
import { Link } from 'react-router-dom';
import { AdUnit } from '../components/AdUnit';

export const Landing: React.FC = () => {
  return (
    <div className="space-y-20 animate-fade-in-up pb-10">
      {/* Hero Section */}
      <div className="text-center py-16 md:py-24 px-4 relative">
        {/* Glow effect behind text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-orange-300/20 via-white/10 to-green-300/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 border border-white/50 backdrop-blur-md shadow-sm mb-6">
          <span className="bg-gradient-to-r from-india-saffron to-orange-600 bg-clip-text text-transparent font-bold tracking-wide text-sm uppercase">
            🚀 The #1 Play-to-Earn Platform in India
          </span>
        </div>

        <h1 className="text-5xl md:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tight drop-shadow-sm">
          Turn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-saffron via-orange-500 to-india-saffron relative">
            Knowledge
            <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-300 opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none">
               <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span><br/>
          Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-india-green via-emerald-600 to-india-green relative">
            Real Rewards
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed opacity-90">
          The ultimate platform offering Math, Quiz, Puzzle, and Typing challenges. 
          Solve questions, earn points, and redeem cash directly to your wallet.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <Link to="/auth" className="group relative w-full sm:w-auto overflow-hidden rounded-full shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1">
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-india-saffron to-orange-600 group-hover:scale-105 transition-transform duration-300"></div>
            <div className="relative px-12 py-5 text-white text-lg font-bold flex items-center justify-center">
              Start Earning Free
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
          <a href="#rules" className="w-full sm:w-auto px-12 py-5 rounded-full text-lg font-bold text-gray-700 bg-white/50 hover:bg-white border border-white/60 shadow-lg backdrop-blur-md transition-all">
            How it Works
          </a>
        </div>
      </div>

      <AdUnit />

      {/* Services/Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Math Master", icon: "➗", desc: "Solve arithmetic problems fast.", color: "from-blue-400 to-blue-600", shadow: "shadow-blue-500/20" },
          { title: "Typing Speed", icon: "⌨️", desc: "Type accuracy challenges.", color: "from-green-400 to-green-600", shadow: "shadow-green-500/20" },
          { title: "India Quiz", icon: "🇮🇳", desc: "Test your GK about Bharat.", color: "from-orange-400 to-orange-600", shadow: "shadow-orange-500/20" },
          { title: "Brain Puzzles", icon: "🧩", desc: "Logic riddles & teasers.", color: "from-purple-400 to-purple-600", shadow: "shadow-purple-500/20" }
        ].map((item, idx) => (
          <div key={idx} className={`glass-card p-8 rounded-[2.5rem] text-center hover:bg-white/90 transition-all duration-300 group`}>
            <div className={`w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center text-5xl shadow-xl ${item.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 text-white`}>
              {item.icon}
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-india-saffron transition-colors">{item.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Rules & Info Section */}
      <div id="rules" className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="glass-card p-12 rounded-[2.5rem] border-l-[12px] border-india-blue relative overflow-hidden bg-gradient-to-br from-white/70 to-blue-50/50">
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-9xl text-india-blue font-black pointer-events-none transform rotate-12">?</div>
           <h2 className="text-3xl font-black mb-10 text-gray-800 flex items-center">
             <span className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-india-blue shadow-inner">ℹ️</span>
             Platform Rules
           </h2>
           <ul className="space-y-6 text-gray-700 text-lg font-medium">
             {[
               "10 Points for every correct answer.",
               "0 Points for wrong/skipped answers.",
               "15-second timer per question.",
               "Minimum Redeem: 14,000 Points (₹50).",
               "Strict anti-cheat: No copy-paste."
             ].map((rule, i) => (
               <li key={i} className="flex items-center group">
                 <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-black mr-5 shadow-sm group-hover:bg-green-500 group-hover:text-white transition-colors">✓</span>
                 {rule}
               </li>
             ))}
           </ul>
        </div>

        {/* Discussion / CTA */}
        <div className="flex flex-col gap-8">
           <div className="glass-card p-10 rounded-[2.5rem] flex-1 flex flex-col justify-center text-center bg-gradient-to-br from-white/60 to-orange-50/60 border-t-8 border-orange-400">
             <h3 className="text-3xl font-bold mb-3 text-gray-800">Community Hub</h3>
             <p className="text-gray-500 mb-8 font-medium">Got suggestions? Want to request a feature?</p>
             <button className="w-full py-4 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
               <span>💬</span> Join Discussion
             </button>
           </div>
           
           <div className="glass-card p-10 rounded-[2.5rem] flex-1 flex flex-col justify-center text-center bg-gradient-to-br from-white/60 to-green-50/60 border-t-8 border-green-500">
             <h3 className="text-3xl font-bold mb-3 text-gray-800">Payout Proofs</h3>
             <p className="text-gray-500 mb-8 font-medium">See real payments made to our top users.</p>
             <button className="w-full py-4 rounded-2xl bg-white border border-gray-200 text-green-700 font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
               <span>💸</span> View Proofs
             </button>
           </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-800">Loved by <span className="text-india-saffron">Indians</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Rahul Kumar", role: "Student, Delhi", text: "Paid my recharge bills just by solving math problems! Super fast withdrawal.", color: "bg-orange-100 text-orange-600" },
            { name: "Priya Sharma", role: "Homemaker, Mumbai", text: "Great way to use free time. The interface is beautiful and easy to use.", color: "bg-green-100 text-green-600" },
            { name: "Amit Verma", role: "Freelancer, Bangalore", text: "100% Legit platform. Redeemed ₹35 yesterday instantly to my wallet.", color: "bg-blue-100 text-blue-600" }
          ].map((review, i) => (
            <div key={i} className="glass-card p-10 rounded-[2.5rem] hover:bg-white/95 transition-all hover:-translate-y-2">
              <div className="flex items-center mb-8">
                <div className={`w-16 h-16 rounded-full ${review.color} flex items-center justify-center font-bold text-2xl shadow-inner border-2 border-white`}>
                  {review.name[0]}
                </div>
                <div className="ml-5">
                  <p className="font-bold text-gray-900 text-xl">{review.name}</p>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{review.role}</p>
                </div>
              </div>
              <div className="relative">
                 <span className="absolute -top-4 -left-3 text-6xl text-gray-200 font-serif leading-none select-none">“</span>
                 <p className="text-gray-600 font-medium italic relative z-10 leading-relaxed pl-6">
                  {review.text}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};