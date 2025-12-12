export const API_ENDPOINTS = {
  MEDIA: '/api/media',
  SEARCH: '/api/search',
  CHAT: '/api/chat',
  UPCOMING: '/api/upcoming',
  TRENDING_MOVIES: '/api/trending/movies',
  TRENDING_TV: '/api/trending/tv',
} as const;

export const WELCOME_MESSAGE =
  "Hi! I'm your movie and TV show assistant. You can ask me to search for shows, add them to your watchlist, or get recommendations. Try asking about a movie!";

export const ERROR_MESSAGES = {
  SEARCH_FAILED: 'Failed to search. Please try again.',
  ADD_TO_WATCHLIST_FAILED: 'Failed to add to watchlist. Please try again.',
  REMOVE_FAILED: 'Failed to remove. Please try again.',
  ARCHIVE_FAILED: 'Failed to archive. Please try again.',
  UPDATE_FAILED: 'Failed to update. Please try again.',
  CHAT_FAILED: "Sorry, I couldn't process that right now. Please try again.",
  LOGIN_FAILED: 'Invalid credentials',
} as const;

export const SUCCESS_MESSAGES = {
  ADDED_TO_WATCHLIST: 'Added to watchlist',
  REMOVED: 'Removed',
  ARCHIVED: 'Archived',
  UPDATED: 'Updated',
} as const;
