/*
  Warnings:

  - You are about to drop the column `consoleId` on the `tbunificonfig` table. All the data in the column will be lost.
  - You are about to drop the column `siteId` on the `tbunificonfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `tbunificonfig` DROP COLUMN `consoleId`,
    DROP COLUMN `siteId`;
