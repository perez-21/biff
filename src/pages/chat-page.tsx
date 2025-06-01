import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatContainer } from '@/components/chat/chat-container';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useAuth } from '@/lib/providers';
import { Loader2 } from 'lucide-react';
import { Chat } from '@/types';

// Mock chat data
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    title: 'Learning about algorithms',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Can you explain how quicksort works?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        model: 'gpt-4',
      },
      {
        id: '2',
        role: 'assistant',
        content: 'Quicksort is a divide-and-conquer algorithm. It works by selecting a "pivot" element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then recursively sorted. This process continues until the base case of an empty or single-item array is reached.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30).toISOString(),
        model: 'gpt-4',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30).toISOString(),
  },
  {
    id: '2',
    title: 'Understanding databases',
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'What\'s the difference between SQL and NoSQL?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        model: 'claude',
      },
      {
        id: '2',
        role: 'assistant',
        content: 'SQL databases are relational databases that use structured query language (SQL) for defining and manipulating data. They have predefined schemas and organized in tables with rows and columns. NoSQL databases, on the other hand, are non-relational databases designed for specific data models with flexible schemas. They\'re categorized as document-based, key-value pairs, wide-column stores, or graph databases.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 45).toISOString(),
        model: 'claude',
      },
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 + 1000 * 45).toISOString(),
  },
];

export function ChatPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const { chatId } = useParams<{ chatId: string }>();
  const { isAuthenticated, isLoading } = useAuth();
  
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };
  
  const handleNewChat = () => {
    // In a real app, this would create a new chat in the database
    const newChat: Chat = {
      id: (chats.length + 1).toString(),
      title: 'New conversation',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setChats([newChat, ...chats]);
    // Navigate to the new chat
    // In a real app with React Router, you'd use useNavigate here
    window.history.pushState({}, '', `/chat/${newChat.id}`);
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
  
  const currentChat = chatId 
    ? chats.find((chat) => chat.id === chatId)
    : undefined;
  
  return (
    <div className="flex h-screen">
      <Sidebar
        chats={chats}
        isCollapsed={isSidebarCollapsed}
        onNewChat={handleNewChat}
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
          <div className="font-semibold">
            {currentChat ? currentChat.title : 'New Chat'}
          </div>
        </header>
        
        <main className="flex-1 overflow-hidden">
          <ChatContainer 
            chatId={chatId} 
            initialMessages={currentChat?.messages || []} 
            onNewChat={handleNewChat}
          />
        </main>
      </div>
    </div>
  );
}