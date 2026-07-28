import Header from '@/components/Header/Header';
import PageHeader from '@/components/PageHeader/PageHeader';
import UnifiConfigForm from '@/features/unifi-config/components/UnifiConfigForm/UnifiConfigForm';
import { hasModuleAccess } from '@/lib/permissions';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { AuthOptions } from "@/lib/auth-options";
import { Settings } from 'lucide-react';

export default async function UnifiConfigPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="mx-auto max-w-4xl px-4 py-12 text-center">
                    <h1 className="mb-4 text-2xl font-bold">Configuração Ubiquiti</h1>
                    <div className="rounded-lg bg-white p-8 shadow-sm">
                        <p className="mb-6 text-lg">Faça login para visualizar esta página</p>
                    </div>
                </div>
            </div>
        );
    }

    const formularios = ((session.user as any)?.formularios || []) as string[];
  if (!hasModuleAccess(formularios, 'UNIFI_CONFIG')) redirect('/acesso-negado');

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="mx-auto max-w-[86.4rem] px-4">
                <PageHeader
                    icon={Settings}
                    title="Configuração Ubiquiti"
                    description="Configuração da API da UniFi"
                    backHref="/monitor-patrimonios"
                />
                <UnifiConfigForm />
            </div>
        </div>
    );
}

