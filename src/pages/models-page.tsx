import React from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/sidebar';
import { Button } from '@/components/ui/button';
import { Menu, Bot, CheckCircle2 } from 'lucide-react';
import { useAuth, useModel } from '@/lib/providers';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ModelsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  const { model, setModel, models } = useModel();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar
        chats={[]}
        isCollapsed={isSidebarCollapsed}
        onNewChat={() => {}}
      />
      
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="font-semibold">AI Models</div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                Choose an AI Model
              </h1>
              <p className="text-muted-foreground mt-2">
                Select the AI model that best fits your learning needs
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {models.map((m) => (
                <Card 
                  key={m.id} 
                  className={model === m.id ? 'border-primary' : ''}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      {model === m.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <CardTitle className="mt-4">{m.name}</CardTitle>
                    <CardDescription>{m.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {m.id === 'gpt-4' && 'Optimized for coding questions and detailed explanations.'}
                      {m.id === 'claude' && 'Great for long-form explanations and conceptual understanding.'}
                      {m.id === 'gemini' && 'Excellent for technical accuracy and diverse knowledge.'}
                      {m.id === 'mistral' && 'Fast responses and good at concise explanations.'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={() => setModel(m.id)}
                      variant={model === m.id ? 'default' : 'outline'}
                      className="w-full"
                      disabled={model === m.id}
                    >
                      {model === m.id ? 'Selected' : 'Select Model'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            {!user?.isSubscribed && (
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Note:</span> Free plan users have limited access to certain models. Upgrade to Pro for full access to all models.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}