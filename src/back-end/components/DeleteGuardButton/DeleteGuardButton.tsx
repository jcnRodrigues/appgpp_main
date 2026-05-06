'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
    children: React.ReactNode;
};

export default function DeleteGuardButton({
    resource,
    recordId,
    onAuthorizedDelete,
    className,
    title = 'Excluir',
    children
}: DeleteGuardButtonProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const canDeleteAny = useMemo(() => {
        const formularios = ((session?.user as any)?.formularios || []) as string[];
        return Array.isArray(formularios) && formularios.includes('DELETE_ANY');
    }, [session]);

    const returnTo = useMemo(() => {
        const qs = searchParams?.toString();
        return qs ? `${pathname}?${qs}` : pathname;
    }, [pathname, searchParams]);

    const handleClick = () => {
        if (canDeleteAny) {
            onAuthorizedDelete();
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
            title={canDeleteAny ? title : 'Requer autorização para excluir'}
        >
            {children}
        </button>
    );
}

