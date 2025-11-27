import { useEffect, useRef } from 'react';

import logo from '../assets/bored-fish.png';
import { ChatInput } from '../components/ChatInput';
import { ChatMessage } from '../components/ChatMessage';
import { TopNav } from '../components/TopNav';
import { useChat } from '../hooks/useChat';

const Chat = () => {
  const { messages, sendMessage, isLoading: isChatLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessageCountRef = useRef(messages.length);

  useEffect(() => {
    // Only scroll if messages were added (not on initial load)
    if (messages.length > prevMessageCountRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessageCountRef.current = messages.length;
  }, [messages]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-background to-background/95">
      <TopNav />

      <main className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-6 flex-shrink-0">
            <img src={logo} alt="Bored Fish Logo" className="w-12 h-12 animate-bounce-slow" />
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              AI Assistant
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                movies={message.movies}
              />
            ))}
            {isChatLoading && (
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
            <ChatInput onSend={sendMessage} disabled={isChatLoading} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
