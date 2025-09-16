/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `sessionToken` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccontId` on the `tbAccont` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[emailUser]` on the table `tbUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `session_token` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerAccountId` to the `tbAccont` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- DropIndex
DROP INDEX "VerificationToken_token_key";

-- AlterTable
ALTER TABLE "tbUser" ADD COLUMN "email_verified" DATETIME;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "VerificationToken";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "VerificationTokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tbUser" ("idUser") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("expires", "id") SELECT "expires", "id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");
CREATE TABLE "new_tbAccont" (
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
    CONSTRAINT "tbAccont_userID_fkey" FOREIGN KEY ("userID") REFERENCES "tbUser" ("idUser") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_tbAccont" ("access_token", "expires_at", "idAccont", "id_token", "provider", "refresh_token", "scope", "sesseion_state", "token_type", "type", "userID") SELECT "access_token", "expires_at", "idAccont", "id_token", "provider", "refresh_token", "scope", "sesseion_state", "token_type", "type", "userID" FROM "tbAccont";
DROP TABLE "tbAccont";
ALTER TABLE "new_tbAccont" RENAME TO "tbAccont";
CREATE UNIQUE INDEX "tbAccont_provider_providerAccountId_key" ON "tbAccont"("provider", "providerAccountId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationTokens_token_key" ON "VerificationTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationTokens_identifier_token_key" ON "VerificationTokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_emailUser_key" ON "tbUser"("emailUser");
