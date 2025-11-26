import 'dotenv/config';

import express from 'express';
import ViteExpress from 'vite-express';

import { errorHandler } from './middleware/errorHandler.js';
import { registerRoutes } from './routes/index.js';

const app = express();
const port = 3000;

app.use(express.json());

registerRoutes(app);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

if (!process.env.VERCEL) {
  ViteExpress.listen(app, port, () => {
    console.log(`Local server listening on port ${port}`);
  });
}

export default app;
