-- CreateTable
CREATE TABLE `Collaboration` (
    `email` VARCHAR(191) NOT NULL,
    `testId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`email`, `testId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Collaboration` ADD CONSTRAINT `Collaboration_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Collaboration` ADD CONSTRAINT `Collaboration_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
