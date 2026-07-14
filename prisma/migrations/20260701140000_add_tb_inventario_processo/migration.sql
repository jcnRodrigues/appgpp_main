CREATE TABLE `tbInventarioProcesso` (
  `idInventarioProcesso` VARCHAR(191) NOT NULL,
  `codigoInventario` VARCHAR(191) NOT NULL,
  `idCCusto` VARCHAR(191) NULL,
  `codigoCCusto` VARCHAR(191) NULL,
  `descricaoCCusto` VARCHAR(191) NULL,
  `mesInventario` INTEGER NOT NULL,
  `anoInventario` INTEGER NOT NULL,
  `contadorInventario` INTEGER NOT NULL,
  `statusInventario` VARCHAR(191) NOT NULL DEFAULT 'ABERTO',
  `dataInventario` DATETIME(3) NOT NULL,
  `dataFechamento` DATETIME(3) NULL,
  `responsavelInventario` VARCHAR(191) NULL,
  `localInventario` VARCHAR(191) NULL,
  `observacaoInventario` VARCHAR(191) NULL,
  `resumoJson` JSON NULL,
  `itensJson` JSON NULL,
  `idUserInventario` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,

  UNIQUE INDEX `tbInventarioProcesso_codigoInventario_key`(`codigoInventario`),
  INDEX `idx_inv_ccusto_status`(`idCCusto`, `statusInventario`),
  INDEX `idx_inv_seq`(`anoInventario`, `mesInventario`, `contadorInventario`),
  INDEX `idx_inv_created_at`(`createdAt`),
  PRIMARY KEY (`idInventarioProcesso`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `tbInventarioProcesso`
  ADD CONSTRAINT `tbInventarioProcesso_idCCusto_fkey`
  FOREIGN KEY (`idCCusto`) REFERENCES `tbCCusto`(`idCCusto`)
  ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `tbInventarioProcesso`
  ADD CONSTRAINT `tbInventarioProcesso_idUserInventario_fkey`
  FOREIGN KEY (`idUserInventario`) REFERENCES `tbUser`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
