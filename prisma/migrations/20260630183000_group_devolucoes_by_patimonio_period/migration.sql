-- Consolida devoluções históricas por patrimônio + mês/ano.
-- O processo canônico de cada grupo passa a representar todos os itens do mesmo patrimônio no mesmo período.
CREATE TEMPORARY TABLE tmp_devolucao_rows AS
SELECT
    d.`idDevolucao`,
    d.`idPatrimonio`,
    d.`idDevolucaoProcesso`,
    d.`dataInicioDevolucao`,
    d.`dataFimDevolucao`,
    YEAR(d.`dataInicioDevolucao`) AS `anoDevolucao`,
    MONTH(d.`dataInicioDevolucao`) AS `mesDevolucao`,
    @ordem := IF(
        BINARY @grupo = BINARY CONCAT(d.`idPatrimonio`, '-', YEAR(d.`dataInicioDevolucao`), '-', MONTH(d.`dataInicioDevolucao`)),
        @ordem + 1,
        1
    ) AS `ordemGrupo`,
    @grupo := CONVERT(CONCAT(d.`idPatrimonio`, '-', YEAR(d.`dataInicioDevolucao`), '-', MONTH(d.`dataInicioDevolucao`)) USING utf8mb4) AS `grupoAtual`
FROM (
    SELECT *
    FROM `tbDevolucao`
    ORDER BY `idPatrimonio`, YEAR(`dataInicioDevolucao`), MONTH(`dataInicioDevolucao`), `createdAt`, `idDevolucao`
) d
CROSS JOIN (SELECT @grupo := '', @ordem := 0) vars;

CREATE TEMPORARY TABLE tmp_devolucao_grupos AS
SELECT
    r.`idPatrimonio`,
    r.`anoDevolucao`,
    r.`mesDevolucao`,
    MIN(r.`dataInicioDevolucao`) AS `dataInicio`,
    MAX(r.`dataFimDevolucao`) AS `dataFechamento`,
    CASE
        WHEN SUM(CASE WHEN r.`dataFimDevolucao` IS NULL THEN 1 ELSE 0 END) > 0 THEN 'ABERTO'
        ELSE 'FECHADO'
    END AS `statusDevolucao`,
    MAX(CASE WHEN r.`ordemGrupo` = 1 THEN r.`idDevolucaoProcesso` END) AS `idDevolucaoProcessoCanonico`
FROM tmp_devolucao_rows r
GROUP BY r.`idPatrimonio`, r.`anoDevolucao`, r.`mesDevolucao`;

UPDATE `tbDevolucaoProcesso` p
INNER JOIN tmp_devolucao_grupos g
    ON g.`idDevolucaoProcessoCanonico` = p.`idDevolucaoProcesso`
SET
    p.`statusDevolucao` = g.`statusDevolucao`,
    p.`dataInicio` = g.`dataInicio`,
    p.`dataFechamento` = g.`dataFechamento`,
    p.`updatedAt` = NOW();

UPDATE `tbDevolucao` d
INNER JOIN tmp_devolucao_rows r
    ON r.`idDevolucao` = d.`idDevolucao`
INNER JOIN tmp_devolucao_grupos g
    ON g.`idPatrimonio` = r.`idPatrimonio`
   AND g.`anoDevolucao` = r.`anoDevolucao`
   AND g.`mesDevolucao` = r.`mesDevolucao`
SET d.`idDevolucaoProcesso` = g.`idDevolucaoProcessoCanonico`;

DELETE p
FROM `tbDevolucaoProcesso` p
LEFT JOIN `tbDevolucao` d
    ON d.`idDevolucaoProcesso` = p.`idDevolucaoProcesso`
WHERE d.`idDevolucaoProcesso` IS NULL;

DROP TEMPORARY TABLE tmp_devolucao_grupos;
DROP TEMPORARY TABLE tmp_devolucao_rows;
