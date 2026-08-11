'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasActionPermission, hasModuleActionPermission } from '@/lib/permissions';
import { cn } from '@/lib/utils';
import { notify as showNotify } from '@/lib/notify';

type DeleteResource =
    | 'funcionario'
    | 'patrimonio'
    | 'cadastro'
    | 'ccusto'
    | 'fornecedor'
    | 'função'
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
            fornecedor: 'FORNECEDORES',
            função: 'FUNCOES',
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
            showNotify('aviso', unauthorizedMessage);
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
                "items-center justify-center gap-2 rounded-lg border px-3 py-2  shadow-sm transition-colors hover:bg-red-600   focus-visible:ring-2 disabled:pointer-events-none ",
                className
            )}
            title={canDeleteDirectly ? title : 'Requer autorizacao para excluir'}
        >
            {children}
        </button>
    );
}
