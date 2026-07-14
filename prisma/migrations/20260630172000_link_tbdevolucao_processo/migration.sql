-- Backfill de processos de devolução existentes a partir dos registros legados de tbDevolucao
INSERT INTO `tbDevolucaoProcesso` (
    `idDevolucaoProcesso`,
    `codigoDevolucao`,
    `mesDevolucao`,
    `anoDevolucao`,
    `contadorDevolucao`,
    `statusDevolucao`,
    `dataInicio`,
    `dataFechamento`,
    `updatedAt`,
    `createdAt`
)
SELECT
    UUID(),
    legado.`codigoDevolucao`,
    legado.`mesDevolucao`,
    legado.`anoDevolucao`,
    legado.`contadorDevolucao`,
    CASE
        WHEN legado.`qtdAbertos` > 0 THEN 'ABERTO'
        ELSE 'FECHADO'
    END,
    legado.`dataInicio`,
    legado.`dataFechamento`,
    NOW(),
    NOW()
FROM (
    SELECT
        d.`codigoDevolucao`,
        COALESCE(
            MAX(d.`mesDevolucao`),
            CAST(SUBSTRING(d.`codigoDevolucao`, 4, 2) AS UNSIGNED)
        ) AS `mesDevolucao`,
        COALESCE(
            MAX(d.`anoDevolucao`),
            CAST(SUBSTRING(d.`codigoDevolucao`, 6, 4) AS UNSIGNED)
        ) AS `anoDevolucao`,
        COALESCE(
            MAX(d.`contadorDevolucao`),
            CAST(SUBSTRING(d.`codigoDevolucao`, 11, 3) AS UNSIGNED)
        ) AS `contadorDevolucao`,
        MIN(d.`dataInicioDevolucao`) AS `dataInicio`,
        MAX(d.`dataFimDevolucao`) AS `dataFechamento`,
        SUM(CASE WHEN d.`dataFimDevolucao` IS NULL THEN 1 ELSE 0 END) AS `qtdAbertos`
    FROM `tbDevolucao` d
    WHERE d.`codigoDevolucao` IS NOT NULL
      AND d.`codigoDevolucao` <> ''
      AND d.`codigoDevolucao` REGEXP '^DEV[0-9]{2}[0-9]{4}-[0-9]{3}$'
    GROUP BY d.`codigoDevolucao`
) legado
LEFT JOIN `tbDevolucaoProcesso` processo
    ON processo.`codigoDevolucao` = legado.`codigoDevolucao`
WHERE processo.`idDevolucaoProcesso` IS NULL;

-- Relaciona cada devolução ao processo correspondente
ALTER TABLE `tbDevolucao`
    ADD COLUMN `idDevolucaoProcesso` VARCHAR(191) NULL,
    ADD INDEX `idx_devolucao_processo_fk`(`idDevolucaoProcesso`);

UPDATE `tbDevolucao` d
INNER JOIN `tbDevolucaoProcesso` p
    ON p.`codigoDevolucao` = d.`codigoDevolucao`
SET d.`idDevolucaoProcesso` = p.`idDevolucaoProcesso`
WHERE d.`codigoDevolucao` IS NOT NULL
  AND d.`codigoDevolucao` <> '';

ALTER TABLE `tbDevolucao`
    ADD CONSTRAINT `tbDevolucao_idDevolucaoProcesso_fkey`
    FOREIGN KEY (`idDevolucaoProcesso`) REFERENCES `tbDevolucaoProcesso`(`idDevolucaoProcesso`)
    ON DELETE SET NULL
    ON UPDATE CASCADE;
