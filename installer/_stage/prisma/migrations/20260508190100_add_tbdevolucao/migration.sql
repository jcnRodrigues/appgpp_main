CREATE TABLE `tbDevolucao` (
    `idDevolucao` VARCHAR(191) NOT NULL,
    `idPatrimonio` VARCHAR(191) NOT NULL,
    `idCadastro` VARCHAR(191) NULL,
    `dataInicioDevolucao` DATETIME(3) NOT NULL,
    `dataFimDevolucao` DATETIME(3) NULL,
    `motivoDevolucao` VARCHAR(191) NULL,
    `notaFiscalDevolucao` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_devolucao_pat_inicio`(`idPatrimonio`, `dataInicioDevolucao`),
    INDEX `idx_devolucao_cadastro`(`idCadastro`),
    PRIMARY KEY (`idDevolucao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `tbDevolucao` ADD CONSTRAINT `tbDevolucao_idPatrimonio_fkey` FOREIGN KEY (`idPatrimonio`) REFERENCES `tbPatrimonio`(`idPat`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tbDevolucao` ADD CONSTRAINT `tbDevolucao_idCadastro_fkey` FOREIGN KEY (`idCadastro`) REFERENCES `tbCadastro`(`idCad`) ON DELETE SET NULL ON UPDATE CASCADE;
