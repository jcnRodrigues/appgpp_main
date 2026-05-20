CREATE TABLE `tbBmMedicao` (
  `idBm` VARCHAR(191) NOT NULL,
  `codigoBm` VARCHAR(191) NOT NULL,
  `idCCusto` VARCHAR(191) NOT NULL,
  `codigoCCusto` VARCHAR(191) NULL,
  `descricaoCCusto` VARCHAR(191) NULL,
  `mesBm` INTEGER NOT NULL,
  `anoBm` INTEGER NOT NULL,
  `contadorBm` INTEGER NOT NULL,
  `statusBm` VARCHAR(191) NOT NULL DEFAULT 'ABERTO',
  `dataInicioMedicao` DATETIME(3) NOT NULL,
  `dataFimMedicao` DATETIME(3) NOT NULL,
  `resumoJson` JSON NULL,
  `resultadosJson` JSON NULL,
  `naoInformadosJson` JSON NULL,
  `gerouRelatorioExcel` BOOLEAN NOT NULL DEFAULT false,
  `gerouRelatorioPdf` BOOLEAN NOT NULL DEFAULT false,
  `idUserGeracao` VARCHAR(191) NULL,
  `fechadoAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `tbBmMedicao_codigoBm_key`(`codigoBm`),
  INDEX `idx_bm_ccusto_status`(`idCCusto`, `statusBm`),
  INDEX `idx_bm_ccusto_comp`(`idCCusto`, `anoBm`, `mesBm`, `contadorBm`),
  INDEX `idx_bm_created_at`(`createdAt`),
  PRIMARY KEY (`idBm`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `tbBmMedicao`
  ADD CONSTRAINT `tbBmMedicao_idCCusto_fkey`
  FOREIGN KEY (`idCCusto`) REFERENCES `tbCCusto`(`idCCusto`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `tbBmMedicao`
  ADD CONSTRAINT `tbBmMedicao_idUserGeracao_fkey`
  FOREIGN KEY (`idUserGeracao`) REFERENCES `tbUser`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
