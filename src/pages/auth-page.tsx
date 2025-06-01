import React from 'react';
import { AuthForm } from '@/components/auth/auth-form';
import { useAuth } from '@/lib/providers';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export function AuthPage() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/chat" />;
  }
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
}