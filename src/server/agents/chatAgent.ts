import { openai } from '@ai-sdk/openai';
import { Output, tool, ToolLoopAgent } from 'ai';
import type { Response } from 'express';
import { z } from 'zod';

import { tmdb } from '../lib/tmdb.js';

const MediaSchema = z.object({
  id: z.number().describe('The id of the movie or tv show'),
  title: z
    .string()
    .describe('The title of the movie or tv show. Most tools return this as the title property'),
  year: z
    .string()
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

export default class ChatAgent {
  readonly _agent;

  constructor() {
    this._agent = new ToolLoopAgent({
      model: this.model,
      tools: this.tools,
      output: this.output,
      instructions: this.instructions,
    });
  }

  get model() {
    return openai('gpt-4o');
  }

  get instructions() {
    return `You are a helpful assistant and an expert in finding movies and tv shows based on keyword searches
You can also provide help with recommendations of movies or tv shows to watch.`;
  }

  get tools() {
    return {
      multiSearch: tool({
        description: 'Search for movies or TV shows based on a query string.',
        inputSchema: z.object({
          query: z.string(),
        }),
        execute: async ({ query }) => {
          console.info(`Using multiSearch tool with query ${query}`);
          return tmdb.search.multi({ query });
        },
      }),
      upcomingMovies: tool({
        description: 'Get a list of movies that are being released soon.',
        inputSchema: z.object({}),
        execute: async () => {
          console.info('Using upcomingMovies tool');
          return tmdb.movies.upcoming();
        },
      }),
    };
  }

  get output() {
    return Output.object({
      schema: z.object({
        text: z
          .string()
          .describe(
            'The general response to the request. Do not include movie or tv shows details in this text'
          ),
        movies: z.array(MediaSchema),
      }),
    });
  }

  async run(query: string, res: Response) {
    const { partialOutputStream } = await this._agent.stream({
      prompt: query,
    });

    for await (const chunk of partialOutputStream) {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    }

    res.write('event: end\ndata: done\n\n');
    res.end();
  }
}
