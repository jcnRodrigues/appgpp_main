-- DropForeignKey
ALTER TABLE `tbLicenca` DROP FOREIGN KEY `tbLicenca_idFunLic_fkey`;

-- AlterTable
ALTER TABLE `tbLicenca` MODIFY `idFunLic` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `tbLicenca` ADD CONSTRAINT `tbLicenca_idFunLic_fkey` FOREIGN KEY (`idFunLic`) REFERENCES `tbFuncionario`(`idF`) ON DELETE SET NULL ON UPDATE CASCADE;
