-- CreateTable
CREATE TABLE `tbLicenca` (
    `idLic` VARCHAR(191) NOT NULL,
    `descricaoLic` VARCHAR(191) NOT NULL,
    `dataInicioLic` DATETIME(3) NOT NULL,
    `dataVencLic` DATETIME(3) NOT NULL,
    `idFunLic` VARCHAR(191) NOT NULL,

    INDEX `tbLicenca_idFunLic_idx`(`idFunLic`),
    PRIMARY KEY (`idLic`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbLicenca` ADD CONSTRAINT `tbLicenca_idFunLic_fkey` FOREIGN KEY (`idFunLic`) REFERENCES `tbFuncionario`(`idF`) ON DELETE RESTRICT ON UPDATE CASCADE;
