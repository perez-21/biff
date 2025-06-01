// User types
export interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  promptsRemaining: number;
  createdAt: string;
}

// Chat types
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

// Subscription types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular?: boolean;
}

// AI Model types
export type AIModelType = 'gpt-4' | 'claude' | 'gemini' | 'mistral';

export interface AIModel {
  id: AIModelType;
  name: string;
  description: string;
  avatar?: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}