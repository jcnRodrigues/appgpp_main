-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbFuncionario" (
    "idF" TEXT NOT NULL PRIMARY KEY,
    "idMatFun" TEXT,
    "nomeFun" TEXT NOT NULL,
    "cpfFun" TEXT,
    "dataAdmfun" DATETIME,
    "dataDesfun" DATETIME,
    "idFuncaoFun" TEXT,
    "idUserFun" TEXT,
    CONSTRAINT "tbFuncionario_idUserFun_fkey" FOREIGN KEY ("idUserFun") REFERENCES "tbUser" ("idU") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idFuncaoFun_fkey" FOREIGN KEY ("idFuncaoFun") REFERENCES "tbFuncao" ("idFuncao") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbFuncionario" ("cpfFun", "dataAdmfun", "dataDesfun", "idF", "idFuncaoFun", "idMatFun", "nomeFun") SELECT "cpfFun", "dataAdmfun", "dataDesfun", "idF", "idFuncaoFun", "idMatFun", "nomeFun" FROM "tbFuncionario";
DROP TABLE "tbFuncionario";
ALTER TABLE "new_tbFuncionario" RENAME TO "tbFuncionario";
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
