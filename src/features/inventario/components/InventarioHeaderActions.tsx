'use client';

'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { notify as showNotify } from '@/lib/notify';
import { hasModuleActionPermission } from '@/lib/permissions';

export default function InventarioHeaderActions() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canCreate = hasModuleActionPermission(formularios, 'INVENTARIO', 'CREATE');
  const canPrint = hasModuleActionPermission(formularios, 'INVENTARIO', 'PRINT');

  const iniciarInventario = async () => {
    try {
      const response = await fetch('/api/inventario/processos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao iniciar inventário.');
      }

      const codigo = String(data.codigo || '').trim().toUpperCase();
      if (codigo) {
        router.push(`/inventario?codigo=${encodeURIComponent(codigo)}`);
      }
    } catch (error) {
      console.error('Erro ao iniciar inventário:', error);
      showNotify('erro', error instanceof Error ? error.message : 'Erro ao iniciar inventário.');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canCreate ? (
        <Button
          type="button"
          variant="ghost"
          className="flex gap-2 border bg-emerald-700 hover:bg-emerald-600"
          onClick={iniciarInventario}
          disabled={status === 'loading'}
        >
          <Plus className="h-5 w-5" />
          Iniciar inventário
        </Button>
      ) : null}

      {canPrint ? (
        <Link href="/inventario/processos">
          <Button variant="ghost" className="flex gap-2 border bg-slate-700 hover:bg-slate-600">
            Inventários em processo
          </Button>
        </Link>
      ) : null}
    </div>
  );
}
