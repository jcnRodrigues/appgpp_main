/*
  Warnings:

  - You are about to drop the `Accont` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tbUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `session_token` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Session` table. All the data in the column will be lost.
  - Added the required column `sessionToken` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Accont_provider_providerAccountId_key";

-- DropIndex
DROP INDEX "tbUser_emailUser_key";

-- DropIndex
DROP INDEX "tbUser_idUser_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Accont";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "tbUser";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "senhaUser" TEXT,
    "image" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "idAccont" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "sesseion_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("expires", "id") SELECT "expires", "id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
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
    CONSTRAINT "tbFuncionario_idUserFun_fkey" FOREIGN KEY ("idUserFun") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
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
CREATE UNIQUE INDEX "User_idUser_key" ON "User"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
