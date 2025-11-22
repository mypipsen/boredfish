import { prisma, type Prisma, type User } from "../prisma/client.ts";

export async function addToWatchlist(
  data: Prisma.MediaCreateInput,
  user: User
) {
  const media = await prisma.media.upsert({
    where: { id: data.id },
    update: {},
    create: data,
  });

  const watchlist = await prisma.watchlist.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
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
