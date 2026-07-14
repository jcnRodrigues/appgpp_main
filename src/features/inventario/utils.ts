export function formatarMoeda(valor: number | string | null | undefined) {
  const numero = Number(valor || 0);
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numero);
}

export function formatarData(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
}

export function formatarDataHora(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(d);
}

export function primeiroNome(valor?: string | null) {
  const base = String(valor || '').trim();
  if (!base) return '';
  return base.split(/\s+/)[0] || base;
}

export function normalizarCodigoLido(codigo: string) {
  const limpo = codigo.trim();
  if (!limpo) return null;

  if (/^\d+$/.test(limpo)) {
    const semZeroEsquerda = limpo.replace(/^0+/, '');
    if (!semZeroEsquerda) return null;
    if (Number(semZeroEsquerda) <= 0) return null;
    return semZeroEsquerda;
  }

  return limpo.toUpperCase();
}
