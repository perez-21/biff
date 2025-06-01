import React from 'react';
import { Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/sidebar';
import { Pricing } from '@/components/billing/pricing';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/lib/providers';
import { Loader2 } from 'lucide-react';

export function BillingPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const { isAuthenticated, isLoading, user } = useAuth();
  
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
          <div className="font-semibold">Billing & Subscription</div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">
                Subscription Details
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage your subscription and billing information
              </p>
            </div>
            
            <div className="grid gap-6">
              <div className="rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {user?.isSubscribed ? 'Pro Plan' : 'Free Plan'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.isSubscribed
                        ? 'Unlimited prompts with access to all models'
                        : `${user?.promptsRemaining} prompts remaining today`}
                    </p>
                  </div>
                  {!user?.isSubscribed && (
                    <Button>Upgrade Now</Button>
                  )}
                </div>
              </div>
            </div>
            
            <Pricing />
          </div>
        </main>
      </div>
    </div>
  );
}