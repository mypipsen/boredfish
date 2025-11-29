import { openai } from '@ai-sdk/openai';
import { ModelMessage, Output, tool, ToolLoopAgent } from 'ai';
import { z } from 'zod';

import { chatResponseSchema } from '../../shared/schema.js';
import { tmdb } from '../lib/tmdb.js';
import { prisma } from '../prisma/client.js';

export async function chat(messages: ModelMessage[], userId: string) {
  const userMedia = await prisma.userMedia.findMany({
    where: { userId },
    include: { media: true },
  });

  const watchlist = userMedia
    .filter((m) => m.status === 'watchlist')
    .map((m) => m.media.title)
    .join(', ');

  const archived = userMedia
    .filter((m) => m.status === 'archived')
    .map((m) => m.media.title)
    .join(', ');

  const context = `
    User's Watchlist: ${watchlist}
    User's Archived/Watched Movies: ${archived}
  `;

  const agent = new ToolLoopAgent({
    model: openai('gpt-4o'),
    instructions:
      'You are a helpful assistant and an expert in finding movies and tv shows based on keyword searches.' +
      'You can also provide help with recommendations of movies or tv shows to watch.' +
      'Use the available tools to find information.' +
      'Do not just dump all search results; curate the list for the user.' +
      'Never list any movies or tv shows in the text response.' +
      "Prioritize curated recommendations based on the user's media list and avoid generic lists." +
      "Make sure you never include any movies which are already on the user's lists." +
      `Here is some context about the user's media:\n${context}`,
    tools: {
      multiSearch: tool({
        description: 'Search for movies or TV shows based on a query string.',
        inputSchema: z.object({
          query: z.string(),
        }),
        execute: async ({ query }: { query: string }) => {
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
    },
    output: Output.object({ schema: chatResponseSchema }),
  });

  return agent.stream({ messages });
}
