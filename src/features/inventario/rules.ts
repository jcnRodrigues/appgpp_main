import type { InventarioItem, PatrimonioBusca } from '@/features/inventario/types';

export const statusInventarioOptions: Array<{
  value: InventarioItem['statusConferencia'];
  label: string;
  className: string;
}> = [
  { value: 'CONFERIDO', label: 'Conferido', className: 'bg-emerald-100 text-emerald-800' },
  { value: 'NAO_ENCONTRADO', label: 'Não encontrado', className: 'bg-red-100 text-red-800' },
  { value: 'DIVERGENTE', label: 'Divergente', className: 'bg-amber-100 text-amber-800' },
  { value: 'AVARIADO', label: 'Avariado', className: 'bg-orange-100 text-orange-800' },
  { value: 'NAO_INVENTARIADO', label: 'Não inventariado', className: 'bg-slate-100 text-slate-800' }
];

export function getStatusConferenciaPorCusto(patrimonio: PatrimonioBusca, centroInventario?: string) {
  const centroPatrimonio = patrimonio.tbCCusto?.idCCusto?.trim() || '';
  const centroSelecionado = centroInventario?.trim() || '';

  if (!centroSelecionado) {
    return 'NAO_INVENTARIADO' as const;
  }

  if (centroPatrimonio && centroPatrimonio === centroSelecionado) {
    return 'CONFERIDO' as const;
  }

  return 'DIVERGENTE' as const;
}

export function getRowClassName(status: InventarioItem['statusConferencia']) {
  if (status === 'CONFERIDO') return 'bg-emerald-50/70';
  if (status === 'DIVERGENTE') return 'bg-amber-50/70';
  if (status === 'NAO_INVENTARIADO') return 'bg-slate-50/70';
  if (status === 'NAO_ENCONTRADO') return 'bg-red-50/70';
  return '';
}
