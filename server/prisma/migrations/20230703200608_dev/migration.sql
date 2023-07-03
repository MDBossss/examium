/*
  Warnings:

  - You are about to drop the column `lastUpdatedAt` on the `test` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `createdAt` on the `test` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE `question` MODIFY `imageUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `test` DROP COLUMN `lastUpdatedAt`,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL;
