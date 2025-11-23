import { Router } from 'express';
import { z } from 'zod';

import * as searchService from '../services/search.ts';
import { validateSchema } from '../middleware/validate.ts';
import { requireAuth } from '../middleware/requireAuth.ts';

const router = Router();

router.get(
  '/search',
  requireAuth,
  validateSchema({
    query: z.object({
      q: z.string().min(1).max(128),
    }),
  }),
  async (req, res) => {
    const results = await searchService.search(req.query.q as string);

    res.json(results);
  }
);

export default router;
