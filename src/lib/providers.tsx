import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types
type Theme = 'dark' | 'light' | 'system';
type AIModel = 'gpt-4' | 'claude' | 'gemini' | 'mistral';

interface User {
  id: string;
  name: string;
  email: string;
  isSubscribed: boolean;
  promptsRemaining: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

interface ModelContextType {
  model: AIModel;
  setModel: (model: AIModel) => void;
  models: {
    id: AIModel;
    name: string;
    description: string;
  }[];
}

// Create contexts
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
const ModelContext = createContext<ModelContextType | undefined>(undefined);

// Provider components
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Mock user for development
  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setUser({
        id: '1',
        name: 'Demo User',
        email: 'demo@example.com',
        isSubscribed: false,
        promptsRemaining: 10,
      });
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login for now - would be replaced with actual API call
      // await api.post('/auth/login', { email, password });
      
      setUser({
        id: '1',
        name: 'Demo User',
        email,
        isSubscribed: false,
        promptsRemaining: 10,
      });
      
      toast({
        title: 'Logged in successfully',
        description: 'Welcome back to Biff!',
      });
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock signup for now - would be replaced with actual API call
      // await api.post('/auth/signup', { name, email, password });
      
      setUser({
        id: '1',
        name,
        email,
        isSubscribed: false,
        promptsRemaining: 10,
      });
      
      toast({
        title: 'Account created',
        description: 'Welcome to Biff!',
      });
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: 'Please try again with a different email',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // Mock logout - would be replaced with actual API call
    // await api.post('/auth/logout');
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been logged out successfully',
    });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [model, setModel] = useState<AIModel>('gpt-4');
  const models = [
    { id: 'gpt-4', name: 'GPT-4', description: 'OpenAI\'s most powerful model' },
    { id: 'claude', name: 'Claude', description: 'Anthropic\'s assistant model' },
    { id: 'gemini', name: 'Gemini', description: 'Google\'s advanced AI model' },
    { id: 'mistral', name: 'Mistral', description: 'Open-source AI model' },
  ];

  return (
    <ModelContext.Provider value={{ model, setModel, models }}>
      {children}
    </ModelContext.Provider>
  );
}

// Custom hooks
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
};

// Combined provider for convenience
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ModelProvider>
          {children}
        </ModelProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}