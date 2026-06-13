-- Garantir o centro de custo central usado nas devolucoes de ativos de rede
INSERT INTO `tbCCusto` (`idCCusto`, `codigoCCusto`, `descricaoCCusto`, `idEmp_Custo`)
SELECT UUID(), 'FILIAL_PARAUPEBAS', 'Filial Paraupebas', NULL
FROM DUAL
WHERE NOT EXISTS (
    SELECT 1
    FROM `tbCCusto`
    WHERE UPPER(TRIM(COALESCE(`descricaoCCusto`, ''))) = 'FILIAL PARAUPEBAS'
       OR UPPER(TRIM(COALESCE(`codigoCCusto`, ''))) = 'FILIAL_PARAUPEBAS'
);
