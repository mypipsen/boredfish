import { auth } from '../../services/auth.js';
import { prisma } from '../client.js';

const userSeeds = {
  admin: {
    username: 'admin',
    password: 'admin',
    email: 'admin@pipsen.dev',
    name: 'Admin',
  },
};

export type FixtureUser = {
  id: string;
  email: string;
  username: string;
};

export async function seedUsers() {
  const fixtures: Record<string, FixtureUser> = {};

  for (const [key, userSeed] of Object.entries(userSeeds)) {
    let user;

    user = await prisma.user.findUnique({
      where: { email: userSeed.email },
    });

    if (!user) {
      const result = await auth.api.signUpEmail({
        body: {
          username: userSeed.username,
          password: userSeed.password,
          email: userSeed.email,
          name: userSeed.name,
        },
      });

      user = result.user;
    }

    console.log(`User created: ${key}`);

    fixtures[key] = {
      id: user.id,
      email: user.email,
      username: userSeed.username,
    };
  }

  return fixtures;
}
