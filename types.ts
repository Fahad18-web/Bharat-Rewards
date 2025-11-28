export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  password?: string; // Added for persistent login
  name: string;
  role: UserRole;
  points: number;
  walletBalance: number; 
  solvedCount: number;
}

export interface Question {
  id: string;
  type: 'MATH' | 'QUIZ' | 'PUZZLE' | 'TYPING';
  questionText: string;
  options?: string[];
  correctAnswer: string;
}

export interface RedeemRequest {
  id: string;
  userId: string;
  userEmail: string;
  amountPoints: number;
  amountRupees: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface GameSession {
  score: number;
  correctAnswers: number;
  totalAttempted: number;
}

export interface AppSettings {
  minRedeemPoints: number;
  pointsPerQuestion: number;
  currencyRate: number; // INR value per 10,000 points
}