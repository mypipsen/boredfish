import 'dotenv/config';

import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: './src/server/prisma',
  migrations: {
    path: './src/server/prisma/migrations',
    seed: `tsx src/server/prisma/seed.ts`,
  },
  datasource: {
    url: env('PRISMA_DATABASE_URL'),
  },
});
