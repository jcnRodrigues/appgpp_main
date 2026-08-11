-- CreateTable
CREATE TABLE `tbFornecedor` (
    `idFornecedor` VARCHAR(191) NOT NULL,
    `razaoSocialFornecedor` VARCHAR(191) NOT NULL,
    `nomeFantasiaFornecedor` VARCHAR(191) NULL,
    `cnpjFornecedor` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbFornecedor_cnpjFornecedor_key`(`cnpjFornecedor`),
    PRIMARY KEY (`idFornecedor`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbFornecedorCCusto` (
    `idFornecedorCCusto` VARCHAR(191) NOT NULL,
    `idFornecedor` VARCHAR(191) NOT NULL,
    `idCCusto` VARCHAR(191) NOT NULL,
    `ehPrincipal` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `uq_fornecedor_ccusto`(`idFornecedor`, `idCCusto`),
    INDEX `idx_fornecedor_ccusto_fornecedor`(`idFornecedor`),
    INDEX `idx_fornecedor_ccusto_ccusto`(`idCCusto`),
    PRIMARY KEY (`idFornecedorCCusto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbFornecedorCCusto` ADD CONSTRAINT `tbFornecedorCCusto_idFornecedor_fkey` FOREIGN KEY (`idFornecedor`) REFERENCES `tbFornecedor`(`idFornecedor`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbFornecedorCCusto` ADD CONSTRAINT `tbFornecedorCCusto_idCCusto_fkey` FOREIGN KEY (`idCCusto`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE CASCADE ON UPDATE CASCADE;
