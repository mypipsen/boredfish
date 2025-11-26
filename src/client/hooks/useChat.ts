import { useCallback, useEffect, useRef, useState } from 'react';

import { API_ENDPOINTS, ERROR_MESSAGES, WELCOME_MESSAGE } from '../constants';
import { Message } from '../types';

const STORAGE_KEY = 'chat_messages';

const loadMessagesFromStorage = (): Message[] => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load messages from storage:', error);
  }
  return [
    {
      id: 'welcome',
      content: WELCOME_MESSAGE,
      isUser: false,
      timestamp: Date.now(),
    },
  ];
};

const saveMessagesToStorage = (messages: Message[]) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save messages to storage:', error);
  }
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(loadMessagesFromStorage);
  const [isLoading, setIsLoading] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    saveMessagesToStorage(messages);
  }, [messages]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const sendMessage = useCallback(async (query: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: query,
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const eventSource = new EventSource(`${API_ENDPOINTS.CHAT}?q=${encodeURIComponent(query)}`);
      eventSourceRef.current = eventSource;

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        content: '',
        isUser: false,
        timestamp: Date.now(),
        movies: [],
      };

      setMessages((prev) => [...prev, botMessage]);

      eventSource.onmessage = (event) => {
        const { text, movies } = JSON.parse(event.data);

        setMessages((prev) =>
          prev.map((message) =>
            message.id === botMessage.id ? { ...message, content: text, movies } : message
          )
        );
      };

      eventSource.addEventListener('end', () => {
        eventSource.close();
        eventSourceRef.current = null;
        setIsLoading(false);
      });

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        eventSource.close();
        eventSourceRef.current = null;

        setMessages((prev) => [
          ...prev.filter((msg) => msg.id !== botMessage.id),
          {
            ...botMessage,
            content: ERROR_MESSAGES.CHAT_FAILED,
          },
        ]);
        setIsLoading(false);
      };
    } catch (error) {
      console.error('Chat error:', error);

      const errorMessage: Message = {
        id: `bot-${Date.now()}`,
        content: ERROR_MESSAGES.CHAT_FAILED,
        isUser: false,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  }, []);

  return { messages, sendMessage, isLoading };
};
