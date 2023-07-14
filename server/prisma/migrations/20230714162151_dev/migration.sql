/*
  Warnings:

  - You are about to drop the `collaboration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `collaboration` DROP FOREIGN KEY `Collaboration_email_fkey`;

-- DropForeignKey
ALTER TABLE `collaboration` DROP FOREIGN KEY `Collaboration_testId_fkey`;

-- DropTable
DROP TABLE `collaboration`;

-- CreateTable
CREATE TABLE `_collaborator` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_collaborator_AB_unique`(`A`, `B`),
    INDEX `_collaborator_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_collaborator` ADD CONSTRAINT `_collaborator_A_fkey` FOREIGN KEY (`A`) REFERENCES `Test`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_collaborator` ADD CONSTRAINT `_collaborator_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
