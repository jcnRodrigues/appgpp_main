-- Remove colunas tecnicas nao usadas do ativo de rede
ALTER TABLE `tbAtivoRede`
    DROP COLUMN `vlanAtivoRede`,
    DROP COLUMN `firmwareAtivoRede`;
