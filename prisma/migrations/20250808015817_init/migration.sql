/*
  Warnings:

  - You are about to drop the column `idFun_Custo` on the `tbCCusto` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbCCusto" (
    "idCCusto" TEXT NOT NULL PRIMARY KEY,
    "codigoCCusto" TEXT,
    "descricaoCCusto" TEXT,
    "idEmp_Custo" TEXT,
    CONSTRAINT "tbCCusto_idEmp_Custo_fkey" FOREIGN KEY ("idEmp_Custo") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCCusto" ("codigoCCusto", "descricaoCCusto", "idCCusto", "idEmp_Custo") SELECT "codigoCCusto", "descricaoCCusto", "idCCusto", "idEmp_Custo" FROM "tbCCusto";
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
    "idCustoFun" TEXT,
    CONSTRAINT "tbFuncionario_idStatusFun_fkey" FOREIGN KEY ("idStatusFun") REFERENCES "tbStatusFun" ("idStatusFun") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idUserFun_fkey" FOREIGN KEY ("idUserFun") REFERENCES "tbUser" ("idU") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idFuncaoFun_fkey" FOREIGN KEY ("idFuncaoFun") REFERENCES "tbFuncao" ("idFuncao") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idCustoFun_fkey" FOREIGN KEY ("idCustoFun") REFERENCES "tbCCusto" ("idCCusto") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbFuncionario" ("avatarFun", "cpfFun", "dataAdmFun", "dataDesFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun") SELECT "avatarFun", "cpfFun", "dataAdmFun", "dataDesFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun" FROM "tbFuncionario";
DROP TABLE "tbFuncionario";
ALTER TABLE "new_tbFuncionario" RENAME TO "tbFuncionario";
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
