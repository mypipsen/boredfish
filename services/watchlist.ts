import { prisma, type Prisma } from "../prisma/client.ts";

export async function addMedia(data: Prisma.MediaCreateInput, userId: string) {
  const media = await prisma.media.upsert({
    where: { id: data.id },
    update: {},
    create: data,
  });

  const watchlist = await prisma.watchlist.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
    },
  });

  const watchlistMedia = await prisma.watchlistMedia.upsert({
    where: {
      mediaId_watchlistId: {
        mediaId: media.id,
        watchlistId: watchlist.id,
      },
    },
    update: {},
    create: {
      mediaId: media.id,
      watchlistId: watchlist.id,
    },
  });

  return watchlistMedia;
}

export async function getMedia(userId: string) {
  const items = await prisma.watchlistMedia.findMany({
    where: { watchlist: { userId } },
    include: { media: true },
  });

  return items.map((item) => ({
    id: item.media.id,
    title: item.media.title,
    description: item.media.description,
    year: item.media.year,
    poster: item.media.poster,
    type: item.media.type,
    rating: item.media.rating,
    releaseDate: item.media.releaseDate,
    createdAt: item.createdAt,
  }));
}
