-- AlterTable
ALTER TABLE `tbFuncao`
    ADD COLUMN `codigoFuncao` INTEGER NOT NULL AUTO_INCREMENT,
    ADD UNIQUE INDEX `tbFuncao_codigoFuncao_key`(`codigoFuncao`);

-- Set starting value for auto increment sequence
ALTER TABLE `tbFuncao` AUTO_INCREMENT = 100;
