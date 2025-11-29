import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client-generated/client.js';
import { withAccelerate } from '@prisma/extension-accelerate';
import { Pool } from 'pg';

const connectionString = process.env.PRISMA_DATABASE_URL;

function initPrisma() {
  switch (process.env.DATABASE_PROVIDER) {
    case 'postgres':
      return new PrismaClient({ adapter: new PrismaPg(new Pool({ connectionString })) });
    case 'prisma-accelerate':
      return new PrismaClient({ accelerateUrl: connectionString }).$extends(withAccelerate());
    default:
      throw new Error('Unknown database provider');
  }
}

const prisma = initPrisma();

export { prisma };
export type * from '@prisma/client-generated/client.js';
