-- AlterTable
ALTER TABLE `tbAtivoRede`
    ADD COLUMN `idFornecedorAtivoRede` VARCHAR(191) NULL,
    ADD INDEX `idx_ativo_rede_fornecedor_fk`(`idFornecedorAtivoRede`);

-- AddForeignKey
ALTER TABLE `tbAtivoRede`
    ADD CONSTRAINT `tbAtivoRede_idFornecedorAtivoRede_fkey`
    FOREIGN KEY (`idFornecedorAtivoRede`) REFERENCES `tbFornecedor`(`idFornecedor`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
