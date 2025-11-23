import { Router } from 'express';
import { z } from 'zod';

import * as watchlistService from '../services/watchlist.ts';
import { validateSchema } from '../middleware/validate.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

const router = Router();

router.get('/watchlist', requireAuth, async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (req as any).userId;
  const media = await watchlistService.getMedia(userId);

  res.json(media);
});

router.post(
  '/watchlist/media',
  requireAuth,
  validateSchema({
    body: z.object({
      id: z.number(),
      title: z.string(),
      year: z.string(),
      releaseDate: z.coerce.date(),
      rating: z.number(),
      poster: z.string(),
      description: z.string(),
      type: z.enum(['movie', 'tv']),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    await watchlistService.addMedia(req.body, userId);

    res.status(204).send();
  }
);

export default router;
