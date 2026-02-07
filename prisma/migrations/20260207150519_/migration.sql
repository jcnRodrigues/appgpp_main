/*
  Warnings:

  - You are about to drop the `tbAccont` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tbAccont";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Accont" (
    "idAccont" TEXT NOT NULL PRIMARY KEY,
    "userID" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "sesseion_state" TEXT,
    CONSTRAINT "Accont_userID_fkey" FOREIGN KEY ("userID") REFERENCES "tbUser" ("idUser") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Accont_provider_providerAccountId_key" ON "Accont"("provider", "providerAccountId");
