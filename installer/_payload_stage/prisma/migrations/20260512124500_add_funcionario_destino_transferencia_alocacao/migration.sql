ALTER TABLE `tbTransferenciaAlocacao`
  ADD COLUMN `idMatriculaFuncionarioDestino` VARCHAR(191) NULL;

CREATE INDEX `idx_transf_aloc_func_destino`
  ON `tbTransferenciaAlocacao`(`idMatriculaFuncionarioDestino`);

ALTER TABLE `tbTransferenciaAlocacao`
  ADD CONSTRAINT `tbTransferenciaAlocacao_idMatriculaFuncionarioDestino_fkey`
  FOREIGN KEY (`idMatriculaFuncionarioDestino`) REFERENCES `tbFuncionario`(`idMatFun`)
  ON DELETE SET NULL ON UPDATE CASCADE;
