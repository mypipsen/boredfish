import { prisma, type Prisma, type MediaType } from '../client.ts';

export const mediaSeeds: Record<string, Prisma.MediaCreateInput> = {
  lotrFellowship: {
    id: 120,
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    description:
      'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
    year: '2001',
    poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    type: 'movie',
    rating: 8.426,
    releaseDate: '2001-12-18T00:00:00.000Z',
  },
  lotrTwoTowers: {
    id: 121,
    title: 'The Lord of the Rings: The Two Towers',
    description:
      'Frodo Baggins and the other members of the Fellowship continue their quest to destroy the One Ring, their destinies lie at two towers. Saruman and Sauron await while Frodo and Sam trek to Mordor.',
    year: '2002',
    poster: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
    type: 'movie',
    rating: 8.411,
    releaseDate: '2002-12-18T00:00:00.000Z',
  },
  lotrReturnKing: {
    id: 122,
    title: 'The Lord of the Rings: The Return of the King',
    description:
      'As armies mass for a final battle that will decide the fate of the world, one member of the Fellowship is revealed as the noble heir to the throne of Men. Yet, the sole hope for triumph over evil lies with Frodo, who, accompanied by Sam and Gollum, ventures deep into Mordor on his quest to destroy the Ring of Power.',
    year: '2003',
    poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
    type: 'movie',
    rating: 8.49,
    releaseDate: '2003-12-17T00:00:00.000Z',
  },
  lotrRohirrim: {
    id: 839033,
    title: 'The Lord of the Rings: The War of the Rohirrim',
    description:
      'A sudden attack by Wulf, a lord seeking vengeance, forces Helm Hammerhand and his people to make a daring last stand in the Hornburg.',
    year: '2024',
    poster: 'https://image.tmdb.org/t/p/w500/hE9SAMyMSUGAPsHUGdyl6irv11v.jpg',
    type: 'movie',
    rating: 6.57,
    releaseDate: '2024-12-05T00:00:00.000Z',
  },
};

export type MediaFixture = {
  id: number;
  title: string;
  type: MediaType;
};

export async function seedMedia() {
  const fixtures: Record<string, MediaFixture> = {};

  for (const [key, mediaSeed] of Object.entries(mediaSeeds)) {
    const media = await prisma.media.upsert({
      where: { id: mediaSeed.id },
      update: {},
      create: mediaSeed,
    });

    fixtures[key] = {
      id: media.id,
      title: media.title,
      type: media.type,
    };

    console.log(`Media created: ${key}`);
  }

  return fixtures;
}
