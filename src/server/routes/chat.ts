import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/requireAuth.js';
import { validateSchema } from '../middleware/validate.js';
import * as chatService from '../services/chat.js';

const router = Router();

router.get(
  '/chat',
  requireAuth,
  validateSchema({
    query: z.object({
      q: z.string().min(1).max(512),
    }),
  }),
  async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    return chatService.chat(req.query.q as string, res);
  }
);

export default router;
