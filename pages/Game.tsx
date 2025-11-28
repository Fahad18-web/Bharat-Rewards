import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuestions } from '../services/geminiService';
import { getCurrentUser, saveUser, getSettings } from '../services/storageService';
import { Question, User } from '../types';
import { AdUnit } from '../components/AdUnit';

const TIMER_SECONDS = 15;
const PREFETCH_THRESHOLD = 3; 

export const Game: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [pointsPerQ, setPointsPerQ] = useState(10);

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Refs for state access inside intervals/async
  const isFetchingRef = useRef(false);
  const questionsRef = useRef(questions);
  const currentIndexRef = useRef(currentIndex);
  
  useEffect(() => { questionsRef.current = questions; }, [questions]);
  useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);

  // Check Auth & Settings
  useEffect(() => {
    const u = getCurrentUser();
    if (!u) {
      navigate('/auth');
      return;
    }
    setUser(u);
    const settings = getSettings();
    setPointsPerQ(settings.pointsPerQuestion);
  }, [navigate]);

  // Initial Game Start
  useEffect(() => {
    if (category) {
      startGame();
    }
  }, [category]);

  const fetchBatch = async (count: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    try {
      const newQs = await fetchQuestions(category as any, count);
      setQuestions(prev => [...prev, ...newQs]);
    } catch (e) {
      console.error("Failed to fetch questions", e);
    } finally {
      isFetchingRef.current = false;
    }
  };

  const startGame = async () => {
    setInitialLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    
    // 1. Fast load: Fetch only 3 questions initially to show UI ASAP
    await fetchBatch(3); 
    setInitialLoading(false);
    setTimeLeft(TIMER_SECONDS);

    // 2. Background load: Immediately fetch more to build buffer
    fetchBatch(5);
  };

  const handleNext = useCallback((awardedPoints: number = 0) => {
    if (user) {
      const updatedUser = { ...user };
      updatedUser.points += awardedPoints;
      if (awardedPoints > 0) updatedUser.solvedCount += 1;
      saveUser(updatedUser);
      setUser(updatedUser);
      setScore(s => s + awardedPoints);
    }

    const nextIndex = currentIndexRef.current + 1;
    
    // Check if we need to prefetch more questions
    const remainingQuestions = questionsRef.current.length - nextIndex;
    if (remainingQuestions <= PREFETCH_THRESHOLD) {
      fetchBatch(5); // Fetch 5 more in background
    }

    setCurrentIndex(nextIndex);
    setTimeLeft(TIMER_SECONDS);
    setUserAnswer('');
  }, [user]);

  // Timer Logic
  useEffect(() => {
    if (initialLoading) return;
    
    // If we ran out of questions (user caught up to fetcher), wait
    if (!questions[currentIndex]) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext(0); // Timeout
          return TIMER_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialLoading, currentIndex, questions, handleNext]);

  const submitAnswer = (e?: React.FormEvent) => {
    e?.preventDefault();
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    
    let isCorrect = false;
    if (currentQ.type === 'TYPING') {
        isCorrect = userAnswer === currentQ.correctAnswer;
    } else {
        isCorrect = userAnswer.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();
    }

    if (isCorrect) {
      handleNext(pointsPerQ);
    } else {
      handleNext(0);
    }
  };

  // ---------------- RENDER ----------------

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-up">
        <div className="relative w-28 h-28 mb-8">
           <div className="absolute inset-0 border-8 border-gray-100 rounded-full"></div>
           <div className="absolute inset-0 border-8 border-t-india-saffron border-r-transparent border-b-india-green border-l-transparent rounded-full animate-spin"></div>
           <div className="absolute inset-0 flex items-center justify-center text-4xl">🚀</div>
        </div>
        <h2 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">Starting Engine</h2>
        <p className="text-gray-500 font-medium">Preparing your challenge...</p>
      </div>
    );
  }

  // If user catches up to the fetcher, show a mini loader
  const currentQ = questions[currentIndex];
  if (!currentQ) {
     return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
        <div className="w-16 h-16 border-4 border-india-blue border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">Loading more questions...</p>
      </div>
     );
  }

  const progressPercent = ((TIMER_SECONDS - timeLeft) / TIMER_SECONDS) * 100;

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10 glass px-8 py-5 rounded-[2rem]">
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-india-saffron to-orange-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg mr-5 border border-white/20">
            {category === 'MATH' ? '➗' : category === 'QUIZ' ? '💡' : category === 'PUZZLE' ? '🧩' : '⌨️'}
          </div>
          <div>
            <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Category</h2>
            <p className="font-bold text-2xl text-gray-800 leading-none">{category === 'MATH' ? 'Math' : category === 'QUIZ' ? 'Quiz' : category === 'PUZZLE' ? 'Puzzle' : 'Typing'}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-8">
           <div className="text-right hidden sm:block">
             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Session Score</span>
             <span className="font-black text-3xl text-india-green">+{score}</span>
           </div>
           
           <div className="relative w-16 h-16 flex items-center justify-center">
             <svg className="absolute w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="#f3f4f6" strokeWidth="6" fill="transparent" />
                <circle cx="32" cy="32" r="28" stroke={timeLeft < 5 ? '#ef4444' : '#000080'} strokeWidth="6" fill="transparent" strokeDasharray="175.93" strokeDashoffset={175.93 * (progressPercent / 100)} className="transition-all duration-1000 linear" strokeLinecap="round" />
             </svg>
             <span className={`font-black text-xl ${timeLeft < 5 ? 'text-red-500' : 'text-gray-800'}`}>{timeLeft}</span>
           </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card p-10 md:p-14 rounded-[3rem] shadow-2xl min-h-[450px] flex flex-col relative overflow-hidden bg-white/60 animate-fade-in-up">
        {/* Background decorative number */}
        <div className="absolute -top-10 -right-4 text-[12rem] font-black text-gray-900 opacity-[0.03] select-none pointer-events-none transition-all">
          {currentIndex + 1}
        </div>

        <div className="mb-10 select-none no-select flex-grow" onCopy={(e) => e.preventDefault()}>
          <div className="inline-block px-4 py-1.5 bg-gray-100/80 backdrop-blur rounded-full text-xs font-black text-gray-500 mb-6 uppercase tracking-wider border border-gray-200">
            Question {currentIndex + 1}
          </div>
          <h3 className="text-3xl md:text-5xl font-black text-gray-800 leading-tight">
            {currentQ.questionText}
          </h3>
        </div>

        <div className="mt-auto">
          {currentQ.options ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setUserAnswer(opt);
                    // Minimal delay to show selection click effect before moving on
                    setTimeout(() => {
                        if (opt.toLowerCase() === currentQ.correctAnswer.toLowerCase()) handleNext(pointsPerQ);
                        else handleNext(0);
                    }, 100);
                  }}
                  className="group relative bg-white/80 hover:bg-white border-2 border-white/50 hover:border-india-saffron p-6 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]"
                >
                  <div className="flex items-center">
                     <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-india-saffron group-hover:text-white flex items-center justify-center font-bold text-base text-gray-500 transition-colors mr-4 shadow-inner">
                       {String.fromCharCode(65 + idx)}
                     </div>
                     <span className="font-bold text-gray-700 group-hover:text-gray-900 text-lg md:text-xl">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={submitAnswer} className="relative">
              {currentQ.type === 'TYPING' ? (
                <div>
                   <div className="mb-3 text-xs text-gray-500 font-bold uppercase tracking-wider">Type the text above exactly:</div>
                   <textarea
                      rows={4}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-full p-6 text-xl border-2 border-gray-200 rounded-3xl focus:border-india-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all resize-none shadow-inner bg-gray-50/50 focus:bg-white"
                      placeholder="Start typing here..."
                      onPaste={(e) => { e.preventDefault(); alert("Cheating not allowed! Type it out."); }}
                      autoFocus
                  />
                </div>
              ) : (
                <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-6 text-2xl font-bold border-2 border-gray-200 rounded-3xl focus:border-india-blue focus:ring-4 focus:ring-blue-50 outline-none transition-all shadow-inner bg-gray-50/50 focus:bg-white"
                    placeholder="Type your answer..."
                    autoFocus
                />
              )}
              
              <button 
                type="submit" 
                className="mt-8 w-full bg-gradient-to-r from-india-blue to-blue-800 hover:to-blue-900 text-white font-bold py-5 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all transform hover:-translate-y-1 active:scale-[0.99] text-xl"
              >
                Submit Answer
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="mt-12">
        <AdUnit />
      </div>
    </div>
  );
};