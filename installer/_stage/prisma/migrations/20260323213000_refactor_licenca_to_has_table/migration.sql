-- DropForeignKey
ALTER TABLE `tbLicenca` DROP FOREIGN KEY `tbLicenca_idFunLic_fkey`;

-- CreateTable
CREATE TABLE `has_` (
    `id_has` VARCHAR(191) NOT NULL,
    `idfunc` VARCHAR(191) NOT NULL,
    `idLinc` VARCHAR(191) NOT NULL,
    `datainicio` DATETIME(3) NOT NULL,
    `datavencimetno` DATETIME(3) NOT NULL,

    UNIQUE INDEX `has__idfunc_idLinc_key`(`idfunc`, `idLinc`),
    INDEX `has__idfunc_idx`(`idfunc`),
    INDEX `has__idLinc_idx`(`idLinc`),
    PRIMARY KEY (`id_has`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Migrate existing links from tbLicenca to has_
INSERT INTO `has_` (`id_has`, `idfunc`, `idLinc`, `datainicio`, `datavencimetno`)
SELECT UUID(), `idFunLic`, `idLic`, `dataInicioLic`, `dataVencLic`
FROM `tbLicenca`
WHERE `idFunLic` IS NOT NULL;

-- DropIndex
DROP INDEX `tbLicenca_idFunLic_idx` ON `tbLicenca`;

-- AlterTable
ALTER TABLE `tbLicenca`
    DROP COLUMN `dataInicioLic`,
    DROP COLUMN `dataVencLic`,
    DROP COLUMN `idFunLic`;

-- AddForeignKey
ALTER TABLE `has_` ADD CONSTRAINT `has__idfunc_fkey` FOREIGN KEY (`idfunc`) REFERENCES `tbFuncionario`(`idF`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `has_` ADD CONSTRAINT `has__idLinc_fkey` FOREIGN KEY (`idLinc`) REFERENCES `tbLicenca`(`idLic`) ON DELETE CASCADE ON UPDATE CASCADE;
