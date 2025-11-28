import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../services/storageService';
import { UserRole } from '../types';

export const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [displayedOtp, setDisplayedOtp] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const resetForm = () => {
    setError('');
    setOtpSent(false);
    setDisplayedOtp(null);
    setOtpInput('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Email and Password are required");

    const user = loginUser(email, password);
    if (!user) {
      return setError("Invalid email or password.");
    }

    if (isAdminMode && user.role !== UserRole.ADMIN) {
      return setError("Access Denied. You are not an Admin.");
    }

    // Role-based redirection
    navigate(user.role === UserRole.ADMIN ? '/admin' : '/dashboard');
  };

  const handleSignupStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) return setError("All fields are required");
    
    // Check if user already exists
    const existing = loginUser(email, password); // This is a loose check, normally would use a getByEmail
    if (existing) return setError("Account already exists. Please login.");

    // Generate OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setDisplayedOtp(code);
    setOtpSent(true);
    setError('');
  };

  const handleVerifyAndSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpInput === generatedOtp) {
      const role = isAdminMode ? UserRole.ADMIN : UserRole.USER;
      const newUser = registerUser(name, email, password, role);
      navigate(role === UserRole.ADMIN ? '/admin' : '/dashboard');
    } else {
      setError("Invalid OTP. Try again.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto relative">
        {/* Decorative Elements */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-r from-india-saffron to-orange-400 rounded-full blur-3xl opacity-40 animate-pulse-slow"></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-r from-india-green to-emerald-400 rounded-full blur-3xl opacity-40 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="glass-card p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative z-10 border border-white/80">
          <div className="text-center mb-6">
             <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-white to-gray-50 rounded-2xl flex items-center justify-center shadow-lg mb-4 border border-white/60">
                <span className="text-3xl animate-bounce">{isAdminMode ? '🛡️' : '🇮🇳'}</span>
             </div>
             <h2 className="text-3xl font-black text-gray-800 tracking-tight">
               {isLogin ? 'Welcome Back' : 'Join BharatRewards'}
             </h2>
             <p className="text-gray-500 mt-2 text-sm font-medium">
               {isAdminMode ? 'Admin Portal Access' : 'Play, Learn & Earn'}
             </p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-gray-100/80 p-1.5 rounded-xl mb-6 relative">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${isAdminMode ? 'left-[calc(50%+3px)]' : 'left-1.5'}`}></div>
            <button 
              type="button"
              onClick={() => setIsAdminMode(false)}
              className={`flex-1 relative z-10 py-2 text-sm font-bold text-center transition-colors ${!isAdminMode ? 'text-gray-800' : 'text-gray-500'}`}
            >
              User
            </button>
            <button 
              type="button"
              onClick={() => setIsAdminMode(true)}
              className={`flex-1 relative z-10 py-2 text-sm font-bold text-center transition-colors ${isAdminMode ? 'text-india-blue' : 'text-gray-500'}`}
            >
              Admin
            </button>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm flex items-center shadow-sm animate-shake">
              <span className="mr-2 text-lg">⚠️</span> {error}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={isLogin ? handleLogin : handleSignupStart} className="space-y-4">
               {!isLogin && (
                <div>
                  <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="glass-input w-full px-5 py-4 rounded-2xl text-gray-700 font-medium placeholder-gray-400 focus:outline-none transition-all"
                    placeholder="e.g. Rahul Kumar"
                    required
                  />
                </div>
              )}
              
              <div>
                <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input w-full px-5 py-4 rounded-2xl text-gray-700 font-medium placeholder-gray-400 focus:outline-none transition-all"
                  placeholder={isAdminMode ? "admin@bharatrewards.com" : "name@example.com"}
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glass-input w-full px-5 py-4 rounded-2xl text-gray-700 font-medium placeholder-gray-400 focus:outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" className={`w-full text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 text-lg ${
                isAdminMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-900 shadow-gray-500/20 hover:shadow-gray-500/40' 
                  : 'bg-gradient-to-r from-india-saffron to-orange-600 shadow-orange-500/20 hover:shadow-orange-500/40'
              }`}>
                {isLogin ? (isAdminMode ? 'Login as Admin' : 'Login Securely') : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndSignup} className="space-y-6 animate-fade-in-up">
               {displayedOtp && (
                 <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-4 text-center mb-6 shadow-inner">
                   <p className="text-xs text-yellow-800 font-bold uppercase tracking-widest mb-1">Your Verification Code</p>
                   <p className="text-4xl font-mono font-black text-gray-800 tracking-[0.5em] pl-4">{displayedOtp}</p>
                   <p className="text-[10px] text-gray-500 mt-2">Enter this code below to verify email</p>
                 </div>
               )}

               <div>
                <input
                  type="text"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="glass-input w-full px-4 py-4 rounded-2xl text-center text-3xl font-mono tracking-[1em] focus:outline-none transition-all"
                  maxLength={4}
                  placeholder="0000"
                  autoFocus
                  required
                />
              </div>
               <button type="submit" className="w-full bg-gradient-to-r from-india-green to-emerald-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all transform hover:-translate-y-1 active:scale-95 text-lg">
                Verify & Register
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                resetForm();
              }} 
              className="text-gray-500 hover:text-india-blue text-sm font-semibold transition-colors hover:underline underline-offset-4 decoration-india-saffron"
            >
              {isLogin ? "New here? Create an account" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};