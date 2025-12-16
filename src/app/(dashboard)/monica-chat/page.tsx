"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@/hooks/useChat";
import { Button, Input, Card } from "@/components/ui";
import { MdSend, MdRefresh, MdPerson } from "react-icons/md";
import { cn } from "@/lib/utils";

export default function MonicaChatPage() {
  const { messages, isLoading, error, sendMessage, clearChat } = useChat({
    endpoint: "/api/ai/monica-chat",
  });
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput("");
    await sendMessage(message);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-color1 rounded-full flex items-center justify-center">
              <MdPerson className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-color3">Monica AI</h1>
              <p className="text-sm text-gray-500">
                Your AI Teaching Assistant
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearChat}
            className="flex items-center gap-2"
          >
            <MdRefresh size={18} />
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-color1/10 rounded-full flex items-center justify-center mb-4">
              <MdPerson className="w-10 h-10 text-color1" />
            </div>
            <h2 className="text-xl font-bold text-color3 mb-2">
              Hi! I&apos;m Monica
            </h2>
            <p className="text-gray-500 max-w-md">
              Your AI teaching assistant. Ask me anything about lesson planning,
              classroom management, student engagement, or teaching strategies.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(suggestion)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-color3 hover:border-color1 hover:bg-color1/5 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-4",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 bg-color1 rounded-full flex items-center justify-center flex-shrink-0">
                  <MdPerson className="w-6 h-6 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-color9 text-white rounded-br-none"
                    : "bg-white text-color3 rounded-bl-none card-shadow"
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-color1 rounded-full flex items-center justify-center flex-shrink-0">
              <MdPerson className="w-6 h-6 text-white" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 card-shadow">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Monica anything about teaching..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6"
          >
            <MdSend size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
}

const suggestions = [
  "Help me plan a science lesson",
  "Tips for classroom management",
  "How to engage quiet students?",
  "Assessment strategies",
];
