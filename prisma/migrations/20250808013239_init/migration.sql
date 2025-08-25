/*
  Warnings:

  - You are about to drop the `tbstatusPat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `idPat_Custo` on the `tbCCusto` table. All the data in the column will be lost.
  - You are about to drop the column `idPat_TipoPat` on the `tbTipoPat` table. All the data in the column will be lost.
  - Made the column `idMatFun` on table `tbFuncionario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tbstatusPat";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "tbStatusPat" (
    "idStatusPat" TEXT NOT NULL PRIMARY KEY,
    "descricaoStatPat" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbCCusto" (
    "idCCusto" TEXT NOT NULL PRIMARY KEY,
    "codigoCCusto" TEXT,
    "descricaoCCusto" TEXT,
    "idEmp_Custo" TEXT,
    "idFun_Custo" TEXT,
    CONSTRAINT "tbCCusto_idFun_Custo_fkey" FOREIGN KEY ("idFun_Custo") REFERENCES "tbFuncionario" ("idF") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCCusto_idEmp_Custo_fkey" FOREIGN KEY ("idEmp_Custo") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCCusto" ("codigoCCusto", "descricaoCCusto", "idCCusto", "idEmp_Custo", "idFun_Custo") SELECT "codigoCCusto", "descricaoCCusto", "idCCusto", "idEmp_Custo", "idFun_Custo" FROM "tbCCusto";
DROP TABLE "tbCCusto";
ALTER TABLE "new_tbCCusto" RENAME TO "tbCCusto";
CREATE TABLE "new_tbFuncionario" (
    "idF" TEXT NOT NULL PRIMARY KEY,
    "idMatFun" TEXT NOT NULL,
    "nomeFun" TEXT NOT NULL,
    "cpfFun" TEXT,
    "dataAdmFun" DATETIME,
    "dataDesFun" DATETIME,
    "avatarFun" TEXT,
    "idFuncaoFun" TEXT,
    "idUserFun" TEXT,
    "idStatusFun" TEXT,
    CONSTRAINT "tbFuncionario_idStatusFun_fkey" FOREIGN KEY ("idStatusFun") REFERENCES "tbStatusFun" ("idStatusFun") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idUserFun_fkey" FOREIGN KEY ("idUserFun") REFERENCES "tbUser" ("idU") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idFuncaoFun_fkey" FOREIGN KEY ("idFuncaoFun") REFERENCES "tbFuncao" ("idFuncao") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbFuncionario" ("avatarFun", "cpfFun", "dataAdmFun", "dataDesFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun") SELECT "avatarFun", "cpfFun", "dataAdmFun", "dataDesFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun" FROM "tbFuncionario";
DROP TABLE "tbFuncionario";
ALTER TABLE "new_tbFuncionario" RENAME TO "tbFuncionario";
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");
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
    "updatedAt" DATETIME,
    "idPat_TipoPat" TEXT,
    "idPat_StatusPat" TEXT,
    "idPat_CustoPat" TEXT,
    CONSTRAINT "tbPatrimonio_idPat_TipoPat_fkey" FOREIGN KEY ("idPat_TipoPat") REFERENCES "tbTipoPat" ("idTipPat") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbPatrimonio_idPat_StatusPat_fkey" FOREIGN KEY ("idPat_StatusPat") REFERENCES "tbStatusPat" ("idStatusPat") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbPatrimonio_idPat_CustoPat_fkey" FOREIGN KEY ("idPat_CustoPat") REFERENCES "tbCCusto" ("idCCusto") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbPatrimonio" ("createdAt", "dataEntPat", "dataSaiPat", "descricaoDetalhadaPat", "descricaoPat", "idP", "idPat", "licencaPat", "notaFiscalPat", "updatedAt", "valorPat") SELECT "createdAt", "dataEntPat", "dataSaiPat", "descricaoDetalhadaPat", "descricaoPat", "idP", "idPat", "licencaPat", "notaFiscalPat", "updatedAt", "valorPat" FROM "tbPatrimonio";
DROP TABLE "tbPatrimonio";
ALTER TABLE "new_tbPatrimonio" RENAME TO "tbPatrimonio";
CREATE UNIQUE INDEX "tbPatrimonio_idPat_key" ON "tbPatrimonio"("idPat");
CREATE TABLE "new_tbTipoPat" (
    "idTipPat" TEXT NOT NULL PRIMARY KEY,
    "descricaoTipPat" TEXT
);
INSERT INTO "new_tbTipoPat" ("descricaoTipPat", "idTipPat") SELECT "descricaoTipPat", "idTipPat" FROM "tbTipoPat";
DROP TABLE "tbTipoPat";
ALTER TABLE "new_tbTipoPat" RENAME TO "tbTipoPat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
