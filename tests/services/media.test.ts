import { it, describe, expect, beforeEach } from 'vitest';

import { prisma, type Prisma } from '../../prisma/client.ts';
import * as mediaService from '../../services/media.ts';
import * as fixtures from '../fixtures.json';

describe('the media service', function () {
  describe('when getting media', function () {
    describe('with watchlist status', function () {
      it('should return the expected values', async function () {
        const media = await mediaService.getMedia(fixtures.users.admin.id, 'watchlist');
        expect(media).to.have.length(0);
      });
    });

    describe('with archived status', function () {
      it('should return the expected values', async function () {
        const media = await mediaService.getMedia(fixtures.users.admin.id, 'archived');
        // FIXME: Seed some data
        expect(media).to.have.length(0);
      });
    });
  });

  describe('when adding media', function () {
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
      const userMedia = await mediaService.addMedia(
        { ...mediaData, status: 'watchlist' },
        fixtures.users.admin.id
      );

      const media = await prisma.media.findFirst({
        where: {
          id: 12345,
        },
      });

      expect(media).toMatchObject(mediaData);
      expect(userMedia).toMatchObject({
        mediaId: media!.id,
        userId: fixtures.users.admin.id,
        status: 'watchlist',
        liked: null,
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

      it('should use existing media', async function () {
        const userMedia = await mediaService.addMedia(
          { ...mediaData, status: 'watchlist' },
          fixtures.users.admin.id
        );

        expect(userMedia.mediaId).to.equal(existingMedia.id);
      });
    });

    describe('when user media exists', function () {
      let existingUserMedia: Prisma.UserMediaModel;

      beforeEach(async function () {
        const media = await prisma.media.create({
          data: mediaData,
        });

        existingUserMedia = await prisma.userMedia.create({
          data: {
            userId: fixtures.users.admin.id,
            mediaId: media.id,
            status: 'watchlist',
            createdAt: new Date('2025-01-01'),
          },
        });
      });

      it('should return the existing watchlistMedia', async function () {
        const watchlistMedia = await mediaService.addMedia(
          { ...mediaData, status: 'watchlist' },
          fixtures.users.admin.id
        );

        expect(watchlistMedia).toMatchObject(existingUserMedia);
      });
    });
  });

  /*
  describe('when updating user media', function () {
    it('should update with expected values', async function () {});

    describe('when media does not exist', function () {
      it('should throw an error', async function () {});
    });
  });

  describe('when deleting user media', function () {
    it('should delete the media', async function () {});
  });
  */
});
