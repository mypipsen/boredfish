import { Router } from 'express';
import { z } from 'zod';

import * as mediaService from '../services/media.ts';
import { validateSchema } from '../middleware/validate.ts';
import { requireAuth } from '../middleware/requireAuth.ts';
import { type UserMediaStatus } from '../prisma/client.ts';

const router = Router();

router.get(
  '/media',
  requireAuth,
  validateSchema({
    query: z.object({
      status: z.enum(['watchlist', 'archived']),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    const status = req.query.status;
    const media = await mediaService.getMedia(userId, status as UserMediaStatus);

    res.json(media);
  }
);

router.post(
  '/media',
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
      status: z.enum(['watchlist', 'archived']).default('watchlist'),
      liked: z.boolean().optional(),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    await mediaService.addMedia(req.body, userId);

    res.status(204).send();
  }
);

router.patch(
  '/media/:id',
  requireAuth,
  validateSchema({
    params: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({
      liked: z.boolean(),
      status: z.enum(['watchlist', 'archived']),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = (req as any).params;
    await mediaService.updateMedia(id, req.body, userId);

    res.status(204).send();
  }
);

router.delete(
  '/media/:id',
  requireAuth,
  validateSchema({
    params: z.object({
      id: z.coerce.number(),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = (req as any).params;
    await mediaService.deleteMedia(id, userId);

    res.status(204).send();
  }
);

export default router;
