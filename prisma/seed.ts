import fs from 'fs';
import path from 'path';

import 'dotenv/config';

import { prisma } from './client.ts';
import { auth } from '../services/auth.ts';

type FixtureUser = {
  id: string;
  email: string;
  name: string;
};

const fixturesPath = path.join(process.cwd(), 'tests', 'fixtures.json');
const fixtures: { users: Record<string, FixtureUser> } = { users: {} };

const seedUsers = {
  admin: {
    email: 'admin@bored.fish',
    name: 'admin',
    password: 'admin',
  },
};

async function main() {
  for (const [key, seedUser] of Object.entries(seedUsers)) {
    const existing = await prisma.user.findUnique({
      where: { email: seedUser.email },
    });

    if (!existing) {
      const { user } = await auth.api.signUpEmail({
        body: {
          email: seedUser.email,
          name: seedUser.name,
          password: seedUser.password,
        },
      });

      fixtures.users[key] = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      console.log('User created:', user.email);
    }
  }
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
