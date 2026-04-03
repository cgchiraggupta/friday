import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  pendingXDR?: string | null;
  transactionHash?: string | null;
  timestamp: Date;
  isLoading?: boolean;
}

interface PersistedChatMessage extends Omit<ChatMessage, "timestamp"> {
  timestamp: string;
}

interface PersistedChatState {
  messages: PersistedChatMessage[];
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;

  addMessage: (
    message: Omit<ChatMessage, "id" | "timestamp"> & { id?: string },
  ) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  clearChat: () => void;
  removePendingXDR: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      isStreaming: false,

      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: crypto.randomUUID(),
              ...message,
              timestamp: new Date(),
            },
          ],
        })),

      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg,
          ),
        })),

      setLoading: (isLoading) => set({ isLoading }),

      setStreaming: (isStreaming) => set({ isStreaming }),

      clearChat: () => set({ messages: [] }),

      removePendingXDR: () =>
        set((state) => ({
          messages: state.messages.map((msg) => ({
            ...msg,
            pendingXDR: undefined,
          })),
        })),
    }),
    {
      name: "stellar-defi-ai-chat",
      partialize: (state) => ({
        messages: state.messages.map((msg) => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        })),
      }),
      merge: (persistedState, currentState) => {
        const typedState = persistedState as PersistedChatState | undefined;
        return {
          ...currentState,
          messages:
            typedState?.messages?.map((msg) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })) || [],
        };
      },
    },
  ),
);
