import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { errorHandler } from './middleware/errorHandler.ts';
import { userContext } from './middleware/userContext.ts';
import { registerRoutes } from './routes/index.ts';

const app = express();
const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(userContext);

registerRoutes(app);

// Error handling middleware must be last, after other app.use() and routes calls
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
