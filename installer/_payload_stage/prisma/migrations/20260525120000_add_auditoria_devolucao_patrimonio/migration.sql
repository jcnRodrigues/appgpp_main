-- CreateTable
CREATE TABLE `tbAuditoriaDevolucaoPatrimonio` (
  `idAuditoria` VARCHAR(191) NOT NULL,
  `idPatrimonioRef` VARCHAR(191) NOT NULL,
  `idPat` VARCHAR(191) NOT NULL,
  `statusAnterior` VARCHAR(191) NULL,
  `statusNovo` VARCHAR(191) NULL,
  `limpezaSolicitada` BOOLEAN NOT NULL DEFAULT false,
  `registrosRemovidos` INTEGER NOT NULL DEFAULT 0,
  `idUserAcao` VARCHAR(191) NULL,
  `emailUserAcao` VARCHAR(191) NULL,
  `observacao` TEXT NULL,
  `detalhesJson` JSON NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

  PRIMARY KEY (`idAuditoria`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `idx_aud_dev_pat_data` ON `tbAuditoriaDevolucaoPatrimonio`(`idPatrimonioRef`, `createdAt`);

-- CreateIndex
CREATE INDEX `idx_aud_dev_idpat` ON `tbAuditoriaDevolucaoPatrimonio`(`idPat`);

-- CreateIndex
CREATE INDEX `idx_aud_dev_user` ON `tbAuditoriaDevolucaoPatrimonio`(`idUserAcao`);

-- AddForeignKey
ALTER TABLE `tbAuditoriaDevolucaoPatrimonio`
  ADD CONSTRAINT `tbAuditoriaDevolucaoPatrimonio_idPatrimonioRef_fkey`
  FOREIGN KEY (`idPatrimonioRef`) REFERENCES `tbPatrimonio`(`idP`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbAuditoriaDevolucaoPatrimonio`
  ADD CONSTRAINT `tbAuditoriaDevolucaoPatrimonio_idUserAcao_fkey`
  FOREIGN KEY (`idUserAcao`) REFERENCES `tbUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
