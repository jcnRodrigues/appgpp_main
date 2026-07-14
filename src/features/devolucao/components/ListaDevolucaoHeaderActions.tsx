'use client';

import Link from 'next/link';
import { FileDown, FilePlus2, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EVENTO_GERAR_PDF = 'patrimonio-lista-devolucao:gerar-pdf';

export function dispararGerarPdfListaDevolucao() {
  window.dispatchEvent(new Event(EVENTO_GERAR_PDF));
}

export default function ListaDevolucaoHeaderActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="ghost"
        className="flex gap-2 border bg-yellow-700 hover:bg-yellow-600 "
        onClick={dispararGerarPdfListaDevolucao}
      >
        <FileDown className="h-5 w-5" />
        Gerar PDF da Lista
      </Button>
      <Link href="/patrimoniolist/lista-devolucao/processos">
        <Button variant="ghost" 
        className="flex gap-2 border bg-blue-700  hover:bg-blue-600">
          <ListChecks className="h-5 w-5" />
          Processos de devolução
        </Button>
      </Link>
      <Link href="/patrimoniolist/lista-devolucao?novo=1">
        <Button variant="ghost"
          className="flex gap-2 border bg-green-700  hover:bg-green-600">
          <FilePlus2 className="h-5 w-5" />
          Nova devolução
        </Button>
      </Link>
    </div>
  );
}
