import { z } from 'zod';

import { type MovieWithMediaType, tmdb, type TVWithMediaType } from '../lib/tmdb.js';

const MediaSchema = z.object({
  id: z.number(),
  title: z.string(),
  year: z.string().optional(),
  releaseDate: z.string().optional(),
  rating: z.number(),
  poster: z.string().optional(),
  description: z.string(),
  type: z.enum(['movie', 'tv']),
});

function mapToMedia(result: MovieWithMediaType | TVWithMediaType) {
  const releaseDate = result.media_type === 'tv' ? result.first_air_date : result.release_date;
  const year = releaseDate ? releaseDate.split('-')[0] : undefined;
  const poster = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '';
  const title = result.media_type === 'movie' ? result.title || '' : result.name || '';

  const media = {
    id: result.id,
    title,
    description: result.overview || '',
    year,
    poster,
    type: result.media_type,
    rating: result.vote_average || 0,
    releaseDate,
  };

  return MediaSchema.parse(media);
}

export async function search(query: string) {
  const { results } = await tmdb.search.multi({ query });

  const mediaResults = results.filter(
    (result) => result.media_type === 'movie' || result.media_type === 'tv'
  );

  return mediaResults.map((result) => mapToMedia(result));
}

export async function upcoming() {
  const { results } = await tmdb.movies.upcoming();

  return results.map((result) => mapToMedia({ ...result, media_type: 'movie' }));
}
