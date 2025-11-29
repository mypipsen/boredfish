import { experimental_useObject as useObject } from '@ai-sdk/react';
import { Trash2 } from 'lucide-react';
import type { ModelMessage } from 'ai';
import { useEffect, useRef, useState } from 'react';

import { chatResponseSchema, MediaItem } from '../../shared/schema';
import logo from '../assets/bored-fish.png';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { TopNav } from '../components/TopNav';
import { WELCOME_MESSAGE } from '../constants';
import type { Message } from '../types';

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = sessionStorage.getItem('boredfish_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse chat messages', e);
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: { text: WELCOME_MESSAGE },
      },
    ];
  });

  useEffect(() => {
    sessionStorage.setItem('boredfish_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const { object, submit, isLoading } = useObject({
    api: '/api/chat',
    schema: chatResponseSchema,
    onFinish: ({ object }) => {
      if (object) {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: {
              text: object.text || '',
              media: object.media || [],
            },
          },
        ]);
      }
    },
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessageCountRef.current || isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages, isLoading]);

  const handleSendMessage = (input: string) => {
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: { text: input },
    };
    setMessages((prev) => [...prev, newUserMessage]);

    // Convert messages to ModelMessage format for the API
    const apiMessages: ModelMessage[] = [...messages, newUserMessage].map((msg) => ({
      role: msg.role,
      content: msg.content.text,
    }));

    submit({ messages: apiMessages });
  };

  const handleDeleteConversation = () => {
    sessionStorage.removeItem('boredfish_chat_messages');
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: { text: WELCOME_MESSAGE },
      },
    ]);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-background/95">
      <TopNav />

      <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col h-full">
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <img src={logo} alt="Bored Fish Logo" className="w-12 h-12 animate-bounce-slow" />
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                AI Assistant
              </h2>
            </div>
            <button
              onClick={handleDeleteConversation}
              className="p-2 hover:bg-red-500/10 rounded-full transition-colors text-primary/60 hover:text-red-500"
              title="Clear conversation"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && object && (
              <ChatMessage
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: {
                    text: object.text || '',
                    media: (object.media?.filter((m) => m !== undefined) ?? []) as MediaItem[],
                  },
                }}
              />
            )}
            {isLoading && !object && (
              <div className="flex justify-start">
                <div className="bg-secondary/80 backdrop-blur-sm rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="pt-6">
            <ChatInput onSend={handleSendMessage} status={isLoading ? 'streaming' : 'ready'} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
