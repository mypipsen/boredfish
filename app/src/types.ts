export type MediaType = 'movie' | 'tv';
export type MediaStatus = 'watchlist' | 'archived';

export interface Media {
  id: number;
  title: string;
  description: string;
  year: number;
  poster: string;
  type: MediaType;
  rating: number;
  releaseDate: Date | string;
  createdAt: Date | string;
  liked: boolean;
  status: MediaStatus;
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
  movies?: Media[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
