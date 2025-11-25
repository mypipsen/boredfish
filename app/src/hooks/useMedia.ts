import { useEffect, useState } from 'react';

import { Media } from '@/components/MediaCard';

export const useMedia = (status: 'watchlist' | 'archived') => {
  const [items, setItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      const response = await fetch(`/api/media?status=${status}`, {
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to fetch media');

      const data = await response.json();
      setItems(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [status]);

  return { items, isLoading, refetch: fetchMedia };
};
