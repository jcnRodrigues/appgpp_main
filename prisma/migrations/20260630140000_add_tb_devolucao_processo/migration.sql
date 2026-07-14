-- CreateTable
CREATE TABLE `tbDevolucaoProcesso` (
    `idDevolucaoProcesso` VARCHAR(191) NOT NULL,
    `codigoDevolucao` VARCHAR(191) NOT NULL,
    `mesDevolucao` INTEGER NOT NULL,
    `anoDevolucao` INTEGER NOT NULL,
    `contadorDevolucao` INTEGER NOT NULL,
    `statusDevolucao` VARCHAR(191) NOT NULL DEFAULT 'ABERTO',
    `dataInicio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `dataFechamento` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbDevolucaoProcesso_codigoDevolucao_key`(`codigoDevolucao`),
    INDEX `idx_dev_processo_seq`(`anoDevolucao`, `mesDevolucao`, `contadorDevolucao`),
    INDEX `idx_dev_processo_status`(`statusDevolucao`),
    PRIMARY KEY (`idDevolucaoProcesso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
