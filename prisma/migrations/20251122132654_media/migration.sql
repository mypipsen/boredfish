-- CreateTable
CREATE TABLE "media" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rating" REAL NOT NULL,
    "releaseDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "watchlist" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "watchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "archive" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "archive_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "watchlist_media" (
    "mediaId" INTEGER NOT NULL,
    "watchlistId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("mediaId", "watchlistId"),
    CONSTRAINT "watchlist_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "watchlist_media_watchlistId_fkey" FOREIGN KEY ("watchlistId") REFERENCES "watchlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "archive_media" (
    "mediaId" INTEGER NOT NULL,
    "archiveId" INTEGER NOT NULL,
    "liked" BOOLEAN NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("mediaId", "archiveId"),
    CONSTRAINT "archive_media_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "media" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "archive_media_archiveId_fkey" FOREIGN KEY ("archiveId") REFERENCES "archive" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
