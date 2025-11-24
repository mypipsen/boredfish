import createError from 'http-errors';

import { prisma, type MediaType, type UserMediaStatus } from '../prisma/client.ts';

export async function getMedia(userId: string, status: UserMediaStatus) {
  const userMediaEntries = await prisma.userMedia.findMany({
    where: {
      userId,
      status,
    },
    include: {
      media: true,
    },
  });

  return userMediaEntries.map((userMedia) => ({
    id: userMedia.media.id,
    title: userMedia.media.title,
    description: userMedia.media.description,
    year: userMedia.media.year,
    poster: userMedia.media.poster,
    type: userMedia.media.type,
    rating: userMedia.media.rating,
    releaseDate: userMedia.media.releaseDate,
    liked: userMedia.liked,
    status: userMedia.status,
    createdAt: userMedia.createdAt,
  }));
}

export type AddMediaType = {
  id: number;
  title: string;
  description: string;
  year: string;
  releaseDate: Date | string;
  poster: string;
  rating: number;
  type: MediaType;
  status: UserMediaStatus;
  liked?: boolean;
};

export async function addMedia(data: AddMediaType, userId: string) {
  const media = await prisma.media.upsert({
    where: { id: data.id },
    update: {},
    create: {
      id: data.id,
      title: data.title,
      description: data.description,
      year: data.year,
      releaseDate: data.releaseDate,
      poster: data.poster,
      rating: data.rating,
      type: data.type,
    },
  });

  const userMedia = await prisma.userMedia.upsert({
    where: {
      userId_mediaId: {
        userId: userId,
        mediaId: media.id,
      },
    },
    update: {
      status: data.status,
      liked: data.liked,
    },
    create: {
      userId,
      mediaId: media.id,
      status: data.status,
      liked: data.liked,
    },
  });

  return userMedia;
}

export type UpdateMediaType = {
  status: UserMediaStatus;
  liked?: boolean;
};

export async function updateMedia(id: number, data: UpdateMediaType, userId: string) {
  const userMedia = await prisma.userMedia.findUnique({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
  });

  if (!userMedia) {
    throw createError(404, 'Not found');
  }

  return prisma.userMedia.update({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
    data,
  });
}

export async function deleteMedia(id: number, userId: string) {
  return prisma.userMedia.delete({
    where: {
      userId_mediaId: {
        userId,
        mediaId: id,
      },
    },
  });
}
