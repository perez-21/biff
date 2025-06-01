import { create } from "zustand";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  addMessage: (
    conversationId: string,
    message: Omit<Message, "id" | "timestamp">
  ) => void;
  createConversation: (title: string) => void;
  setCurrentConversation: (id: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  conversations: [],
  currentConversationId: null,
  isLoading: false,
  error: null,
  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  ...message,
                  id: crypto.randomUUID(),
                  timestamp: new Date(),
                },
              ],
              updatedAt: new Date(),
            }
          : conv
      ),
    })),
  createConversation: (title) =>
    set((state) => ({
      conversations: [
        ...state.conversations,
        {
          id: crypto.randomUUID(),
          title,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  setCurrentConversation: (id) => set({ currentConversationId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
