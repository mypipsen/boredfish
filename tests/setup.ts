import { beforeEach } from "vitest";
import { prisma } from "../prisma/client";

beforeEach(async () => {
  const tables = [
    "archive",
    "archive_media",
    "media",
    "watchlist",
    "watchlist_media",
  ];

  try {
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

    for (const name of tables) {
      await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
      await prisma.$executeRawUnsafe(
        `DELETE FROM sqlite_sequence WHERE name='${name}';`
      );
    }
  } finally {
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
  }
});
