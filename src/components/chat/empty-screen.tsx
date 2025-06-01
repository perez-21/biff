import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, BookOpen, Code, Database, Network, Puzzle } from 'lucide-react';

interface EmptyScreenProps {
  onNewChat?: () => void;
}

export function EmptyScreen({ onNewChat }: EmptyScreenProps) {
  const examples = [
    {
      title: "Explain algorithms and data structures",
      prompt: "What's the difference between a queue and a stack?",
      icon: Puzzle,
    },
    {
      title: "Help with programming concepts",
      prompt: "How does object-oriented programming work?",
      icon: Code,
    },
    {
      title: "Explain computer science topics",
      prompt: "Explain how binary search works with an example",
      icon: BookOpen,
    },
    {
      title: "Database concepts",
      prompt: "What's the difference between SQL and NoSQL databases?",
      icon: Database,
    },
    {
      title: "Networking fundamentals",
      prompt: "Explain how TCP/IP works in simple terms",
      icon: Network,
    },
  ];

  return (
    <div className="flex h-full flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome to Biff
        </h1>
        
        <p className="mt-2 text-muted-foreground">
          Your AI assistant for computer science learning. Ask me anything about
          programming, algorithms, data structures, and more.
        </p>
        
        <div className="mt-8">
          <h2 className="text-sm font-medium">Try asking</h2>
          
          <div className="mt-4 flex flex-col gap-2">
            {examples.map((example, i) => (
              <Button
                key={i}
                variant="outline"
                className="justify-start"
                onClick={() => {
                  document.querySelector<HTMLTextAreaElement>(
                    'textarea'
                  )!.value = example.prompt;
                  document.querySelector<HTMLTextAreaElement>(
                    'textarea'
                  )!.focus();
                }}
              >
                <example.icon className="mr-2 h-4 w-4" />
                {example.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}