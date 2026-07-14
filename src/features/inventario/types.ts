export type CentroCustoOption = {
  idCCusto: string;
  codigoCCusto?: string | null;
  descricaoCCusto?: string | null;
};

export type PatrimonioBusca = {
  idP: string;
  idPat: string;
  descricaoPat: string;
  valorPat?: number | null;
  tbCCusto?: {
    idCCusto?: string | null;
    descricaoCCusto?: string | null;
  } | null;
  tbStatusPat?: {
    descricaoStatPat?: string | null;
  } | null;
};

export type AlocacaoVinculada = {
  idCad: string;
  idPatCad: string | null;
  idMatFunCad: string | null;
  dataDevPat?: string | null;
  dataCadPat?: string | null;
  tbFuncionario?: {
    idF: string;
    idMatFun: string;
    nomeFun: string;
    tbFuncao?: {
      nomeFuncao?: string | null;
    } | null;
    tbCCusto?: {
      descricaoCCusto?: string | null;
    } | null;
  } | null;
  tbPatrimonio?: {
    idPat: string;
    descricaoPat?: string | null;
  } | null;
};

export type InventarioItem = {
  idPat: string;
  descricaoPat: string;
  valorPat: string;
  centroCusto: string;
  localInventario: string;
  responsavelInventario: string;
  statusConferencia: 'CONFERIDO' | 'NAO_ENCONTRADO' | 'DIVERGENTE' | 'AVARIADO' | 'NAO_INVENTARIADO';
  observacao: string;
};

export type InventarioFormState = {
  codigoInventario: string;
  statusInventario: 'ABERTO' | 'FECHADO';
  dataInventario: string;
  centroCusto: string;
  responsavel: string;
  criadorInventario: string;
  local: string;
  observacao: string;
  itens: InventarioItem[];
};

export type InventarioProcessoApi = {
  codigoInventario: string;
  statusInventario: 'ABERTO' | 'FECHADO';
  dataInventario: string | null;
  dataFechamento: string | null;
  idCCusto: string | null;
  codigoCCusto: string | null;
  descricaoCCusto: string | null;
  responsavelInventario: string | null;
  criadoPorInventario: string | null;
  localInventario: string | null;
  observacaoInventario: string | null;
  resumoJson: Record<string, unknown> | null;
  itensJson: unknown;
  totalItens: number;
  conferidos: number;
  divergentes: number;
  naoEncontrados: number;
  avariados: number;
  naoInventariados: number;
  updatedAt: string | null;
};

export type InventarioProcesso = {
  codigoInventario: string;
  statusInventario: 'ABERTO' | 'FECHADO';
  dataInventario: string | null;
  dataFechamento: string | null;
  idCCusto: string | null;
  codigoCCusto: string;
  descricaoCCusto: string;
  responsavelInventario: string | null;
  localInventario: string | null;
  totalItens: number;
  conferidos: number;
  divergentes: number;
  naoEncontrados: number;
  avariados: number;
  naoInventariados: number;
  updatedAt: string | null;
};
