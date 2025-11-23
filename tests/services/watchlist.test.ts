import { it, describe, expect, beforeEach } from 'vitest';

import { prisma, type Prisma } from '../../prisma/client.ts';
import * as watchlistService from '../../services/watchlist.ts';
import * as fixtures from '../fixtures.json';

describe('the watchlist service', function () {
  describe('when adding media to watchlist', function () {
    const mediaData: Prisma.MediaCreateInput = {
      id: 12345,
      title: 'House of the Dragon',
      description:
        'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne. But when Viserys later fathers a son, the court is shocked when Rhaenyra retains her status as his heir, and seeds of division sow friction across the realm.',
      year: '2022',
      poster: 'https://image.tmdb.org/t/p/w500/oxmdHR5Ka28HAJuMmS2hk5K6QQY.jpg',
      type: 'tv',
      rating: 8.308,
      releaseDate: new Date('2022-08-21'),
    };

    it('should create the expected objects', async function () {
      const watchlistMedia = await watchlistService.addMedia(mediaData, fixtures.users.admin.id);
      const media = await prisma.media.findFirst({
        where: {
          id: 12345,
        },
      });
      const watchlist = await prisma.watchlist.findFirst({
        where: {
          userId: fixtures.users.admin.id,
        },
      });

      expect(media).toMatchObject(mediaData);
      expect(watchlist).toMatchObject({
        id: expect.any(Number),
        userId: fixtures.users.admin.id,
        createdAt: expect.any(Date),
      });
      expect(watchlistMedia).toMatchObject({
        mediaId: media!.id,
        watchlistId: watchlist!.id,
        createdAt: expect.any(Date),
      });
    });

    describe('when media exists', function () {
      let existingMedia: Prisma.MediaModel;

      beforeEach(async function () {
        existingMedia = await prisma.media.create({
          data: mediaData,
        });
      });

      it('should add existing media', async function () {
        const watchlistMedia = await watchlistService.addMedia(mediaData, fixtures.users.admin.id);

        expect(watchlistMedia.mediaId).to.equal(existingMedia.id);
      });
    });

    describe('when watchlist exists', function () {
      let existingWatchlist: Prisma.WatchlistModel;

      beforeEach(async function () {
        existingWatchlist = await prisma.watchlist.create({
          data: {
            userId: fixtures.users.admin.id,
          },
        });
      });

      it('should add to existing watchlist', async function () {
        const watchlistMedia = await watchlistService.addMedia(mediaData, fixtures.users.admin.id);

        expect(watchlistMedia.watchlistId).to.equal(existingWatchlist.id);
      });
    });

    describe('when media is already added to watchlist', function () {
      let existingWatchlistMedia: Prisma.WatchlistMediaModel;

      beforeEach(async function () {
        const media = await prisma.media.create({
          data: mediaData,
        });

        const watchlist = await prisma.watchlist.create({
          data: {
            userId: fixtures.users.admin.id,
          },
        });

        existingWatchlistMedia = await prisma.watchlistMedia.create({
          data: {
            watchlistId: watchlist.id,
            mediaId: media.id,
            createdAt: new Date('2025-01-01'),
          },
        });
      });

      it('should return the existing watchlistMedia', async function () {
        const watchlistMedia = await watchlistService.addMedia(mediaData, fixtures.users.admin.id);

        expect(watchlistMedia).toMatchObject(existingWatchlistMedia);
      });
    });
  });
});
