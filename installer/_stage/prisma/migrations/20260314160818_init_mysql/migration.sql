-- CreateTable
CREATE TABLE `tbUser` (
    `id` VARCHAR(191) NOT NULL,
    `idUser` VARCHAR(191) NULL,
    `nomeUser` VARCHAR(191) NULL,
    `emailUser` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `senhaUser` VARCHAR(191) NULL,
    `avatarUser` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tbUser_idUser_key`(`idUser`),
    UNIQUE INDEX `tbUser_emailUser_key`(`emailUser`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbFuncionario` (
    `idF` VARCHAR(191) NOT NULL,
    `idMatFun` VARCHAR(191) NOT NULL,
    `nomeFun` VARCHAR(191) NOT NULL,
    `cpfFun` VARCHAR(191) NULL,
    `dataAdmFun` DATETIME(3) NULL,
    `dataDesFun` DATETIME(3) NULL,
    `avatarFun` VARCHAR(191) NULL,
    `idFuncaoFun` VARCHAR(191) NULL,
    `idUserFun` VARCHAR(191) NULL,
    `idStatusFun` VARCHAR(191) NULL,
    `idCustoFun` VARCHAR(191) NULL,

    UNIQUE INDEX `tbFuncionario_idMatFun_key`(`idMatFun`),
    PRIMARY KEY (`idF`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbStatusFun` (
    `idStatusFun` VARCHAR(191) NOT NULL,
    `descricaoStatusFun` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStatusFun`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbFuncao` (
    `idFuncao` VARCHAR(191) NOT NULL,
    `nomeFuncao` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idFuncao`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbPatrimonio` (
    `idP` VARCHAR(191) NOT NULL,
    `idPat` VARCHAR(191) NOT NULL,
    `descricaoPat` VARCHAR(191) NOT NULL,
    `descricaoDetalhadaPat` VARCHAR(191) NULL,
    `licencaPat` VARCHAR(191) NULL,
    `dataEntPat` DATETIME(3) NOT NULL,
    `dataSaiPat` DATETIME(3) NULL,
    `notaFiscalPat` VARCHAR(191) NULL,
    `valorPat` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `idPat_TipoPat` VARCHAR(191) NULL,
    `idPat_StatusPat` VARCHAR(191) NULL,
    `idPat_CustoPat` VARCHAR(191) NULL,

    UNIQUE INDEX `tbPatrimonio_idPat_key`(`idPat`),
    PRIMARY KEY (`idP`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbTipoPat` (
    `idTipPat` VARCHAR(191) NOT NULL,
    `descricaoTipPat` VARCHAR(191) NULL,

    PRIMARY KEY (`idTipPat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbStatusPat` (
    `idStatusPat` VARCHAR(191) NOT NULL,
    `descricaoStatPat` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idStatusPat`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbEmpresa` (
    `idEmp` VARCHAR(191) NOT NULL,
    `razaoEmpresa` VARCHAR(191) NULL,
    `fantasiaEmpresa` VARCHAR(191) NULL,
    `cnpjEmpresa` VARCHAR(191) NULL,
    `idCustEmp` VARCHAR(191) NULL,

    PRIMARY KEY (`idEmp`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbCCusto` (
    `idCCusto` VARCHAR(191) NOT NULL,
    `codigoCCusto` VARCHAR(191) NULL,
    `descricaoCCusto` VARCHAR(191) NULL,
    `idEmp_Custo` VARCHAR(191) NULL,

    PRIMARY KEY (`idCCusto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbCadastro` (
    `idCad` VARCHAR(191) NOT NULL,
    `dataCadPat` DATETIME(3) NULL,
    `dataDevPat` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,
    `idPatCad` VARCHAR(191) NULL,
    `idMatFunCad` VARCHAR(191) NULL,
    `idStatusPatCad` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idCad`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `idAccont` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `sesseion_state` VARCHAR(191) NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`idAccont`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationTokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NULL,

    UNIQUE INDEX `VerificationTokens_token_key`(`token`),
    UNIQUE INDEX `VerificationTokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbFuncionario` ADD CONSTRAINT `tbFuncionario_idStatusFun_fkey` FOREIGN KEY (`idStatusFun`) REFERENCES `tbStatusFun`(`idStatusFun`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbFuncionario` ADD CONSTRAINT `tbFuncionario_idUserFun_fkey` FOREIGN KEY (`idUserFun`) REFERENCES `tbUser`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbFuncionario` ADD CONSTRAINT `tbFuncionario_idFuncaoFun_fkey` FOREIGN KEY (`idFuncaoFun`) REFERENCES `tbFuncao`(`idFuncao`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbFuncionario` ADD CONSTRAINT `tbFuncionario_idCustoFun_fkey` FOREIGN KEY (`idCustoFun`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbPatrimonio` ADD CONSTRAINT `tbPatrimonio_idPat_TipoPat_fkey` FOREIGN KEY (`idPat_TipoPat`) REFERENCES `tbTipoPat`(`idTipPat`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbPatrimonio` ADD CONSTRAINT `tbPatrimonio_idPat_StatusPat_fkey` FOREIGN KEY (`idPat_StatusPat`) REFERENCES `tbStatusPat`(`idStatusPat`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbPatrimonio` ADD CONSTRAINT `tbPatrimonio_idPat_CustoPat_fkey` FOREIGN KEY (`idPat_CustoPat`) REFERENCES `tbCCusto`(`idCCusto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbCCusto` ADD CONSTRAINT `tbCCusto_idEmp_Custo_fkey` FOREIGN KEY (`idEmp_Custo`) REFERENCES `tbEmpresa`(`idEmp`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbCadastro` ADD CONSTRAINT `tbCadastro_idPatCad_fkey` FOREIGN KEY (`idPatCad`) REFERENCES `tbPatrimonio`(`idPat`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbCadastro` ADD CONSTRAINT `tbCadastro_idMatFunCad_fkey` FOREIGN KEY (`idMatFunCad`) REFERENCES `tbFuncionario`(`idMatFun`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbCadastro` ADD CONSTRAINT `tbCadastro_idStatusPatCad_fkey` FOREIGN KEY (`idStatusPatCad`) REFERENCES `tbStatusPat`(`idStatusPat`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
