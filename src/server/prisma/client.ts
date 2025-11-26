import 'dotenv/config';

import { PrismaClient } from '@prisma/client-generated/client.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  accelerateUrl: process.env.PRISMA_DATABASE_URL,
}).$extends(withAccelerate());

export { prisma };
export type * from '@prisma/client-generated/client.js';
