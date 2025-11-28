import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";
import { getCustomQuestions } from "./storageService";

// NOTE: In a real app, never expose keys on client. This is for demo purposes as requested.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchQuestions = async (category: 'MATH' | 'QUIZ' | 'PUZZLE' | 'TYPING', count: number = 5): Promise<Question[]> => {
  // 1. First, try to get custom questions from Admin
  const customQuestions = getCustomQuestions(category);
  
  // Shuffle custom questions to give variety
  const shuffledCustom = customQuestions.sort(() => 0.5 - Math.random());
  
  // Take up to 'count' from custom questions (e.g., if we have 2 custom, take 2. If we have 10, take 5).
  // For better UX, let's take a mix if possible, or just prioritize custom.
  // Strategy: Fill as much as possible with custom, then fill rest with AI.
  const questionsToReturn: Question[] = shuffledCustom.slice(0, count);
  
  const remainingCount = count - questionsToReturn.length;

  if (remainingCount <= 0) {
    return questionsToReturn;
  }

  // 2. Fetch remaining from Gemini
  if (!process.env.API_KEY) {
    console.warn("No API Key provided. Using fallback questions.");
    return [...questionsToReturn, ...getFallbackQuestions(category).slice(0, remainingCount)];
  }

  try {
    let prompt = "";
    // Optimized prompts for speed - asking for minimal necessary context
    if (category === 'MATH') {
      prompt = `Generate ${remainingCount} math problems. JSON: [{"questionText": "5+5", "correctAnswer": "10"}]`;
    } else if (category === 'QUIZ') {
      prompt = `Generate ${remainingCount} Indian trivia questions. JSON: [{"questionText": "Q?", "options": ["A","B","C","D"], "correctAnswer": "A"}]`;
    } else if (category === 'PUZZLE') {
      prompt = `Generate ${remainingCount} riddles. JSON: [{"questionText": "Riddle?", "correctAnswer": "Ans"}]`;
    } else if (category === 'TYPING') {
      prompt = `Generate ${remainingCount} short facts about India. JSON: [{"questionText": "Fact.", "correctAnswer": "Fact."}]`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              questionText: { type: Type.STRING },
              correctAnswer: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    const generatedQuestions = data.map((q: any, idx: number) => ({
      id: `${category}-${Date.now()}-${idx}-${Math.random()}`,
      type: category,
      questionText: q.questionText,
      correctAnswer: q.correctAnswer,
      options: q.options
    }));

    return [...questionsToReturn, ...generatedQuestions];

  } catch (error) {
    console.error("Gemini API Error:", error);
    // If API fails, return whatever custom questions we found, plus fallbacks
    return [...questionsToReturn, ...getFallbackQuestions(category).slice(0, remainingCount)];
  }
};

const getFallbackQuestions = (category: string): Question[] => {
  const timestamp = Date.now();
  if (category === 'MATH') {
    return [
      { id: `fb-${timestamp}-1`, type: 'MATH', questionText: '12 + 15 = ?', correctAnswer: '27' },
      { id: `fb-${timestamp}-2`, type: 'MATH', questionText: '10 * 5 = ?', correctAnswer: '50' },
      { id: `fb-${timestamp}-3`, type: 'MATH', questionText: '100 / 4 = ?', correctAnswer: '25' },
    ];
  }
  if (category === 'QUIZ') {
    return [
      { id: `fb-${timestamp}-1`, type: 'QUIZ', questionText: 'National Bird of India?', options: ['Peacock', 'Parrot', 'Eagle', 'Crow'], correctAnswer: 'Peacock' },
      { id: `fb-${timestamp}-2`, type: 'QUIZ', questionText: 'Currency of India?', options: ['Dollar', 'Yen', 'Rupee', 'Euro'], correctAnswer: 'Rupee' },
    ];
  }
  if (category === 'TYPING') {
    return [
      { id: `fb-${timestamp}-1`, type: 'TYPING', questionText: 'India is the seventh-largest country by area.', correctAnswer: 'India is the seventh-largest country by area.' }
    ];
  }
  return [
    { id: `fb-${timestamp}-1`, type: 'PUZZLE', questionText: 'What comes once in a minute, twice in a moment, but never in a thousand years?', correctAnswer: 'm' }
  ];
};