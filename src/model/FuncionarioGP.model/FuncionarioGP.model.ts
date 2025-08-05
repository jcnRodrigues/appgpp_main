import { tbCCusto, tbFuncao, tbStatusFun, tbUser } from "../../../prisma/generated/prisma";

export interface FuncionarioGP {
    idMatFun: string;
    nomeFun: string;
    cpfFun?: string;
    avatarFun?: string;
    dataAdmFun?: string;
    dataDemFun?: string;
    idStatusFun?: string;
    idCustoFun?: string;
    idFuncaoFun?: string;
    idUserFun?: string;
    statusFun: tbStatusFun[];
    custoFun: tbCCusto[];
    funcaoFun: tbFuncao[];
    userFun: tbUser[];

}