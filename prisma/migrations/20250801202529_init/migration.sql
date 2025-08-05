-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbCCusto" (
    "idCCusto" TEXT NOT NULL PRIMARY KEY,
    "codigocusto" TEXT,
    "descricaoCCusto" TEXT,
    "idEmp_Custo" TEXT,
    "idPat_Custo" TEXT,
    "idFun_Custo" TEXT,
    CONSTRAINT "tbCCusto_idFun_Custo_fkey" FOREIGN KEY ("idFun_Custo") REFERENCES "tbFuncionario" ("idF") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCCusto_idEmp_Custo_fkey" FOREIGN KEY ("idEmp_Custo") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCCusto_idPat_Custo_fkey" FOREIGN KEY ("idPat_Custo") REFERENCES "tbPatrimonio" ("idPat") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCCusto" ("codigocusto", "descricaoCCusto", "idCCusto", "idEmp_Custo", "idPat_Custo") SELECT "codigocusto", "descricaoCCusto", "idCCusto", "idEmp_Custo", "idPat_Custo" FROM "tbCCusto";
DROP TABLE "tbCCusto";
ALTER TABLE "new_tbCCusto" RENAME TO "tbCCusto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
