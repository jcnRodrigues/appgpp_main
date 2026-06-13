-- CreateTable
CREATE TABLE `tbTipoAtivoRede` (
    `idTipoAtivoRede` VARCHAR(191) NOT NULL,
    `descricaoTipoAtivoRede` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbTipoAtivoRede_descricaoTipoAtivoRede_key`(`descricaoTipoAtivoRede`),
    PRIMARY KEY (`idTipoAtivoRede`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbStatusAtivoRede` (
    `idStatusAtivoRede` VARCHAR(191) NOT NULL,
    `descricaoStatusAtivoRede` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbStatusAtivoRede_descricaoStatusAtivoRede_key`(`descricaoStatusAtivoRede`),
    PRIMARY KEY (`idStatusAtivoRede`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed lookup data
INSERT IGNORE INTO `tbTipoAtivoRede` (`idTipoAtivoRede`, `descricaoTipoAtivoRede`) VALUES
    (UUID(), 'ROTEADOR'),
    (UUID(), 'SWITCH'),
    (UUID(), 'ACCESS POINT'),
    (UUID(), 'FIREWALL'),
    (UUID(), 'MODEM'),
    (UUID(), 'CONTROLADORA'),
    (UUID(), 'BRIDGE'),
    (UUID(), 'SFP / TRANSCEIVER'),
    (UUID(), 'PATCH PANEL'),
    (UUID(), 'OUTRO');

INSERT IGNORE INTO `tbStatusAtivoRede` (`idStatusAtivoRede`, `descricaoStatusAtivoRede`) VALUES
    (UUID(), 'ATIVO'),
    (UUID(), 'RESERVA'),
    (UUID(), 'EM MANUTENCAO'),
    (UUID(), 'EM ESTOQUE'),
    (UUID(), 'TRANSFERIDO'),
    (UUID(), 'DEVOLVIDO'),
    (UUID(), 'DESATIVADO');

-- AlterTable
ALTER TABLE `tbAtivoRede`
    ADD COLUMN `idTipoAtivoRede` VARCHAR(191) NULL AFTER `tipoAtivoRede`,
    ADD COLUMN `idStatusAtivoRede` VARCHAR(191) NULL AFTER `statusAtivoRede`,
    ADD COLUMN `idCCustoAtivoRede` VARCHAR(191) NULL AFTER `centroResponsavelAtivoRede`;

-- CreateIndex
CREATE INDEX `idx_ativo_rede_tipo_fk` ON `tbAtivoRede`(`idTipoAtivoRede`);

-- CreateIndex
CREATE INDEX `idx_ativo_rede_status_fk` ON `tbAtivoRede`(`idStatusAtivoRede`);

-- CreateIndex
CREATE INDEX `idx_ativo_rede_ccusto` ON `tbAtivoRede`(`idCCustoAtivoRede`);

-- Backfill tipo/status relations from existing snapshot columns
UPDATE `tbAtivoRede` ar
LEFT JOIN `tbTipoAtivoRede` tt
    ON UPPER(TRIM(tt.descricaoTipoAtivoRede)) = UPPER(TRIM(ar.tipoAtivoRede))
SET ar.idTipoAtivoRede = tt.idTipoAtivoRede
WHERE ar.idTipoAtivoRede IS NULL
  AND ar.tipoAtivoRede IS NOT NULL
  AND ar.tipoAtivoRede <> '';

UPDATE `tbAtivoRede` ar
LEFT JOIN `tbStatusAtivoRede` ts
    ON UPPER(TRIM(ts.descricaoStatusAtivoRede)) = UPPER(TRIM(ar.statusAtivoRede))
SET ar.idStatusAtivoRede = ts.idStatusAtivoRede
WHERE ar.idStatusAtivoRede IS NULL
  AND ar.statusAtivoRede IS NOT NULL
  AND ar.statusAtivoRede <> '';

UPDATE `tbAtivoRede` ar
LEFT JOIN `tbCCusto` cc
    ON UPPER(TRIM(COALESCE(cc.descricaoCCusto, cc.codigoCCusto))) = UPPER(TRIM(ar.centroResponsavelAtivoRede))
SET ar.idCCustoAtivoRede = cc.idCCusto
WHERE ar.idCCustoAtivoRede IS NULL
  AND ar.centroResponsavelAtivoRede IS NOT NULL
  AND ar.centroResponsavelAtivoRede <> '';

-- AddForeignKey
ALTER TABLE `tbAtivoRede`
    ADD CONSTRAINT `tbAtivoRede_idTipoAtivoRede_fkey` FOREIGN KEY (`idTipoAtivoRede`) REFERENCES `tbTipoAtivoRede`(`idTipoAtivoRede`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbAtivoRede`
    ADD CONSTRAINT `tbAtivoRede_idStatusAtivoRede_fkey` FOREIGN KEY (`idStatusAtivoRede`) REFERENCES `tbStatusAtivoRede`(`idStatusAtivoRede`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbAtivoRede`
    ADD CONSTRAINT `tbAtivoRede_idCCustoAtivoRede_fkey` FOREIGN KEY (`idCCustoAtivoRede`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE SET NULL ON UPDATE CASCADE;
