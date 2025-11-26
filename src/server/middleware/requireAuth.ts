import { fromNodeHeaders } from 'better-auth/node';
import type { NextFunction, Request, Response } from 'express';

import { auth } from '../services/auth.js';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.userId = session.user.id;

    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized: Invalid session.' });
  }
}
