import { Suspense } from 'react';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header/Header';
import AutorizacaoDeleteForm from '@/features/autorizacao-delete/components/AutorizacaoDeleteForm/AutorizacaoDeleteForm';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { hasModuleActionPermission } from '@/lib/permissions';

export default async function AutorizacaoDeletePage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        redirect('/');
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
    if (!hasModuleActionPermission(formularios, 'AUTORIZACAO_DELETE', 'DELETE')) {
        redirect('/acesso-negado');
    }

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <Suspense fallback={<div className="max-w-md mx-auto px-4">Carregando...</div>}>
                <AutorizacaoDeleteForm />
            </Suspense>
        </div>
    );
}
