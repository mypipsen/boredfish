import { auth } from '../../services/auth.js';
import { prisma } from '../client.js';

const userSeeds = {
  admin: {
    email: 'admin@bored.fish',
    name: 'admin',
    password: 'admin',
  },
};

export type FixtureUser = {
  id: string;
  email: string;
  name: string;
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
          email: userSeed.email,
          name: userSeed.name,
          password: userSeed.password,
        },
      });

      user = result.user;
    }

    console.log(`User created: ${key}`);

    fixtures[key] = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  return fixtures;
}
