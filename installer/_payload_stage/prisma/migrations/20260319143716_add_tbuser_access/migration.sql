-- AlterTable
ALTER TABLE `tbuser` ADD COLUMN `authTypeUser` VARCHAR(191) NULL,
    ADD COLUMN `centrosUser` JSON NULL,
    ADD COLUMN `formulariosUser` JSON NULL,
    ADD COLUMN `statusUser` VARCHAR(191) NOT NULL DEFAULT 'ATIVO';
