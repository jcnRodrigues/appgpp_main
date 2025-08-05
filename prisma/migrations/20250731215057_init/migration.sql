-- DropIndex
DROP INDEX "tbstatusPat_idPat_StatusPat_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_tbUser" (
    "idU" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT,
    "nomeUser" TEXT,
    "emailUser" TEXT,
    "senhaUser" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_tbUser" ("createdAt", "emailUser", "idU", "idUser", "nomeUser", "senhaUser", "updatedAt") SELECT "createdAt", "emailUser", "idU", "idUser", "nomeUser", "senhaUser", "updatedAt" FROM "tbUser";
DROP TABLE "tbUser";
ALTER TABLE "new_tbUser" RENAME TO "tbUser";
CREATE UNIQUE INDEX "tbUser_idUser_key" ON "tbUser"("idUser");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
