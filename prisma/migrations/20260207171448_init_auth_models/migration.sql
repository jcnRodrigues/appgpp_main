/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `idUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `senhaUser` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "tbUser" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT,
    "nomeUser" TEXT,
    "emailUser" TEXT,
    "emailVerified" DATETIME,
    "senhaUser" TEXT,
    "avatarUser" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT
);
INSERT INTO "new_User" ("email", "emailVerified", "id", "image", "name") SELECT "email", "emailVerified", "id", "image", "name" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
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
    CONSTRAINT "tbFuncionario_idUserFun_fkey" FOREIGN KEY ("idUserFun") REFERENCES "tbUser" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idFuncaoFun_fkey" FOREIGN KEY ("idFuncaoFun") REFERENCES "tbFuncao" ("idFuncao") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idCustoFun_fkey" FOREIGN KEY ("idCustoFun") REFERENCES "tbCCusto" ("idCCusto") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_tbFuncionario" ("avatarFun", "cpfFun", "dataAdmFun", "dataDesFun", "idCustoFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun") SELECT "avatarFun", "cpfFun", "dataAdmFun", "dataDesFun", "idCustoFun", "idF", "idFuncaoFun", "idMatFun", "idStatusFun", "idUserFun", "nomeFun" FROM "tbFuncionario";
DROP TABLE "tbFuncionario";
ALTER TABLE "new_tbFuncionario" RENAME TO "tbFuncionario";
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_idUser_key" ON "tbUser"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_emailUser_key" ON "tbUser"("emailUser");
