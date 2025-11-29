import { ModelMessage } from 'ai';
import { Router } from 'express';
import { z } from 'zod';

import { requireAuth } from '../middleware/requireAuth.js';
import { validateSchema } from '../middleware/validate.js';
import * as chatService from '../services/chat.js';

const router = Router();

router.post(
  '/chat',
  requireAuth,
  validateSchema({
    body: z.object({
      messages: z.array(z.any()),
    }),
  }),
  async (req, res) => {
    const { messages } = req.body as { messages: ModelMessage[] };
    const stream = await chatService.chat(messages, req.userId!);

    const textStream = stream.toTextStreamResponse();

    // return pipeTextStreamToResponse({ response: res, textStream });

    textStream.headers.forEach((value, key) => res.setHeader(key, value));
    if (textStream.body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for await (const chunk of textStream.body as any) {
        res.write(chunk);
      }
    }
    res.end();
  }
);

export default router;
