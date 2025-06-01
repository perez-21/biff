import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  PlusCircle, 
  Settings, 
  User, 
  CreditCard, 
  LogOut,
  Sparkles,
  Bot
} from 'lucide-react';
import { useAuth } from '@/lib/providers';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Chat } from '@/types';

interface SidebarProps {
  chats: Chat[];
  isCollapsed?: boolean;
  onNewChat: () => void;
}

export function Sidebar({ chats, isCollapsed = false, onNewChat }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const mainNavItems = [
    {
      title: 'New Chat',
      icon: PlusCircle,
      onClick: onNewChat,
      variant: 'default' as const,
    },
    {
      title: 'Chats',
      icon: MessageSquare,
      href: '/chats',
      variant: 'ghost' as const,
    },
    {
      title: 'Models',
      icon: Sparkles,
      href: '/models',
      variant: 'ghost' as const,
    },
    {
      title: 'Profile',
      icon: User,
      href: '/profile',
      variant: 'ghost' as const,
    },
    {
      title: 'Billing',
      icon: CreditCard,
      href: '/billing',
      variant: 'ghost' as const,
    },
    {
      title: 'Settings',
      icon: Settings,
      href: '/settings',
      variant: 'ghost' as const,
    },
  ];

  return (
    <div
      className={cn(
        'flex h-screen flex-col border-r bg-background transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {!isCollapsed ? (
          <Link to="/\" className="flex items-center gap-2 font-semibold">
            <Bot className="h-6 w-6 text-primary" />
            <span className="text-xl">Biff</span>
          </Link>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/" className="flex items-center justify-center w-full">
                  <Bot className="h-6 w-6 text-primary" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Biff</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      
      <div className="flex flex-col gap-2 p-4">
        {mainNavItems.map((item) => (
          item.href ? (
            <TooltipProvider key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={item.href}>
                    <Button
                      variant={location.pathname === item.href ? 'default' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        isCollapsed && 'justify-center px-0'
                      )}
                    >
                      <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-2')} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={item.variant}
                    className={cn(
                      'w-full justify-start',
                      isCollapsed && 'justify-center px-0'
                    )}
                    onClick={item.onClick}
                  >
                    <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-2')} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Button>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          )
        ))}
      </div>
      
      {!isCollapsed && user && !user.isSubscribed && (
        <div className="px-4 my-2">
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="font-medium">Free Plan</div>
            <div className="mt-1 text-muted-foreground">
              {user.promptsRemaining} prompts remaining today
            </div>
            <Link to="/billing">
              <Button size="sm" className="mt-2 w-full">
                Upgrade
              </Button>
            </Link>
          </div>
        </div>
      )}
      
      <ScrollArea className="flex-1 px-4">
        {!isCollapsed && (
          <div className="py-2">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Recent Chats
            </h2>
            <div className="space-y-1">
              {chats.map((chat) => (
                <Link key={chat.id} to={`/chat/${chat.id}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span className="truncate">{chat.title}</span>
                  </Button>
                </Link>
              ))}
              {chats.length === 0 && (
                <p className="text-sm text-muted-foreground px-2">
                  No recent chats
                </p>
              )}
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="mt-auto p-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="flex flex-1 items-center gap-3 overflow-hidden">
                  <div className="rounded-full bg-primary/10 p-1">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => logout()}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full h-10"
                  onClick={() => logout()}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}