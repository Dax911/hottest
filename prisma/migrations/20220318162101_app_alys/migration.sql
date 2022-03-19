/*
  Warnings:

  - You are about to drop the column `overflow` on the `Nft` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Nft` DROP COLUMN `overflow`,
    MODIFY `owner` VARCHAR(191) NULL DEFAULT 'Alice and Bob';
