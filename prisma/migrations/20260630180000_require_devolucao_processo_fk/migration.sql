-- Backfill de devoluções antigas: cria um processo por registro sem vínculo,
-- preservando a sequência do código por mês/ano sem conflitar com processos já existentes.
CREATE TEMPORARY TABLE tmp_devolucao_backfill AS
SELECT
    d.`idDevolucao`,
    d.`dataInicioDevolucao`,
    d.`dataFimDevolucao`,
    MONTH(d.`dataInicioDevolucao`) AS `mesDevolucao`,
    YEAR(d.`dataInicioDevolucao`) AS `anoDevolucao`,
    @ordem := IF(@grupo = CONCAT(YEAR(d.`dataInicioDevolucao`), '-', MONTH(d.`dataInicioDevolucao`)), @ordem + 1, 1) AS `ordemMesAno`,
    @grupo := CONCAT(YEAR(d.`dataInicioDevolucao`), '-', MONTH(d.`dataInicioDevolucao`)) AS `grupoAtual`,
    COALESCE((
        SELECT MAX(p.`contadorDevolucao`)
        FROM `tbDevolucaoProcesso` p
        WHERE p.`mesDevolucao` = MONTH(d.`dataInicioDevolucao`)
          AND p.`anoDevolucao` = YEAR(d.`dataInicioDevolucao`)
    ), 0) AS `contadorBase`
FROM (
    SELECT *
    FROM `tbDevolucao`
    WHERE `idDevolucaoProcesso` IS NULL
    ORDER BY YEAR(`dataInicioDevolucao`), MONTH(`dataInicioDevolucao`), `createdAt`, `idDevolucao`
) d
CROSS JOIN (SELECT @grupo := '', @ordem := 0) vars
;

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
    CONCAT(
        'DEV',
        LPAD(t.`mesDevolucao`, 2, '0'),
        t.`anoDevolucao`,
        '-',
        LPAD(t.`contadorBase` + t.`ordemMesAno`, 3, '0')
    ),
    t.`mesDevolucao`,
    t.`anoDevolucao`,
    t.`contadorBase` + t.`ordemMesAno`,
    CASE
        WHEN t.`dataFimDevolucao` IS NULL THEN 'ABERTO'
        ELSE 'FECHADO'
    END,
    t.`dataInicioDevolucao`,
    t.`dataFimDevolucao`,
    NOW(),
    NOW()
FROM tmp_devolucao_backfill t;

UPDATE `tbDevolucao` d
INNER JOIN tmp_devolucao_backfill t
    ON t.`idDevolucao` = d.`idDevolucao`
INNER JOIN `tbDevolucaoProcesso` p
    ON p.`codigoDevolucao` = CONCAT(
        'DEV',
        LPAD(t.`mesDevolucao`, 2, '0'),
        t.`anoDevolucao`,
        '-',
        LPAD(t.`contadorBase` + t.`ordemMesAno`, 3, '0')
    )
SET d.`idDevolucaoProcesso` = p.`idDevolucaoProcesso`;

DROP TEMPORARY TABLE tmp_devolucao_backfill;

ALTER TABLE `tbDevolucao`
  DROP FOREIGN KEY `tbDevolucao_idDevolucaoProcesso_fkey`,
  MODIFY `idDevolucaoProcesso` VARCHAR(191) NOT NULL;

ALTER TABLE `tbDevolucao`
  ADD CONSTRAINT `tbDevolucao_idDevolucaoProcesso_fkey`
  FOREIGN KEY (`idDevolucaoProcesso`) REFERENCES `tbDevolucaoProcesso`(`idDevolucaoProcesso`)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
