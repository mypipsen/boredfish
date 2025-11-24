import { it, describe, expect } from 'vitest';

import { prisma } from '../../prisma/client.ts';
import * as mediaService from '../../services/media.ts';
import * as fixtures from '../fixtures.json';

describe('the media service', function () {
  describe('when getting media', function () {
    describe('with watchlist status', function () {
      it('should return the expected values', async function () {
        const media = await mediaService.getMedia(fixtures.users.admin.id, 'watchlist');

        expect(media).to.have.length(1);
        expect(media).toEqual(
          expect.arrayContaining([
            {
              id: fixtures.media.lotrRohirrim.id,
              title: 'The Lord of the Rings: The War of the Rohirrim',
              description:
                'A sudden attack by Wulf, a lord seeking vengeance, forces Helm Hammerhand and his people to make a daring last stand in the Hornburg.',
              year: '2024',
              poster: 'https://image.tmdb.org/t/p/w500/hE9SAMyMSUGAPsHUGdyl6irv11v.jpg',
              type: 'movie',
              rating: 6.57,
              releaseDate: new Date('2024-12-05T00:00:00.000Z'),
              liked: null,
              status: 'watchlist',
              createdAt: expect.any(Date),
            },
          ])
        );
      });
    });

    describe('with archived status', function () {
      it('should return the expected values', async function () {
        const media = await mediaService.getMedia(fixtures.users.admin.id, 'archived');

        expect(media).to.have.length(3);
        expect(media).toEqual(
          expect.arrayContaining([
            {
              id: fixtures.media.lotrFellowship.id,
              title: 'The Lord of the Rings: The Fellowship of the Ring',
              description:
                'Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.',
              year: '2001',
              poster: 'https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
              type: 'movie',
              rating: 8.426,
              releaseDate: new Date('2001-12-18T00:00:00.000Z'),
              liked: true,
              status: 'archived',
              createdAt: expect.any(Date),
            },
            {
              id: fixtures.media.lotrTwoTowers.id,
              title: 'The Lord of the Rings: The Two Towers',
              description:
                'Frodo Baggins and the other members of the Fellowship continue their quest to destroy the One Ring, their destinies lie at two towers. Saruman and Sauron await while Frodo and Sam trek to Mordor.',
              year: '2002',
              poster: 'https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg',
              type: 'movie',
              rating: 8.411,
              releaseDate: new Date('2002-12-18T00:00:00.000Z'),
              liked: true,
              status: 'archived',
              createdAt: expect.any(Date),
            },
            {
              id: fixtures.media.lotrReturnKing.id,
              title: 'The Lord of the Rings: The Return of the King',
              description:
                'As armies mass for a final battle that will decide the fate of the world, one member of the Fellowship is revealed as the noble heir to the throne of Men. Yet, the sole hope for triumph over evil lies with Frodo, who, accompanied by Sam and Gollum, ventures deep into Mordor on his quest to destroy the Ring of Power.',
              year: '2003',
              poster: 'https://image.tmdb.org/t/p/w500/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg',
              type: 'movie',
              rating: 8.49,
              releaseDate: new Date('2003-12-17T00:00:00.000Z'),
              liked: true,
              status: 'archived',
              createdAt: expect.any(Date),
            },
          ])
        );
      });
    });
  });

  describe('when adding media', function () {
    it('should create the expected objects', async function () {
      const userMedia = await mediaService.addMedia(
        {
          id: 94997,
          title: 'House of the Dragon',
          description:
            'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne. But when Viserys later fathers a son, the court is shocked when Rhaenyra retains her status as his heir, and seeds of division sow friction across the realm.',
          year: '2022',
          poster: 'https://image.tmdb.org/t/p/w500/oxmdHR5Ka28HAJuMmS2hk5K6QQY.jpg',
          type: 'tv',
          rating: 8.308,
          releaseDate: new Date('2022-08-21'),
          status: 'watchlist',
        },
        fixtures.users.admin.id
      );

      const media = await prisma.media.findFirst({
        where: {
          id: 94997,
        },
      });

      expect(media).toMatchObject({
        id: 94997,
        title: 'House of the Dragon',
        description:
          'The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne. But when Viserys later fathers a son, the court is shocked when Rhaenyra retains her status as his heir, and seeds of division sow friction across the realm.',
        year: '2022',
        poster: 'https://image.tmdb.org/t/p/w500/oxmdHR5Ka28HAJuMmS2hk5K6QQY.jpg',
        type: 'tv',
        rating: 8.308,
        releaseDate: new Date('2022-08-21'),
      });

      expect(userMedia).toMatchObject({
        mediaId: media!.id,
        userId: fixtures.users.admin.id,
        status: 'watchlist',
        liked: null,
        createdAt: expect.any(Date),
      });
    });

    describe('when media exists', function () {
      it('should use existing media', async function () {
        const existingMedia = await prisma.media.findFirstOrThrow({
          where: {
            id: fixtures.media.lotrFellowship.id,
          },
        });

        const userMedia = await mediaService.addMedia(
          {
            id: existingMedia.id,
            title: existingMedia.title,
            description: existingMedia.title,
            year: existingMedia.year,
            poster: existingMedia.poster,
            type: existingMedia.type,
            rating: existingMedia.rating,
            releaseDate: existingMedia.releaseDate,
            status: 'watchlist',
          },
          fixtures.users.admin.id
        );

        expect(userMedia.mediaId).to.equal(existingMedia.id);
      });
    });

    describe('when user media exists', function () {
      it('should return the existing watchlistMedia', async function () {
        const existingMedia = await prisma.media.findFirstOrThrow({
          where: {
            id: fixtures.media.lotrFellowship.id,
          },
        });

        const watchlistMedia = await mediaService.addMedia(
          {
            id: existingMedia.id,
            title: existingMedia.title,
            description: existingMedia.title,
            year: existingMedia.year,
            poster: existingMedia.poster,
            type: existingMedia.type,
            rating: existingMedia.rating,
            releaseDate: existingMedia.releaseDate,
            status: 'watchlist',
          },
          fixtures.users.admin.id
        );

        expect(watchlistMedia.userId).to.equal(fixtures.users.admin.id);
        expect(watchlistMedia.mediaId).to.equal(fixtures.media.lotrFellowship.id);
      });
    });
  });

  describe('when updating user media', function () {
    it('should update with expected values', async function () {
      const updatedUserMedia = await mediaService.updateMedia(
        fixtures.media.lotrFellowship.id,
        {
          status: 'archived',
          liked: false,
        },
        fixtures.users.admin.id
      );

      expect(updatedUserMedia).toMatchObject({
        mediaId: fixtures.media.lotrFellowship.id,
        userId: fixtures.users.admin.id,
        status: 'archived',
        liked: false,
      });
    });

    describe('when media does not exist', function () {
      it('should throw an error', async function () {
        await expect(
          mediaService.updateMedia(
            999999,
            {
              status: 'watchlist',
            },
            fixtures.users.admin.id
          )
        ).rejects.toMatchObject({
          status: 404,
          message: 'Not found',
        });
      });
    });
  });

  describe('when deleting user media', function () {
    it('should delete the media', async function () {
      const deletedUserMedia = await mediaService.deleteMedia(
        fixtures.media.lotrFellowship.id,
        fixtures.users.admin.id
      );

      expect(deletedUserMedia).toMatchObject({
        mediaId: fixtures.media.lotrFellowship.id,
        userId: fixtures.users.admin.id,
      });

      const userMedia = await prisma.userMedia.findUnique({
        where: {
          userId_mediaId: {
            userId: fixtures.users.admin.id,
            mediaId: fixtures.media.lotrFellowship.id,
          },
        },
      });

      expect(userMedia).toBeNull();
    });
  });
});
