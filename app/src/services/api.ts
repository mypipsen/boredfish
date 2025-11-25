import { API_ENDPOINTS } from '@/constants';
import { Media, MediaStatus } from '@/types';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

const apiFetch = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
  const { params, ...fetchOptions } = options;

  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams(params);
    fullUrl = `${url}?${searchParams.toString()}`;
  }

  const response = await fetch(fullUrl, {
    credentials: 'include',
    ...fetchOptions,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const searchMedia = async (query: string): Promise<Media[]> => {
  return apiFetch<Media[]>(API_ENDPOINTS.SEARCH, {
    params: { q: query },
  });
};

export const fetchMediaByStatus = async (status: MediaStatus): Promise<Media[]> => {
  return apiFetch<Media[]>(API_ENDPOINTS.MEDIA, {
    params: { status },
  });
};

export const addMedia = async (media: Partial<Media> & { id: number }): Promise<void> => {
  await apiFetch(API_ENDPOINTS.MEDIA, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(media),
  });
};

export const updateMedia = async (
  id: number,
  updates: { liked?: boolean; status?: MediaStatus }
): Promise<void> => {
  await apiFetch(`${API_ENDPOINTS.MEDIA}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
};

export const deleteMedia = async (id: number): Promise<void> => {
  await apiFetch(`${API_ENDPOINTS.MEDIA}/${id}`, {
    method: 'DELETE',
  });
};
