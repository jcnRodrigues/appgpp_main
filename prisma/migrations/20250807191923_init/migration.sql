/*
  Warnings:

  - You are about to drop the column `codigocusto` on the `tbCCusto` table. All the data in the column will be lost.
  - You are about to drop the column `descricaodetalhadaPat` on the `tbPatrimonio` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbCCusto" (
    "idCCusto" TEXT NOT NULL PRIMARY KEY,
    "codigoCCusto" TEXT,
    "descricaoCCusto" TEXT,
    "idEmp_Custo" TEXT,
    "idPat_Custo" TEXT,
    "idFun_Custo" TEXT,
    CONSTRAINT "tbCCusto_idFun_Custo_fkey" FOREIGN KEY ("idFun_Custo") REFERENCES "tbFuncionario" ("idF") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCCusto_idEmp_Custo_fkey" FOREIGN KEY ("idEmp_Custo") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCCusto_idPat_Custo_fkey" FOREIGN KEY ("idPat_Custo") REFERENCES "tbPatrimonio" ("idPat") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCCusto" ("descricaoCCusto", "idCCusto", "idEmp_Custo", "idFun_Custo", "idPat_Custo") SELECT "descricaoCCusto", "idCCusto", "idEmp_Custo", "idFun_Custo", "idPat_Custo" FROM "tbCCusto";
DROP TABLE "tbCCusto";
ALTER TABLE "new_tbCCusto" RENAME TO "tbCCusto";
CREATE TABLE "new_tbPatrimonio" (
    "idP" TEXT NOT NULL PRIMARY KEY,
    "idPat" TEXT NOT NULL,
    "descricaoPat" TEXT NOT NULL,
    "descricaoDetalhadaPat" TEXT,
    "licencaPat" TEXT,
    "dataEntPat" DATETIME NOT NULL,
    "dataSaiPat" DATETIME,
    "notaFiscalPat" TEXT,
    "valorPat" REAL NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);
INSERT INTO "new_tbPatrimonio" ("createdAt", "dataEntPat", "dataSaiPat", "descricaoPat", "idP", "idPat", "licencaPat", "notaFiscalPat", "updatedAt", "valorPat") SELECT "createdAt", "dataEntPat", "dataSaiPat", "descricaoPat", "idP", "idPat", "licencaPat", "notaFiscalPat", "updatedAt", "valorPat" FROM "tbPatrimonio";
DROP TABLE "tbPatrimonio";
ALTER TABLE "new_tbPatrimonio" RENAME TO "tbPatrimonio";
CREATE UNIQUE INDEX "tbPatrimonio_idPat_key" ON "tbPatrimonio"("idPat");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
