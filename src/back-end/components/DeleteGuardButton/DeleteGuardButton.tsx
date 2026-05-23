'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { hasActionPermission } from '@/lib/permissions';

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
        return hasActionPermission(formularios, 'DELETE');
    }, [session]);

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
            className={className}
            title={canDeleteDirectly ? title : 'Requer autorizacao para excluir'}
        >
            {children}
        </button>
    );
}
