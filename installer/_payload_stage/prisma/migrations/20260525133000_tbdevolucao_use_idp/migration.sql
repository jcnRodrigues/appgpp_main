-- Drop old foreign key that points tbDevolucao.idPatrimonio -> tbPatrimonio.idPat
ALTER TABLE `tbDevolucao` DROP FOREIGN KEY `tbDevolucao_idPatrimonio_fkey`;

-- Convert existing stored business IDs (idPat) to UUID IDs (idP)
UPDATE `tbDevolucao` d
INNER JOIN `tbPatrimonio` p ON p.`idPat` = d.`idPatrimonio`
SET d.`idPatrimonio` = p.`idP`;

-- Recreate foreign key now pointing to tbPatrimonio.idP
ALTER TABLE `tbDevolucao`
  ADD CONSTRAINT `tbDevolucao_idPatrimonio_fkey`
  FOREIGN KEY (`idPatrimonio`) REFERENCES `tbPatrimonio`(`idP`) ON DELETE CASCADE ON UPDATE CASCADE;
