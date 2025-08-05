/*
  Warnings:

  - You are about to drop the column `dataAdmfun` on the `tbFuncionario` table. All the data in the column will be lost.
  - You are about to drop the column `dataDesfun` on the `tbFuncionario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbFuncionario" (
    "idF" TEXT NOT NULL PRIMARY KEY,
    "idMatFun" TEXT,
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
INSERT INTO "new_tbFuncionario" ("avatarFun", "cpfFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun") SELECT "avatarFun", "cpfFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun" FROM "tbFuncionario";
DROP TABLE "tbFuncionario";
ALTER TABLE "new_tbFuncionario" RENAME TO "tbFuncionario";
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
