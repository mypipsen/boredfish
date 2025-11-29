import type { MediaItem } from '../shared/schema';

export type MediaType = 'movie' | 'tv';
export type MediaStatus = 'watchlist' | 'archived';

export interface Media extends MediaItem {
  createdAt: Date | string;
  liked: boolean;
  status: MediaStatus;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: {
    text: string;
    media?: MediaItem[];
  };
};
