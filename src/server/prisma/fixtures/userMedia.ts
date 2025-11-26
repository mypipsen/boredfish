import { prisma, type UserMediaStatus } from '../client.js';

type UserMediaSeed = {
  user: {
    email: string;
  };
  media: {
    id: number;
  };
  status: UserMediaStatus;
  liked?: boolean;
};

export const userMediaSeeds: Record<string, UserMediaSeed> = {
  adminLotrFellowship: {
    user: {
      email: 'admin@bored.fish',
    },
    media: {
      id: 120,
    },
    status: 'archived',
    liked: true,
  },
  adminLotrTwoTowers: {
    user: {
      email: 'admin@bored.fish',
    },
    media: {
      id: 121,
    },
    status: 'archived',
    liked: true,
  },
  adminLotrReturnKing: {
    user: {
      email: 'admin@bored.fish',
    },
    media: {
      id: 122,
    },
    status: 'archived',
    liked: true,
  },
  adminLotrRohirrim: {
    user: {
      email: 'admin@bored.fish',
    },
    media: {
      id: 839033,
    },
    status: 'watchlist',
  },
};

export type UserMediaFixture = {
  userId: string;
  mediaId: number;
  status: UserMediaStatus;
};

export async function seedUserMedia() {
  const fixtures: Record<string, UserMediaFixture> = {};

  for (const [key, userMediaSeed] of Object.entries(userMediaSeeds)) {
    const user = await prisma.user.findFirstOrThrow({
      where: userMediaSeed.user,
    });

    const media = await prisma.media.findFirstOrThrow({
      where: userMediaSeed.media,
    });

    const userMedia = await prisma.userMedia.upsert({
      where: {
        userId_mediaId: {
          userId: user.id,
          mediaId: media.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        mediaId: media.id,
        status: userMediaSeed.status,
        liked: userMediaSeed.liked,
      },
    });

    fixtures[key] = {
      userId: user.id,
      mediaId: media.id,
      status: userMedia.status,
    };

    console.log(`User media created: ${key}`);
  }

  return fixtures;
}
