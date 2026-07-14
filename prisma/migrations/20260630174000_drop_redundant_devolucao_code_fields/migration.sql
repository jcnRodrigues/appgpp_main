-- Remove campos redundantes de código da tbDevolucao; a referência oficial fica em tbDevolucaoProcesso
SET @idx_exists := (
  SELECT COUNT(*)
  FROM information_schema.statistics
  WHERE table_schema = DATABASE()
    AND table_name = 'tbDevolucao'
    AND index_name = 'idx_devolucao_codigo_seq'
);

SET @sql := IF(
  @idx_exists > 0,
  'DROP INDEX `idx_devolucao_codigo_seq` ON `tbDevolucao`',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE `tbDevolucao`
  DROP FOREIGN KEY `tbDevolucao_idDevolucaoProcesso_fkey`,
  DROP COLUMN `codigoDevolucao`,
  DROP COLUMN `mesDevolucao`,
  DROP COLUMN `anoDevolucao`,
  DROP COLUMN `contadorDevolucao`;

ALTER TABLE `tbDevolucao`
  ADD CONSTRAINT `tbDevolucao_idDevolucaoProcesso_fkey`
  FOREIGN KEY (`idDevolucaoProcesso`) REFERENCES `tbDevolucaoProcesso`(`idDevolucaoProcesso`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
