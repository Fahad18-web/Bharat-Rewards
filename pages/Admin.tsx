import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  getRedeemRequests, 
  getUsers, 
  updateRedeemRequest, 
  getSettings, 
  saveSettings, 
  getCustomQuestions, 
  addCustomQuestion, 
  deleteCustomQuestion 
} from '../services/storageService';
import { User, RedeemRequest, UserRole, AppSettings, Question } from '../types';

type Tab = 'DASHBOARD' | 'QUESTIONS' | 'SETTINGS';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('DASHBOARD');
  const [admin, setAdmin] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [redeems, setRedeems] = useState<RedeemRequest[]>([]);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  
  // Form States
  const [qType, setQType] = useState<'MATH' | 'QUIZ' | 'PUZZLE' | 'TYPING'>('MATH');
  const [qText, setQText] = useState('');
  const [qAnswer, setQAnswer] = useState('');
  const [qOptions, setQOptions] = useState(''); // Comma separated

  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u || u.role !== UserRole.ADMIN) {
      navigate('/');
      return;
    }
    setAdmin(u);
    refreshData();
  }, [navigate]);

  const refreshData = () => {
    setUsers(getUsers());
    setRedeems(getRedeemRequests());
    setSettings(getSettings());
    setCustomQuestions(getCustomQuestions());
  };

  const handleRedeemAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
    updateRedeemRequest(id, status);
    refreshData();
  };

  const handleSettingsSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    alert('Settings Saved Successfully!');
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newQ: Question = {
      id: `manual-${Date.now()}`,
      type: qType,
      questionText: qText,
      correctAnswer: qAnswer,
      options: qType === 'QUIZ' ? qOptions.split(',').map(s => s.trim()) : undefined
    };
    addCustomQuestion(newQ);
    setQText('');
    setQAnswer('');
    setQOptions('');
    refreshData();
    alert('Question Added!');
  };

  const handleDeleteQuestion = (id: string) => {
    if (confirm('Delete this question?')) {
      deleteCustomQuestion(id);
      refreshData();
    }
  };

  if (!admin) return null;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-center pb-8 border-b border-gray-200/50 gap-4">
         <div>
            <h1 className="text-4xl font-black text-gray-800">Admin Portal</h1>
            <p className="text-gray-500 mt-1">Full control over users, finance & content.</p>
         </div>
         
         <div className="flex bg-white/50 p-1 rounded-2xl backdrop-blur-md shadow-sm border border-white/60">
           {(['DASHBOARD', 'QUESTIONS', 'SETTINGS'] as Tab[]).map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                 activeTab === tab 
                 ? 'bg-india-blue text-white shadow-lg' 
                 : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
               }`}
             >
               {tab}
             </button>
           ))}
         </div>
      </div>

      {/* ---------------- DASHBOARD TAB ---------------- */}
      {activeTab === 'DASHBOARD' && (
        <div className="space-y-10 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-[2rem] flex items-center justify-between bg-gradient-to-br from-white/80 to-blue-50/50">
              <div>
                  <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Total Users</h3>
                  <p className="text-5xl font-black text-india-blue">{users.length}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 text-3xl shadow-inner">👥</div>
            </div>
            <div className="glass-card p-8 rounded-[2rem] flex items-center justify-between bg-gradient-to-br from-white/80 to-orange-50/50">
              <div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Pending</h3>
                <p className="text-5xl font-black text-orange-500">{redeems.filter(r => r.status === 'PENDING').length}</p>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 text-3xl shadow-inner">⏳</div>
            </div>
            <div className="glass-card p-8 rounded-[2rem] flex items-center justify-between bg-gradient-to-br from-white/80 to-green-50/50">
              <div>
                <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest mb-2">Total Paid</h3>
                <p className="text-5xl font-black text-green-600">
                  ₹ {redeems.filter(r => r.status === 'APPROVED').reduce((acc, curr) => acc + curr.amountRupees, 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 text-3xl shadow-inner">💸</div>
            </div>
          </div>

          {/* Redeem Requests Table */}
          <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/60">
            <div className="p-8 border-b border-gray-100 bg-white/40 backdrop-blur-md flex justify-between items-center">
              <h3 className="font-bold text-xl text-gray-800">Redemption Requests</h3>
              <span className="text-xs font-bold text-gray-400 uppercase bg-white/50 px-3 py-1 rounded-full">{redeems.length} Records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 text-gray-400 uppercase font-black text-[10px] tracking-wider">
                  <tr>
                    <th className="p-6">Date</th>
                    <th className="p-6">User Details</th>
                    <th className="p-6">Points</th>
                    <th className="p-6">Payout</th>
                    <th className="p-6">Status</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white/30">
                  {redeems.length === 0 ? (
                    <tr><td colSpan={6} className="p-16 text-center text-gray-400 font-medium">No requests found yet.</td></tr>
                  ) : (
                    redeems.map(req => (
                      <tr key={req.id} className="hover:bg-white/60 transition-colors group">
                        <td className="p-6 font-mono text-gray-500">{req.date}</td>
                        <td className="p-6">
                          <div className="font-bold text-gray-800 text-base">{req.userEmail}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-mono mt-1 opacity-60 group-hover:opacity-100 transition-opacity">ID: {req.userId.substring(0,8)}...</div>
                        </td>
                        <td className="p-6 font-mono font-bold text-gray-600">{req.amountPoints.toLocaleString()}</td>
                        <td className="p-6">
                            <span className="font-black text-green-600 text-lg">₹ {req.amountRupees}</span>
                        </td>
                        <td className="p-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wide border shadow-sm ${
                            req.status === 'PENDING' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                            req.status === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="p-6 text-right">
                          {req.status === 'PENDING' && (
                            <div className="flex justify-end space-x-3">
                              <button onClick={() => handleRedeemAction(req.id, 'APPROVED')} className="text-white bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-green-500/30 transform hover:-translate-y-0.5">Approve</button>
                              <button onClick={() => handleRedeemAction(req.id, 'REJECTED')} className="text-red-500 bg-white border border-red-100 hover:bg-red-50 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- SETTINGS TAB ---------------- */}
      {activeTab === 'SETTINGS' && (
        <div className="glass-card p-10 rounded-[2.5rem] animate-fade-in-up">
           <div className="flex items-center mb-8">
             <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl mr-4 shadow-sm">⚙️</div>
             <div>
               <h3 className="text-2xl font-black text-gray-800">Platform Configuration</h3>
               <p className="text-gray-500 text-sm">Manage global variables and logic.</p>
             </div>
           </div>

           <form onSubmit={handleSettingsSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
               <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Points Per Question</label>
               <input 
                 type="number" 
                 className="glass-input w-full p-4 rounded-xl text-lg font-bold"
                 value={settings.pointsPerQuestion}
                 onChange={e => setSettings({...settings, pointsPerQuestion: Number(e.target.value)})}
               />
               <p className="text-xs text-gray-400">Amount awarded for each correct answer.</p>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Minimum Redeem Points</label>
               <input 
                 type="number" 
                 className="glass-input w-full p-4 rounded-xl text-lg font-bold"
                 value={settings.minRedeemPoints}
                 onChange={e => setSettings({...settings, minRedeemPoints: Number(e.target.value)})}
               />
               <p className="text-xs text-gray-400">Threshold for users to request withdrawal.</p>
             </div>

             <div className="space-y-2">
               <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Exchange Rate (INR per 10k Pts)</label>
               <input 
                 type="number" 
                 className="glass-input w-full p-4 rounded-xl text-lg font-bold"
                 value={settings.currencyRate}
                 onChange={e => setSettings({...settings, currencyRate: Number(e.target.value)})}
               />
               <p className="text-xs text-gray-400">Value of 10,000 points in Indian Rupees.</p>
             </div>

             <div className="md:col-span-2 pt-4">
               <button type="submit" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all">Save Configuration</button>
             </div>
           </form>
        </div>
      )}

      {/* ---------------- QUESTIONS TAB ---------------- */}
      {activeTab === 'QUESTIONS' && (
        <div className="space-y-8 animate-fade-in-up">
           {/* Add Question Form */}
           <div className="glass-card p-10 rounded-[2.5rem]">
             <div className="flex items-center mb-8">
               <div className="w-12 h-12 bg-india-saffron/10 text-india-saffron rounded-full flex items-center justify-center text-2xl mr-4 border border-india-saffron/20">📝</div>
               <div>
                 <h3 className="text-2xl font-black text-gray-800">Add Custom Question</h3>
                 <p className="text-gray-500 text-sm">Manually insert questions into the game pool.</p>
               </div>
             </div>

             <form onSubmit={handleAddQuestion} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Category</label>
                     <select 
                        className="glass-input w-full p-4 rounded-xl font-bold"
                        value={qType}
                        onChange={e => setQType(e.target.value as any)}
                     >
                        <option value="MATH">Math</option>
                        <option value="QUIZ">Quiz</option>
                        <option value="PUZZLE">Puzzle</option>
                        <option value="TYPING">Typing</option>
                     </select>
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Correct Answer</label>
                     <input 
                       type="text" 
                       className="glass-input w-full p-4 rounded-xl font-medium"
                       placeholder="e.g. 42"
                       value={qAnswer}
                       onChange={e => setQAnswer(e.target.value)}
                       required
                     />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Question Text</label>
                   <textarea 
                     className="glass-input w-full p-4 rounded-xl font-medium h-32"
                     placeholder="Type your question here..."
                     value={qText}
                     onChange={e => setQText(e.target.value)}
                     required
                   />
                </div>

                {qType === 'QUIZ' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Options (Comma Separated)</label>
                    <input 
                      type="text" 
                      className="glass-input w-full p-4 rounded-xl font-medium"
                      placeholder="Option A, Option B, Option C, Option D"
                      value={qOptions}
                      onChange={e => setQOptions(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-400">Ensure the correct answer is exactly one of these options.</p>
                  </div>
                )}

                <button type="submit" className="w-full bg-gradient-to-r from-india-saffron to-orange-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/30 transition-all">
                  Add to Question Bank
                </button>
             </form>
           </div>

           {/* Questions List */}
           <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-xl border border-white/60">
             <div className="p-8 border-b border-gray-100 bg-white/40 backdrop-blur-md">
                <h3 className="font-bold text-xl text-gray-800">Custom Questions Library ({customQuestions.length})</h3>
             </div>
             <div className="max-h-[500px] overflow-y-auto">
               <table className="w-full text-left text-sm">
                 <thead className="bg-gray-50/50 text-gray-400 uppercase font-black text-[10px] tracking-wider sticky top-0 backdrop-blur-md">
                   <tr>
                     <th className="p-6">Type</th>
                     <th className="p-6 w-1/2">Question</th>
                     <th className="p-6">Answer</th>
                     <th className="p-6 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 bg-white/30">
                    {customQuestions.map(q => (
                      <tr key={q.id} className="hover:bg-white/60">
                         <td className="p-6">
                           <span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold uppercase">{q.type}</span>
                         </td>
                         <td className="p-6 text-gray-800 font-medium">{q.questionText}</td>
                         <td className="p-6 text-green-700 font-bold">{q.correctAnswer}</td>
                         <td className="p-6 text-right">
                           <button onClick={() => handleDeleteQuestion(q.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">🗑️</button>
                         </td>
                      </tr>
                    ))}
                    {customQuestions.length === 0 && (
                      <tr><td colSpan={4} className="p-10 text-center text-gray-400">No custom questions added yet.</td></tr>
                    )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};