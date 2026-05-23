CREATE TABLE `tbTransferenciaAlocacao` (
    `idTransferenciaAlocacao` VARCHAR(191) NOT NULL,
    `idCadastro` VARCHAR(191) NOT NULL,
    `idPatrimonio` VARCHAR(191) NOT NULL,
    `idMatriculaFuncionario` VARCHAR(191) NULL,
    `statusAnterior` VARCHAR(191) NULL,
    `statusNovo` VARCHAR(191) NOT NULL,
    `observacao` TEXT NULL,
    `idUserTransferencia` VARCHAR(191) NULL,
    `dataTransferencia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_transf_aloc_cadastro_data`(`idCadastro`, `dataTransferencia`),
    INDEX `idx_transf_aloc_patrimonio`(`idPatrimonio`),
    INDEX `idx_transf_aloc_func`(`idMatriculaFuncionario`),
    INDEX `idx_transf_aloc_user`(`idUserTransferencia`),
    PRIMARY KEY (`idTransferenciaAlocacao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `tbTransferenciaAlocacao`
    ADD CONSTRAINT `tbTransferenciaAlocacao_idCadastro_fkey`
    FOREIGN KEY (`idCadastro`) REFERENCES `tbCadastro`(`idCad`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbTransferenciaAlocacao`
    ADD CONSTRAINT `tbTransferenciaAlocacao_idPatrimonio_fkey`
    FOREIGN KEY (`idPatrimonio`) REFERENCES `tbPatrimonio`(`idPat`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbTransferenciaAlocacao`
    ADD CONSTRAINT `tbTransferenciaAlocacao_idMatriculaFuncionario_fkey`
    FOREIGN KEY (`idMatriculaFuncionario`) REFERENCES `tbFuncionario`(`idMatFun`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbTransferenciaAlocacao`
    ADD CONSTRAINT `tbTransferenciaAlocacao_idUserTransferencia_fkey`
    FOREIGN KEY (`idUserTransferencia`) REFERENCES `tbUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
