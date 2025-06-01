import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Bot, User } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
}

export function ChatMessage({ message, isLast }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3 p-4',
        isUser ? 'justify-end' : 'justify-start',
        isLast && 'pb-8'
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-primary">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn('flex max-w-[80%] flex-col gap-2', isUser && 'items-end')}>
        <Card
          className={cn(
            'px-4 py-3 text-sm',
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          )}
        >
          {message.content}
        </Card>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{isUser ? 'You' : 'Biff'}</span>
          <span>•</span>
          <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
          {!isUser && message.model && (
            <>
              <span>•</span>
              <span>{message.model}</span>
            </>
          )}
        </div>
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}