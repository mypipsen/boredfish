import { Router } from 'express';
import { z } from 'zod';

import * as archiveService from '../services/archive.ts';
import { validateSchema } from '../middleware/validate.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

const router = Router();

router.get('/archive', requireAuth, async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (req as any).userId;
  const media = await archiveService.getMedia(userId);

  res.json(media);
});

router.post(
  '/archive',
  requireAuth,
  validateSchema({
    body: z.object({
      id: z.number(),
      liked: z.boolean(),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    const { id, liked } = req.body;

    await archiveService.addMedia(id, liked, userId);

    res.status(204).send();
  }
);

router.patch(
  '/archive/media/:id/like',
  requireAuth,
  validateSchema({
    params: z.object({
      id: z.coerce.number(),
    }),
    body: z.object({
      liked: z.boolean(),
    }),
  }),
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (req as any).userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { id } = (req as any).params;
    const { liked } = req.body;

    await archiveService.updateMedia(id, liked, userId);

    res.status(204).send();
  }
);

router.delete(
  '/archive/media/:id',
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

    await archiveService.deleteMedia(id, userId);

    res.status(204).send();
  }
);

export default router;
