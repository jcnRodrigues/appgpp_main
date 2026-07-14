'use client';

import Link from 'next/link';
import { ArrowRightLeft, FileDown, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TransferenciaHeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        className="flex gap-2 border bg-yellow-700 hover:bg-yellow-600"
        onClick={() => window.dispatchEvent(new Event('patrimonio-transferencia:gerar-pdf'))}
      >
        <FileDown className="h-5 w-5" />
        Gerar Relatório
      </Button>
      <Link href="/patrimoniolist/transferencia-custo/processos">
        <Button variant="ghost" className="flex gap-2 border bg-blue-700 hover:bg-blue-600">
          <ListChecks className="h-5 w-5" />
          Processos de transferência
        </Button>
      </Link>
      <Button
        type="button"
        variant="ghost"
        className="flex gap-2 border bg-green-700 hover:bg-green-600"
        onClick={() => window.dispatchEvent(new Event('patrimonio-transferencia:novo-processo'))}
      >
        <ArrowRightLeft className="h-5 w-5" />
        Nova transferência
      </Button>
    </div>
  );
}
