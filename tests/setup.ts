import { beforeEach } from "vitest";
import { prisma } from "../prisma/client";
import { TEST_USER } from "./fixtures";

beforeEach(async () => {
  const tables = await prisma.$queryRaw<
    { name: string }[]
  >`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_migrations';`;

  try {
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

    for (const { name } of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
      await prisma.$executeRawUnsafe(
        `DELETE FROM sqlite_sequence WHERE name='${name}';`
      );
    }

    await prisma.user.create({
      data: TEST_USER,
    });
  } finally {
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
  }
});
