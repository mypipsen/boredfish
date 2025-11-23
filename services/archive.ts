import createError from 'http-errors';

import { prisma } from '../prisma/client.ts';

export async function addMedia(id: number, liked: boolean, userId: string) {
  const media = await prisma.media.findFirst({
    where: { id },
  });

  if (!media) {
    return createError(404, 'Not found');
  }

  const archive = await prisma.archive.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
    },
  });

  const archiveMedia = await prisma.archiveMedia.upsert({
    where: {
      mediaId_archiveId: {
        mediaId: media.id,
        archiveId: archive.id,
      },
    },
    update: {
      liked,
    },
    create: {
      mediaId: media.id,
      archiveId: archive.id,
      liked,
    },
  });

  await prisma.watchlistMedia.deleteMany({
    where: {
      mediaId: media.id,
      watchlist: {
        userId,
      },
    },
  });

  return archiveMedia;
}

export async function getMedia(userId: string) {
  const items = await prisma.archiveMedia.findMany({
    where: { archive: { userId } },
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
    liked: item.liked,
    createdAt: item.createdAt,
  }));
}

export async function updateMedia(id: number, liked: boolean, userId: string) {
  const archiveMedia = await prisma.archiveMedia.findFirst({
    where: {
      media: {
        id,
      },
      archive: {
        userId,
      },
    },
  });

  if (!archiveMedia) {
    return createError(404, 'Not found');
  }

  return prisma.archiveMedia.update({
    where: {
      mediaId_archiveId: {
        mediaId: archiveMedia.mediaId,
        archiveId: archiveMedia.archiveId,
      },
    },
    data: {
      liked,
    },
  });
}

export async function deleteMedia(id: number, userId: string) {
  return prisma.archiveMedia.deleteMany({
    where: {
      media: {
        id,
      },
      archive: {
        userId,
      },
    },
  });
}
