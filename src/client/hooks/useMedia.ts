import { useCallback, useEffect, useState } from 'react';

import { fetchMediaByStatus } from '../services/api';
import { Media, MediaStatus } from '../types';

export const useMedia = (status: MediaStatus) => {
  const [items, setItems] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchMediaByStatus(status);
      setItems(data || []);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch media');
      setError(error);
      console.error('Error fetching media:', error);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  return { items, isLoading, error, refetch: fetchMedia };
};
