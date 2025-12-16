"use client";

import { useState, useEffect, useCallback } from "react";
import { generateSessionId } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UseChatOptions {
  endpoint: string;
  initialMessages?: ChatMessage[];
}

export function useChat({ endpoint, initialMessages = [] }: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Generate session ID on client side
    const storedSessionId = sessionStorage.getItem(`chat-session-${endpoint}`);
    if (storedSessionId) {
      setSessionId(storedSessionId);
      loadChatHistory(storedSessionId);
    } else {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      sessionStorage.setItem(`chat-session-${endpoint}`, newSessionId);
    }
  }, [endpoint]);

  const loadChatHistory = async (sid: string) => {
    try {
      const response = await fetch(`${endpoint}?sessionId=${sid}`);
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result.length > 0) {
          const history: ChatMessage[] = data.result.flatMap(
            (chat: {
              id: string;
              userMessage: string;
              botResponse: string;
              createdAt: string;
            }) => [
              {
                id: `${chat.id}-user`,
                role: "user" as const,
                content: chat.userMessage,
                timestamp: new Date(chat.createdAt),
              },
              {
                id: `${chat.id}-assistant`,
                role: "assistant" as const,
                content: chat.botResponse,
                timestamp: new Date(chat.createdAt),
              },
            ]
          );
          setMessages(history);
        }
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId,
            userMessage: content.trim(),
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to send message");
        }

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.result.botResponse,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        // Remove the user message if there was an error
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, sessionId, isLoading]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    sessionStorage.setItem(`chat-session-${endpoint}`, newSessionId);
  }, [endpoint]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    sessionId,
  };
}
