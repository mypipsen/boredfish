import 'dotenv/config';

import express from 'express';
import ViteExpress from 'vite-express';

import { errorHandler } from './middleware/errorHandler.js';
import { userContext } from './middleware/userContext.js';
import { registerRoutes } from './routes/index.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(userContext);

registerRoutes(app);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

ViteExpress.listen(app, port, () => {
  console.log(`Server listening on port ${port}`);
});
