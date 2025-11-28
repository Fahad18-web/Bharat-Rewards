import { User, UserRole, RedeemRequest, AppSettings, Question } from '../types';

const USERS_KEY = 'bharatrewards_users';
const SESSION_KEY = 'bharatrewards_session';
const REDEEM_KEY = 'bharatrewards_redeems';
const SETTINGS_KEY = 'bharatrewards_settings';
const CUSTOM_QUESTIONS_KEY = 'bharatrewards_custom_questions';

// Defaults
const DEFAULT_SETTINGS: AppSettings = {
  minRedeemPoints: 14000,
  pointsPerQuestion: 10,
  currencyRate: 35
};

// Initialize Admin and Settings if not exists
const initStorage = () => {
  const users = getUsers();
  if (!users.find(u => u.email === 'admin@bharatrewards.com')) {
    const admin: User = {
      id: 'admin-1',
      email: 'admin@bharatrewards.com',
      password: 'admin', // Default password
      name: 'Super Admin',
      role: UserRole.ADMIN,
      points: 0,
      walletBalance: 0,
      solvedCount: 0
    };
    users.push(admin);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  if (!localStorage.getItem(SETTINGS_KEY)) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  }
};

// --- Users ---

export const getUsers = (): User[] => {
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUser = (user: User) => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  // Update session if it's the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.id === user.id) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
};

export const loginUser = (email: string, password?: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user) {
    // Simple password check
    if (user.password && user.password !== password) {
      return null;
    }
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const registerUser = (name: string, email: string, password?: string, role: UserRole = UserRole.USER): User => {
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role,
    points: 0,
    walletBalance: 0,
    solvedCount: 0
  };
  saveUser(newUser);
  return newUser;
};

// --- Redeem Requests ---

export const getRedeemRequests = (): RedeemRequest[] => {
  const data = localStorage.getItem(REDEEM_KEY);
  return data ? JSON.parse(data) : [];
};

export const addRedeemRequest = (req: RedeemRequest) => {
  const reqs = getRedeemRequests();
  reqs.push(req);
  localStorage.setItem(REDEEM_KEY, JSON.stringify(reqs));
};

export const updateRedeemRequest = (id: string, status: 'APPROVED' | 'REJECTED') => {
  const reqs = getRedeemRequests();
  const index = reqs.findIndex(r => r.id === id);
  if (index >= 0) {
    reqs[index].status = status;
    localStorage.setItem(REDEEM_KEY, JSON.stringify(reqs));
  }
};

// --- Settings ---

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// --- Custom Questions ---

export const getCustomQuestions = (category?: string): Question[] => {
  const data = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
  const allQuestions: Question[] = data ? JSON.parse(data) : [];
  if (category) {
    return allQuestions.filter(q => q.type === category);
  }
  return allQuestions;
};

export const addCustomQuestion = (question: Question) => {
  const questions = getCustomQuestions();
  questions.push(question);
  localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(questions));
};

export const deleteCustomQuestion = (id: string) => {
  const questions = getCustomQuestions();
  const filtered = questions.filter(q => q.id !== id);
  localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(filtered));
};

// Run init
initStorage();