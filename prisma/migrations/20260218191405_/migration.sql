-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbCadastro" (
    "idCad" TEXT NOT NULL PRIMARY KEY,
    "dataCadPat" DATETIME,
    "dataDevPat" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "idPatCad" TEXT,
    "idMatFunCad" TEXT,
    CONSTRAINT "tbCadastro_idPatCad_fkey" FOREIGN KEY ("idPatCad") REFERENCES "tbPatrimonio" ("idP") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCadastro_idMatFunCad_fkey" FOREIGN KEY ("idMatFunCad") REFERENCES "tbFuncionario" ("idMatFun") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbCadastro" ("createdAt", "dataCadPat", "dataDevPat", "idCad", "idMatFunCad", "idPatCad", "updatedAt") SELECT "createdAt", "dataCadPat", "dataDevPat", "idCad", "idMatFunCad", "idPatCad", "updatedAt" FROM "tbCadastro";
DROP TABLE "tbCadastro";
ALTER TABLE "new_tbCadastro" RENAME TO "tbCadastro";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
