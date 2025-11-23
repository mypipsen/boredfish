import { PrismaTestingHelper } from '@chax-at/transactional-prisma-testing';
import { afterEach, beforeEach, vi } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prismaTestingHelper: PrismaTestingHelper<any>;

// Mock prisma so all tests use the test transaction
vi.mock('../prisma/client', async () => {
  const prismaClient =
    await vi.importActual<typeof import('../prisma/client.ts')>('../prisma/client.ts');

  prismaTestingHelper = new PrismaTestingHelper(prismaClient.prisma);
  const prismaTest = prismaTestingHelper.getProxyClient();

  return {
    ...prismaClient,
    prisma: prismaTest,
  };
});

beforeEach(async () => {
  await prismaTestingHelper.startNewTransaction();
});

afterEach(async () => {
  prismaTestingHelper.rollbackCurrentTransaction();
});
