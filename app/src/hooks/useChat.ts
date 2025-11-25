import { useState } from 'react';

import { Media } from '@/components/MediaCard';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  movies?: Media[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content:
        "Hi! I'm your movie and TV show assistant. You can ask me to search for shows, add them to your watchlist, or get recommendations. Try asking about a movie!",
      isUser: false,
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (q: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: q,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const eventSource = new EventSource(`/api/chat?q=${encodeURIComponent(q)}`);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: '',
        isUser: false,
        timestamp: Date.now(),
        movies: [],
      };

      setMessages((prev) => [...prev, botMessage]);

      eventSource.onopen = () => console.log('SSE connected!');
      eventSource.onerror = (err) => console.error('SSE error:', err);

      eventSource.onmessage = (event) => {
        const { text, movies } = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((message) =>
            message.id === botMessage.id ? { ...message, content: text, movies: movies } : message
          )
        );
      };

      eventSource.addEventListener('end', () => {
        console.log('SSE stream ended');
        eventSource.close();
      });
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        content: "Sorry, I couldn't search for that right now. Please try again.",
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
};
