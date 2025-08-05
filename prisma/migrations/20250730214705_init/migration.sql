-- CreateTable
CREATE TABLE "tbUser" (
    "idU" TEXT NOT NULL PRIMARY KEY,
    "idUser" TEXT NOT NULL,
    "nomeUser" TEXT,
    "emailUser" TEXT,
    "senhaUser" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "tbFuncionario" (
    "idF" TEXT NOT NULL PRIMARY KEY,
    "idMatFun" TEXT,
    "nomeFun" TEXT NOT NULL,
    "cpfFun" TEXT,
    "dataAdmfun" DATETIME,
    "dataDesfun" DATETIME,
    "idFuncaoFun" TEXT,
    CONSTRAINT "tbFuncionario_idMatFun_fkey" FOREIGN KEY ("idMatFun") REFERENCES "tbUser" ("idU") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbFuncionario_idFuncaoFun_fkey" FOREIGN KEY ("idFuncaoFun") REFERENCES "tbFuncao" ("idFuncao") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbFuncao" (
    "idFuncao" TEXT NOT NULL PRIMARY KEY,
    "nomeFuncao" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tbPatrimonio" (
    "idP" TEXT NOT NULL PRIMARY KEY,
    "idPat" TEXT NOT NULL,
    "descricaoPat" TEXT NOT NULL,
    "descricaodetalhadaPat" TEXT,
    "licencaPat" TEXT,
    "dataEntPat" DATETIME NOT NULL,
    "dataSaiPat" DATETIME,
    "notaFiscalPat" TEXT,
    "valorPat" REAL NOT NULL,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME
);

-- CreateTable
CREATE TABLE "tbTipoPat" (
    "idTipPat" TEXT NOT NULL PRIMARY KEY,
    "descricaoTipPat" TEXT,
    "idPat_TipoPat" TEXT,
    CONSTRAINT "tbTipoPat_idPat_TipoPat_fkey" FOREIGN KEY ("idPat_TipoPat") REFERENCES "tbPatrimonio" ("idP") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbstatusPat" (
    "idStatPat" TEXT NOT NULL PRIMARY KEY,
    "descricaoStatPat" TEXT NOT NULL,
    "idPat_StatusPat" TEXT,
    CONSTRAINT "tbstatusPat_idPat_StatusPat_fkey" FOREIGN KEY ("idPat_StatusPat") REFERENCES "tbPatrimonio" ("idP") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbEmpresa" (
    "idEmp" TEXT NOT NULL PRIMARY KEY,
    "razaoEmpresa" TEXT,
    "fantasiaEmpresa" TEXT,
    "cnpjEmpresa" TEXT,
    "idCustEmp" TEXT
);

-- CreateTable
CREATE TABLE "tbCCusto" (
    "idCCusto" TEXT NOT NULL PRIMARY KEY,
    "codigocusto" TEXT,
    "descricaoCCusto" TEXT,
    "idEmp_Custo" TEXT,
    CONSTRAINT "tbCCusto_idEmp_Custo_fkey" FOREIGN KEY ("idEmp_Custo") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbCadastro" (
    "idCad" TEXT NOT NULL PRIMARY KEY,
    "dataCadPat" DATETIME,
    "dataDevPat" DATETIME,
    "createdAt" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    "idPatCad" TEXT,
    "idMatFunCad" TEXT,
    "idEmpCad" TEXT,
    CONSTRAINT "tbCadastro_idPatCad_fkey" FOREIGN KEY ("idPatCad") REFERENCES "tbPatrimonio" ("idPat") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCadastro_idMatFunCad_fkey" FOREIGN KEY ("idMatFunCad") REFERENCES "tbFuncionario" ("idMatFun") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tbCadastro_idEmpCad_fkey" FOREIGN KEY ("idEmpCad") REFERENCES "tbEmpresa" ("idEmp") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tbAccont" (
    "idAccont" TEXT NOT NULL PRIMARY KEY,
    "userID" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccontId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "sesseion_state" TEXT,
    CONSTRAINT "tbAccont_userID_fkey" FOREIGN KEY ("userID") REFERENCES "tbUser" ("idUser") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbUser" ("idUser") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "tbUser_idUser_key" ON "tbUser"("idUser");

-- CreateIndex
CREATE UNIQUE INDEX "tbFuncionario_idMatFun_key" ON "tbFuncionario"("idMatFun");

-- CreateIndex
CREATE UNIQUE INDEX "tbPatrimonio_idPat_key" ON "tbPatrimonio"("idPat");

-- CreateIndex
CREATE UNIQUE INDEX "tbTipoPat_idPat_TipoPat_key" ON "tbTipoPat"("idPat_TipoPat");

-- CreateIndex
CREATE UNIQUE INDEX "tbstatusPat_idPat_StatusPat_key" ON "tbstatusPat"("idPat_StatusPat");

-- CreateIndex
CREATE UNIQUE INDEX "tbAccont_provider_providerAccontId_key" ON "tbAccont"("provider", "providerAccontId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
