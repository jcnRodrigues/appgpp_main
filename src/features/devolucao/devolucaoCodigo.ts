export type DevolucaoCodigoPartes = {
  mes: number;
  ano: number;
  contador: number;
};

function pad2(valor: number) {
  return String(valor).padStart(2, '0');
}

export function formatarCodigoDevolucao(partes: DevolucaoCodigoPartes) {
  return `DEV${pad2(partes.mes)}${partes.ano}-${String(partes.contador).padStart(3, '0')}`;
}

export function extrairCodigoDevolucao(codigo?: string | null): DevolucaoCodigoPartes | null {
  const limpo = String(codigo || '').trim().toUpperCase();
  const match = /^DEV(\d{2})(\d{4})-(\d{3})$/.exec(limpo);
  if (!match) return null;

  const mes = Number(match[1]);
  const ano = Number(match[2]);
  const contador = Number(match[3]);

  if (!Number.isInteger(mes) || mes < 1 || mes > 12) return null;
  if (!Number.isInteger(ano) || ano < 2000 || ano > 2099) return null;
  if (!Number.isInteger(contador) || contador < 1) return null;

  return { mes, ano, contador };
}

