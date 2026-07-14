ALTER TABLE `tbDevolucao`
  ADD COLUMN `codigoDevolucao` VARCHAR(191) NULL,
  ADD COLUMN `mesDevolucao` INT NULL,
  ADD COLUMN `anoDevolucao` INT NULL,
  ADD COLUMN `contadorDevolucao` INT NULL;
CREATE INDEX `idx_devolucao_codigo_seq` ON `tbDevolucao`(`anoDevolucao`, `mesDevolucao`, `contadorDevolucao`);
