import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../services/storageService';
import { User, UserRole } from '../types';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-india-bg font-sans text-gray-800 relative selection:bg-india-saffron selection:text-white overflow-hidden">
      {/* Noise Texture Overlay */}
      <div className="bg-noise"></div>

      {/* Ambient Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-gradient-to-br from-india-saffron/20 to-orange-100/30 rounded-full blur-[120px] animate-float opacity-70"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60rem] h-[60rem] bg-gradient-to-tl from-india-green/20 to-emerald-100/30 rounded-full blur-[140px] animate-float opacity-70" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-100/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      {/* Glass Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-white/30 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group relative z-10">
              <div className="relative w-12 h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                 <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-india-saffron via-white to-india-green opacity-80 blur-[4px] group-hover:blur-[8px] transition-all"></div>
                 <div className="relative w-full h-full rounded-full bg-white/90 border-2 border-white flex items-center justify-center shadow-lg backdrop-blur-sm">
                   <div className="w-3 h-3 rounded-full bg-india-blue animate-spin-slow shadow-[0_0_10px_rgba(0,0,128,0.5)]"></div>
                 </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight leading-none text-gray-900 drop-shadow-sm">
                  Bharat<span className="text-india-saffron">Rewards</span>
                </span>
                <span className="text-[0.6rem] tracking-[0.2em] uppercase font-bold text-india-green leading-none ml-0.5 mt-0.5">Play • Earn • Grow</span>
              </div>
            </Link>

            <div className="flex items-center space-x-3 md:space-x-6 relative z-10">
              {user ? (
                <>
                  <div className="hidden md:flex items-center px-5 py-2 bg-white/40 rounded-full border border-white/60 shadow-inner backdrop-blur-md">
                    <span className="text-india-green font-black mr-2 text-xl drop-shadow-sm">{user.points.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">PTS</span>
                  </div>
                  <Link to={user.role === UserRole.ADMIN ? "/admin" : "/dashboard"} className="text-gray-700 hover:text-india-saffron font-bold text-sm md:text-base transition-colors duration-200">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-full transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transform hover:-translate-y-0.5 border border-red-400">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="text-sm bg-gradient-to-r from-india-blue to-blue-800 hover:to-blue-900 text-white font-bold px-8 py-3 rounded-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-0.5 border border-blue-400/50">
                  Login / Signup
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-14rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 glass mt-16 py-10 border-t border-white/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0 flex items-center">
             <span className="font-black text-gray-800 text-lg mr-2">BharatRewards</span> 
             <span className="text-gray-400">|</span> 
             <span className="ml-2">&copy; {new Date().getFullYear()} Made with 🧡🤍💚 for India.</span>
          </div>
          <div className="flex space-x-8 font-medium">
             <Link to="/contact" className="hover:text-india-blue transition-colors hover:underline">Contact</Link>
             <Link to="/faq" className="hover:text-india-blue transition-colors hover:underline">FAQ</Link>
             <Link to="/terms" className="hover:text-india-blue transition-colors hover:underline">Terms</Link>
             <Link to="/privacy" className="hover:text-india-blue transition-colors hover:underline">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};