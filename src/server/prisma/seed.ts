import 'dotenv/config';

import fs from 'fs';
import path from 'path';

import { prisma } from './client.js';
import { seedMedia } from './fixtures/media.js';
import { seedUserMedia } from './fixtures/userMedia.js';
import { seedUsers } from './fixtures/users.js';

const fixturesPath = path.join(process.cwd(), 'src/server/tests', 'fixtures.json');
const fixtures: Record<string, object> = {};

async function main() {
  fixtures.users = await seedUsers();
  fixtures.media = await seedMedia();
  fixtures.userMedia = await seedUserMedia();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    fs.writeFileSync(fixturesPath, JSON.stringify(fixtures, null, 2));
    console.log('Fixtures written to', fixturesPath);

    prisma.$disconnect();
  });
