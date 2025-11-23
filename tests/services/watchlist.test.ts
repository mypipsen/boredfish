import { it, describe, expect, beforeEach } from "vitest";

import { prisma, type Prisma } from "../../prisma/client.ts";
import * as watchlistService from "../../services/watchlist.ts";

import { TEST_USER } from "../fixtures";

describe("the watchlist service", function () {
  describe("when adding media to watchlist", function () {
    const data: Prisma.MediaCreateInput = {
      id: 12345,
      title: "House of the Dragon",
      description:
        "The Targaryen dynasty is at the absolute apex of its power, with more than 15 dragons under their yoke. Most empires crumble from such heights. In the case of the Targaryens, their slow fall begins when King Viserys breaks with a century of tradition by naming his daughter Rhaenyra heir to the Iron Throne. But when Viserys later fathers a son, the court is shocked when Rhaenyra retains her status as his heir, and seeds of division sow friction across the realm.",
      year: "2022",
      poster: "https://image.tmdb.org/t/p/w500/oxmdHR5Ka28HAJuMmS2hk5K6QQY.jpg",
      type: "tv",
      rating: 8.308,
      releaseDate: new Date("2022-08-21"),
    };

    it("should create the expected objects", async function () {
      const watchlistMedia = await watchlistService.addMedia(
        data,
        TEST_USER.id
      );
      const media = await prisma.media.findFirst({
        where: {
          id: 12345,
        },
      });
      const watchlist = await prisma.watchlist.findFirst({
        where: {
          userId: TEST_USER.id,
        },
      });

      expect(media).toMatchObject(data);
      expect(watchlist).toMatchObject({
        id: expect.any(Number),
        userId: TEST_USER.id,
        createdAt: expect.any(Date),
      });
      expect(watchlistMedia).toMatchObject({
        mediaId: media!.id,
        watchlistId: watchlist!.id,
        createdAt: expect.any(Date),
      });
    });
  });
});
