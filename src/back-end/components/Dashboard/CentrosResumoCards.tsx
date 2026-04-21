interface CentroResumo {
  id: string;
  codigo: string;
  nome: string;
  funcionarios: number;
  patrimonios: number;
  previsaoMedicao: number;
}

export default function CentrosResumoCards({ centros }: { centros: CentroResumo[] }) {
  if (!centros.length) {
    return (
      <div className="bg-card text-muted-foreground border border-border rounded-lg shadow p-6 text-sm">
        Nenhum centro de custo encontrado para exibir os cards.
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Centros de Custo - Resumo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {centros.map((centro) => (
          <div key={centro.id} className="rounded-xl border border-border bg-muted/30 p-4 min-h-[168px] flex flex-col justify-between">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1">
                <p className="text-xs text-muted-foreground">{centro.codigo || 'Sem codigo'}</p>
                <h6 className="text-xs font-semibold text-foreground break-words leading-4">{centro.nome}</h6>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="rounded-md bg-card border border-border px-2 py-2 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] text-muted-foreground">Funcionarios</p>
                <p className="text-lg font-bold text-foreground">{centro.funcionarios}</p>
              </div>
              <div className="rounded-md bg-card border border-border px-2 py-2 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] text-muted-foreground">Patrimonios</p>
                <p className="text-lg font-bold text-foreground">{centro.patrimonios}</p>
              </div>
              <div className="rounded-md bg-card border border-border px-2 py-2 text-center flex flex-col items-center justify-center">
                <p className="text-[11px] text-muted-foreground">Prev Med</p>
                <p className="text-lg font-bold text-primary">{centro.previsaoMedicao}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
