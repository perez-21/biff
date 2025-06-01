import React, { useState, useRef, useEffect } from 'react';
import { useModel, useAuth } from '@/lib/providers';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Send, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { model, setModel, models } = useModel();
  const { user } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message);
    setMessage('');
    
    // Refocus the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [message]);

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex gap-2 items-end p-4 max-w-3xl mx-auto">
        <div className="flex-1 overflow-hidden rounded-lg border bg-background shadow-sm">
          <div className="flex flex-col">
            <Textarea
              ref={textareaRef}
              placeholder="Ask Biff anything about computer science..."
              className="min-h-[60px] max-h-[200px] border-0 focus-visible:ring-0 resize-none p-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between p-3 pt-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
                <Select 
                  value={model} 
                  onValueChange={(value) => setModel(value as any)}
                >
                  <SelectTrigger className="border-0 p-0 h-auto w-auto font-medium text-xs text-muted-foreground hover:text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {user && !user.isSubscribed && (
                <p className="text-xs text-muted-foreground">
                  {user.promptsRemaining} prompts remaining today
                </p>
              )}
            </div>
          </div>
        </div>
        
        <Button 
          type="submit" 
          size="icon" 
          className={cn(
            "h-[60px] w-[60px] rounded-full shrink-0",
            isLoading && "opacity-70 cursor-not-allowed"
          )}
          disabled={isLoading || !message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}