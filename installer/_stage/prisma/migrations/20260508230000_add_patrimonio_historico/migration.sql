CREATE TABLE `tbPatrimonioHistorico` (
    `idHistorico` VARCHAR(191) NOT NULL,
    `idPatrimonioOriginal` VARCHAR(191) NOT NULL,
    `idPat` VARCHAR(191) NOT NULL,
    `descricaoPat` VARCHAR(191) NOT NULL,
    `valorPat` DOUBLE NOT NULL,
    `dataEntPat` DATETIME(3) NOT NULL,
    `dataSaiPat` DATETIME(3) NULL,
    `notaFiscalPat` VARCHAR(191) NULL,
    `idPat_TipoPat` VARCHAR(191) NULL,
    `idPat_StatusPat` VARCHAR(191) NULL,
    `idPat_CustoPat` VARCHAR(191) NULL,
    `dataDevolucao` DATETIME(3) NULL,
    `motivoDevolucao` VARCHAR(191) NULL,
    `notaFiscalDevolucao` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_hist_pat_original`(`idPatrimonioOriginal`),
    INDEX `idx_hist_created_at`(`createdAt`),
    PRIMARY KEY (`idHistorico`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `tbPatrimonioHistorico` ADD CONSTRAINT `tbPatrimonioHistorico_idPatrimonioOriginal_fkey` FOREIGN KEY (`idPatrimonioOriginal`) REFERENCES `tbPatrimonio`(`idP`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `tbPatrimonioHistorico` ADD CONSTRAINT `tbPatrimonioHistorico_idPat_TipoPat_fkey` FOREIGN KEY (`idPat_TipoPat`) REFERENCES `tbTipoPat`(`idTipPat`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tbPatrimonioHistorico` ADD CONSTRAINT `tbPatrimonioHistorico_idPat_StatusPat_fkey` FOREIGN KEY (`idPat_StatusPat`) REFERENCES `tbStatusPat`(`idStatusPat`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `tbPatrimonioHistorico` ADD CONSTRAINT `tbPatrimonioHistorico_idPat_CustoPat_fkey` FOREIGN KEY (`idPat_CustoPat`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE SET NULL ON UPDATE CASCADE;
