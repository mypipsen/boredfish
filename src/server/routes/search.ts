import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/requireAuth.js';
import { validateSchema } from '../middleware/validate.js';
import * as searchService from '../services/search.js';

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
