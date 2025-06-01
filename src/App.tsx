import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider as ShadcnThemeProvider } from '@/components/ui/theme-provider';
import { Providers } from '@/lib/providers';
import { AuthPage } from '@/pages/auth-page';
import { ChatPage } from '@/pages/chat-page';
import { BillingPage } from '@/pages/billing-page';
import { ModelsPage } from '@/pages/models-page';
import { Loader2 } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading Biff...</p>
        </div>
      </div>
    );
  }

  return (
    <ShadcnThemeProvider defaultTheme="system" storageKey="biff-theme">
      <Providers>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/chat\" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/chat/:chatId" element={<ChatPage />} />
            <Route path="/billing" element={<BillingPage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="*" element={<Navigate to="/chat\" replace />} />
          </Routes>
          <Toaster />
        </Router>
      </Providers>
    </ShadcnThemeProvider>
  );
}

export default App;