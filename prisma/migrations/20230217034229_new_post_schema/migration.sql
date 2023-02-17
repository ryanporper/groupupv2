/*
  Warnings:

  - Added the required column `description` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "eventDate" DATE NOT NULL,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "media" TEXT,
ADD COLUMN     "price" INTEGER;
