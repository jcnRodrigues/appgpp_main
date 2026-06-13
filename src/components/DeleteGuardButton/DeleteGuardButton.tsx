'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasActionPermission, hasModuleActionPermission } from '@/lib/permissions';
import { cn } from '@/lib/utils';

type DeleteResource =
    | 'funcionario'
    | 'patrimonio'
    | 'cadastro'
    | 'ccusto'
    | 'funcao'
    | 'licenca'
    | 'usuario_acesso'
    | 'unifi_config';

type DeleteGuardButtonProps = {
    resource: DeleteResource;
    module?: string;
    recordId?: string;
    onAuthorizedDelete: () => void;
    className: string;
    title?: string;
    unauthorizedBehavior?: 'authorize' | 'alert';
    unauthorizedMessage?: string;
    children: React.ReactNode;
};

export default function DeleteGuardButton({
    resource,
    module,
    recordId,
    onAuthorizedDelete,
    className,
    title = 'Excluir',
    unauthorizedBehavior = 'authorize',
    unauthorizedMessage = 'Você não tem permissão para excluir registros.',
    children
}: DeleteGuardButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const canDeleteDirectly = useMemo(() => {
        const formularios = ((session?.user as any)?.formularios || []) as string[];
        const inferredModule = module || {
            funcionario: 'FUNCIONARIOS',
            patrimonio: 'PATRIMONIO',
            cadastro: 'ALOCACOES',
            ccusto: 'CENTRO_CUSTO',
            funcao: 'FUNCOES',
            licenca: 'LICENCAS_SOFTWARE',
            usuario_acesso: 'ACESSO_USUARIOS',
            unifi_config: 'UNIFI_CONFIG'
        }[resource];

        if (inferredModule) {
            return hasModuleActionPermission(formularios, inferredModule, 'DELETE');
        }

        return hasActionPermission(formularios, 'DELETE');
    }, [module, resource, session]);

    const returnTo = useMemo(() => {
        const qs = searchParams?.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    }, [pathname, searchParams]);

    const handleClick = () => {
        if (canDeleteDirectly) {
            onAuthorizedDelete();
            return;
        }

        if (unauthorizedBehavior === 'alert') {
            window.systemAlert?.('aviso', unauthorizedMessage);
            return;
        }

        const params = new URLSearchParams({
            resource,
            returnTo
        });
        if (recordId) params.set('id', recordId);
        router.push(`/autorizacao-delete?${params.toString()}`);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={cn(
                "inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/15 bg-slate-900 px-3 py-2 text-rose-100 shadow-sm transition-colors hover:bg-rose-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/40 disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            title={canDeleteDirectly ? title : 'Requer autorizacao para excluir'}
        >
            {children}
        </button>
    );
}
