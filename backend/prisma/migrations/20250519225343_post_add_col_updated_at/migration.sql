/*
  Warnings:

  - Added the required column `updatedAt` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "mood" DROP NOT NULL,
ALTER COLUMN "intensity" DROP NOT NULL,
ALTER COLUMN "emoji" DROP NOT NULL,
ALTER COLUMN "templateId" DROP NOT NULL,
ALTER COLUMN "privacyJson" DROP NOT NULL,
ALTER COLUMN "minFollowDays" DROP NOT NULL;
