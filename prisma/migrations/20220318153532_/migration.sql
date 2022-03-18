/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Nft` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Nft_id_key` ON `Nft`(`id`);
