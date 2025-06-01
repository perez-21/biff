import React, { useEffect, useRef, useState } from 'react';
import { ChatInput } from './chat-input';
import { ChatMessage } from './chat-message';
import { EmptyScreen } from './empty-screen';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/types';
import { useModel, useAuth } from '@/lib/providers';
import { Loader2 } from 'lucide-react';

interface ChatContainerProps {
  chatId?: string;
  initialMessages?: Message[];
  onNewChat?: () => void;
}

export function ChatContainer({
  chatId,
  initialMessages = [],
  onNewChat,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { model } = useModel();
  const { user } = useAuth();
  
  // Mock responses based on topics
  const mockResponses: Record<string, string> = {
    'algorithm': 'Algorithms are step-by-step procedures for solving problems. The most common algorithms include sorting (quicksort, mergesort), searching (binary search), and graph algorithms (Dijkstra\'s, BFS, DFS). Time complexity is typically expressed using Big O notation.',
    'data structure': 'Data structures are ways of organizing and storing data. Common data structures include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Each has specific use cases and performance characteristics.',
    'javascript': 'JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It\'s multi-paradigm, supporting event-driven, functional, and imperative programming styles.',
    'python': 'Python is a high-level, interpreted programming language known for its readability and simplicity. It supports multiple programming paradigms and has a comprehensive standard library.',
    'database': 'Databases store and organize data. SQL databases (like MySQL, PostgreSQL) use structured tables with predefined schemas, while NoSQL databases (like MongoDB) offer more flexibility with document, key-value, or graph models.',
    'networking': 'Computer networking involves the practice of connecting computers to share resources and communicate. Key concepts include TCP/IP, DNS, HTTP, and network topologies.',
    'machine learning': 'Machine learning is a subset of AI focused on building systems that learn from data. Key concepts include supervised learning, unsupervised learning, neural networks, and model evaluation metrics.',
    'operating system': 'Operating systems manage computer hardware and software resources. They provide services like process management, memory management, file systems, and user interfaces.',
    'computer': 'Computers process data according to instructions. Key components include the CPU (processes instructions), RAM (temporary storage), storage devices, and input/output devices.',
    'programming': 'Programming is the process of creating instructions for computers to follow. It involves designing algorithms, writing code, debugging, and maintaining software.',
  };

  // Helper function to find relevant response
  const getRelevantResponse = (query: string): string => {
    query = query.toLowerCase();
    
    for (const [keyword, response] of Object.entries(mockResponses)) {
      if (query.includes(keyword)) {
        return response;
      }
    }
    
    return "I'm Biff, your AI assistant for computer science learning. I can help with algorithms, data structures, programming languages, and more. What would you like to learn about today?";
  };

  const handleSendMessage = async (content: string) => {
    if (user && !user.isSubscribed && user.promptsRemaining <= 0) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily limit of 10 prompts. Upgrade to continue chatting.",
        variant: "destructive",
      });
      return;
    }
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      model,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Create AI response
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getRelevantResponse(content),
          timestamp: new Date().toISOString(),
          model,
        };
        
        setMessages((prev) => [...prev, aiMessage]);
        
        // Decrease remaining prompts for free users
        if (user && !user.isSubscribed) {
          // This would be handled by the backend in a real app
          user.promptsRemaining -= 1;
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      {messages.length === 0 ? (
        <EmptyScreen onNewChat={onNewChat} />
      ) : (
        <ScrollArea 
          ref={scrollAreaRef} 
          className="flex-1 overflow-y-auto"
        >
          <div className="flex flex-col pb-20">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}
            
            {isLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            )}
          </div>
        </ScrollArea>
      )}
      
      <div className="border-t">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
}