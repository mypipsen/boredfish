import { z } from 'zod';

export const mediaSchema = z.object({
  id: z.number().describe('The id of the movie or tv show'),
  title: z
    .string()
    .describe('The title of the movie or tv show. Most tools return this as the title property'),
  year: z
    .number()
    .describe(
      'The year the movie or tv show was released. Found from the release_date string returned in most tools'
    ),
  releaseDate: z.coerce
    .date()
    .describe(
      'The release date of the movie or tv show. Found from the release_date string returned in most tools'
    ),
  rating: z
    .number()
    .describe(
      'The rating of the movie. Most tools return this as vote_average. Not all movies and tv shows have a rating.'
    ),
  poster: z.string().describe('A url to to the poster. Most tools return this as the poster_path'),
  description: z
    .string()
    .describe(
      'A description of the movie or tv show. Most tools return this as the overview property'
    ),
  type: z.enum(['movie', 'tv']).describe('The type of the media. Either movie or tv'),
});

export type MediaItem = z.infer<typeof mediaSchema>;

export const chatResponseSchema = z.object({
  text: z.string().describe('The response text to show to the user'),
  media: z.array(mediaSchema).optional().describe('The list of movies or tv shows to display'),
});
