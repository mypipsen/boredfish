import type { Express } from 'express';

import auth from './auth.js';
import chat from './chat.js';
import media from './media.js';
import search from './search.js';

export function registerRoutes(app: Express) {
  app.get('/api', (req, res) => {
    res.send("I'm a bored fish..");
  });

  app.use('/api', auth);
  app.use('/api', chat);
  app.use('/api', search);
  app.use('/api', media);
}
