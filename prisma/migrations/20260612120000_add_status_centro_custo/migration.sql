-- CreateTable
CREATE TABLE `tbStatusCCusto` (
    `idStatusCCusto` VARCHAR(191) NOT NULL,
    `descricaoStatusCCusto` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tbStatusCCusto_descricaoStatusCCusto_key`(`descricaoStatusCCusto`),
    PRIMARY KEY (`idStatusCCusto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Seed lookup data
INSERT IGNORE INTO `tbStatusCCusto` (`idStatusCCusto`, `descricaoStatusCCusto`) VALUES
    (UUID(), 'ATIVO'),
    (UUID(), 'MOBILIZADO'),
    (UUID(), 'DESMOBILIZADO'),
    (UUID(), 'INATIVO');

-- AlterTable
ALTER TABLE `tbCCusto`
    ADD COLUMN `idStatusCCusto` VARCHAR(191) NULL AFTER `idEmp_Custo`;

-- CreateIndex
CREATE INDEX `idx_ccusto_status_fk` ON `tbCCusto`(`idStatusCCusto`);

-- Backfill existing records with the default status
UPDATE `tbCCusto` cc
JOIN `tbStatusCCusto` sc
    ON UPPER(TRIM(sc.descricaoStatusCCusto)) = 'ATIVO'
SET cc.idStatusCCusto = sc.idStatusCCusto
WHERE cc.idStatusCCusto IS NULL;

-- AddForeignKey
ALTER TABLE `tbCCusto`
    ADD CONSTRAINT `tbCCusto_idStatusCCusto_fkey` FOREIGN KEY (`idStatusCCusto`) REFERENCES `tbStatusCCusto`(`idStatusCCusto`) ON DELETE SET NULL ON UPDATE CASCADE;
