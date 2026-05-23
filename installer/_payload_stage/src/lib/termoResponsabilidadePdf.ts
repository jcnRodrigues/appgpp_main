export interface DadosTermoResponsabilidade {
    nomeFun: string;
    idMatFun: string;
    cpfFun: string | null;
    idPat: string;
    descricaoPat: string;
    statusAlocacao?: string;
    tipoPatrimonio?: string;
    marca?: string;
    modelo?: string;
    outrosProgramas?: string[];
    localData?: string;
    
}
