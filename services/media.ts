import { prisma, type Prisma } from "../prisma/client.ts";

export async function addToWatchlist(
  data: Prisma.MediaCreateInput,
  userId: string
) {
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
