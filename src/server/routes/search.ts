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

router.get('/upcoming', requireAuth, async (req, res) => {
  const results = await searchService.upcoming();

  res.json(results);
});

router.get('/trending/movies', requireAuth, async (req, res) => {
  const results = await searchService.getTrendingMovies();

  res.json(results);
});

router.get('/trending/tv', requireAuth, async (req, res) => {
  const results = await searchService.getTrendingTvShows();

  res.json(results);
});

export default router;
