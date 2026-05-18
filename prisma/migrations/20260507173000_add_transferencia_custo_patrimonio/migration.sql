-- CreateTable
CREATE TABLE `tbTransferenciaCustoPatrimonio` (
    `idTransferencia` VARCHAR(191) NOT NULL,
    `idPatrimonio` VARCHAR(191) NOT NULL,
    `idCustoOrigem` VARCHAR(191) NULL,
    `idCustoDestino` VARCHAR(191) NOT NULL,
    `valorTransferido` DOUBLE NULL,
    `observacao` VARCHAR(191) NULL,
    `idUserTransferencia` VARCHAR(191) NULL,
    `dataTransferencia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_transf_pat_data`(`idPatrimonio`, `dataTransferencia`),
    INDEX `idx_transf_origem`(`idCustoOrigem`),
    INDEX `idx_transf_destino`(`idCustoDestino`),
    INDEX `idx_transf_user`(`idUserTransferencia`),
    PRIMARY KEY (`idTransferencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbTransferenciaCustoPatrimonio` ADD CONSTRAINT `tbTransferenciaCustoPatrimonio_idPatrimonio_fkey` FOREIGN KEY (`idPatrimonio`) REFERENCES `tbPatrimonio`(`idP`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbTransferenciaCustoPatrimonio` ADD CONSTRAINT `tbTransferenciaCustoPatrimonio_idCustoOrigem_fkey` FOREIGN KEY (`idCustoOrigem`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbTransferenciaCustoPatrimonio` ADD CONSTRAINT `tbTransferenciaCustoPatrimonio_idCustoDestino_fkey` FOREIGN KEY (`idCustoDestino`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbTransferenciaCustoPatrimonio` ADD CONSTRAINT `tbTransferenciaCustoPatrimonio_idUserTransferencia_fkey` FOREIGN KEY (`idUserTransferencia`) REFERENCES `tbUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
