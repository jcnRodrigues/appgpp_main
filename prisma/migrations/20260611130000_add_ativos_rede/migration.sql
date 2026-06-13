-- CreateTable
CREATE TABLE `tbAtivoRede` (
    `idAtivoRedePk` VARCHAR(191) NOT NULL,
    `codigoAtivoRede` VARCHAR(191) NOT NULL,
    `nomeAtivoRede` VARCHAR(191) NOT NULL,
    `descricaoAtivoRede` VARCHAR(191) NULL,
    `tipoAtivoRede` VARCHAR(191) NOT NULL,
    `fabricanteAtivoRede` VARCHAR(191) NULL,
    `modeloAtivoRede` VARCHAR(191) NULL,
    `serialAtivoRede` VARCHAR(191) NULL,
    `macAtivoRede` VARCHAR(191) NULL,
    `ipGerenciamentoAtivoRede` VARCHAR(191) NULL,
    `hostnameAtivoRede` VARCHAR(191) NULL,
    `localInstalacaoAtivoRede` VARCHAR(191) NULL,
    `rackAtivoRede` VARCHAR(191) NULL,
    `portaSwitchAtivoRede` VARCHAR(191) NULL,
    `vlanAtivoRede` INT NULL,
    `firmwareAtivoRede` VARCHAR(191) NULL,
    `dataEntradaAtivoRede` DATETIME(3) NOT NULL,
    `dataInstalacaoAtivoRede` DATETIME(3) NULL,
    `statusAtivoRede` VARCHAR(191) NOT NULL DEFAULT 'ATIVO',
    `centroResponsavelAtivoRede` VARCHAR(191) NULL,
    `observacaoAtivoRede` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbAtivoRede_codigoAtivoRede_key`(`codigoAtivoRede`),
    INDEX `idx_ativo_rede_codigo`(`codigoAtivoRede`),
    INDEX `idx_ativo_rede_tipo`(`tipoAtivoRede`),
    INDEX `idx_ativo_rede_status`(`statusAtivoRede`),
    INDEX `idx_ativo_rede_local`(`localInstalacaoAtivoRede`),
    PRIMARY KEY (`idAtivoRedePk`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbTransferenciaAtivoRede` (
    `idTransferenciaAtivoRede` VARCHAR(191) NOT NULL,
    `idAtivoRede` VARCHAR(191) NOT NULL,
    `localOrigemAtivoRede` VARCHAR(191) NULL,
    `localDestinoAtivoRede` VARCHAR(191) NULL,
    `centroOrigemAtivoRede` VARCHAR(191) NULL,
    `centroDestinoAtivoRede` VARCHAR(191) NULL,
    `statusAnteriorAtivoRede` VARCHAR(191) NULL,
    `statusNovoAtivoRede` VARCHAR(191) NULL,
    `observacao` VARCHAR(191) NULL,
    `idUserTransferencia` VARCHAR(191) NULL,
    `dataTransferencia` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_transf_ativo_rede_data`(`idAtivoRede`, `dataTransferencia`),
    INDEX `idx_transf_ativo_rede_user`(`idUserTransferencia`),
    PRIMARY KEY (`idTransferenciaAtivoRede`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbDevolucaoAtivoRede` (
    `idDevolucaoAtivoRede` VARCHAR(191) NOT NULL,
    `idAtivoRede` VARCHAR(191) NOT NULL,
    `dataInicioDevolucao` DATETIME(3) NOT NULL,
    `dataFimDevolucao` DATETIME(3) NULL,
    `motivoDevolucao` VARCHAR(191) NULL,
    `destinoDevolucao` VARCHAR(191) NULL,
    `notaFiscalDevolucao` VARCHAR(191) NULL,
    `observacao` VARCHAR(191) NULL,
    `idUserDevolucao` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `idx_dev_ativo_rede_data`(`idAtivoRede`, `dataInicioDevolucao`),
    INDEX `idx_dev_ativo_rede_user`(`idUserDevolucao`),
    PRIMARY KEY (`idDevolucaoAtivoRede`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbTransferenciaAtivoRede` ADD CONSTRAINT `tbTransferenciaAtivoRede_idAtivoRede_fkey` FOREIGN KEY (`idAtivoRede`) REFERENCES `tbAtivoRede`(`idAtivoRedePk`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbTransferenciaAtivoRede` ADD CONSTRAINT `tbTransferenciaAtivoRede_idUserTransferencia_fkey` FOREIGN KEY (`idUserTransferencia`) REFERENCES `tbUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbDevolucaoAtivoRede` ADD CONSTRAINT `tbDevolucaoAtivoRede_idAtivoRede_fkey` FOREIGN KEY (`idAtivoRede`) REFERENCES `tbAtivoRede`(`idAtivoRedePk`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbDevolucaoAtivoRede` ADD CONSTRAINT `tbDevolucaoAtivoRede_idUserDevolucao_fkey` FOREIGN KEY (`idUserDevolucao`) REFERENCES `tbUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
