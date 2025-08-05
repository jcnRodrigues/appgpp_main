/*
  Warnings:

  - You are about to drop the column `idEmpCad` on the `tbCadastro` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "tbStatusFun" (
    "idStatusFun" TEXT NOT NULL PRIMARY KEY,
    "descricaoStatusFun" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbCCusto" (
    "idCCusto" TEXT NOT NULL PRIMARY KEY,
    "codigocusto" TEXT,
    "descricaoCCusto" TEXT,
    "idEmp_Custo" TEXT,
    "idPat_Custo" TEXT,
    CONSTRAINT "tbCCusto_idEmp_Custo_fkey" FOREIGN KEY ("idEmp_Custo") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCCusto_idPat_Custo_fkey" FOREIGN KEY ("idPat_Custo") REFERENCES "tbPatrimonio" ("idPat") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCCusto" ("codigocusto", "descricaoCCusto", "idCCusto", "idEmp_Custo") SELECT "codigocusto", "descricaoCCusto", "idCCusto", "idEmp_Custo" FROM "tbCCusto";
DROP TABLE "tbCCusto";
ALTER TABLE "new_tbCCusto" RENAME TO "tbCCusto";
CREATE TABLE "new_tbCadastro" (
    "idCad" TEXT NOT NULL PRIMARY KEY,
    "dataCadPat" DATETIME,
    "dataDevPat" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "idPatCad" TEXT,
    "idMatFunCad" TEXT,
    CONSTRAINT "tbCadastro_idPatCad_fkey" FOREIGN KEY ("idPatCad") REFERENCES "tbPatrimonio" ("idPat") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCadastro_idMatFunCad_fkey" FOREIGN KEY ("idMatFunCad") REFERENCES "tbFuncionario" ("idMatFun") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCadastro" ("createdAt", "dataCadPat", "dataDevPat", "idCad", "idMatFunCad", "idPatCad", "updatedAt") SELECT "createdAt", "dataCadPat", "dataDevPat", "idCad", "idMatFunCad", "idPatCad", "updatedAt" FROM "tbCadastro";
DROP TABLE "tbCadastro";
ALTER TABLE "new_tbCadastro" RENAME TO "tbCadastro";
CREATE TABLE "new_tbFuncionario" (
    "idF" TEXT NOT NULL PRIMARY KEY,
    "idMatFun" TEXT,
    "nomeFun" TEXT NOT NULL,
    "cpfFun" TEXT,
    "dataAdmfun" DATETIME,
    "dataDesfun" DATETIME,
    "idFuncaoFun" TEXT,
    "idUserFun" TEXT,
    "idStatusFun" TEXT,
    CONSTRAINT "tbFuncionario_idStatusFun_fkey" FOREIGN KEY ("idStatusFun") REFERENCES "tbStatusFun" ("idStatusFun") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idUserFun_fkey" FOREIGN KEY ("idUserFun") REFERENCES "tbUser" ("idU") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idFuncaoFun_fkey" FOREIGN KEY ("idFuncaoFun") REFERENCES "tbFuncao" ("idFuncao") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbFuncionario" ("cpfFun", "dataAdmfun", "dataDesfun", "idF", "idFuncaoFun", "idMatFun", "idUserFun", "nomeFun") SELECT "cpfFun", "dataAdmfun", "dataDesfun", "idF", "idFuncaoFun", "idMatFun", "idUserFun", "nomeFun" FROM "tbFuncionario";
DROP TABLE "tbFuncionario";
ALTER TABLE "new_tbFuncionario" RENAME TO "tbFuncionario";
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
