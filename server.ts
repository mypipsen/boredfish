import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middleware/errorHandler.ts';
import { userContext } from './middleware/userContext.ts';
import { registerRoutes } from './routes/index.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// CORS - allow both production (same origin) and development (port 8080)
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);
app.use(express.json());
app.use(userContext);

// Serve static files from the React app (production)
app.use(express.static(path.join(__dirname, 'app/dist')));

registerRoutes(app);

// SPA fallback: for any request that doesn't match an API route, send back the React app
// This must be after API routes but before error handler
app.use((req, res, next) => {
  // If the request is for an API route, let it fall through to 404
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Otherwise, serve the React app
  res.sendFile(path.join(__dirname, 'app/dist/index.html'));
});

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
