ALTER TABLE `tbUnifiConfig`
ADD COLUMN `identitySource` VARCHAR(191) NULL DEFAULT 'UNIFI' AFTER `publicUrl`,
ADD COLUMN `identitySourceNotes` TEXT NULL AFTER `identitySource`;
