'use client';

import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

type TableEmptyStateProps = {
  colSpan: number;
  title: string;
  description: string;
  loading?: boolean;
  loadingLabel?: string;
  Icon?: LucideIcon;
};

export function TableEmptyState({
  colSpan,
  title,
  description,
  loading = false,
  loadingLabel = 'Carregando...',
  Icon = Inbox
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-2 py-6">
        <div className="mx-auto flex max-w-sm flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/80 px-5 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-card text-foreground shadow-sm ring-1 ring-border/70">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">{loading ? loadingLabel : title}</p>
          <p className="mt-1 text-xs text-muted-foreground">{loading ? 'Aguarde um instante.' : description}</p>
        </div>
      </td>
    </tr>
  );
}
