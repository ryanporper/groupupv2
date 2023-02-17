/*
  Warnings:

  - You are about to drop the column `eventDate` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "eventDate",
DROP COLUMN "location",
DROP COLUMN "media",
DROP COLUMN "price";
