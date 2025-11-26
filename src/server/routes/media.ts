import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/requireAuth.js';
import { validateSchema } from '../middleware/validate.js';
import { type UserMediaStatus } from '../prisma/client.js';
import * as mediaService from '../services/media.js';

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
    const userId = req.userId!;
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
    const userId = req.userId!;
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
    const userId = req.userId!;
    const { id } = req.params;
    await mediaService.updateMedia(Number(id), req.body, userId);

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
    const userId = req.userId!;
    const { id } = req.params;
    await mediaService.deleteMedia(Number(id), userId);

    res.status(204).send();
  }
);

export default router;
