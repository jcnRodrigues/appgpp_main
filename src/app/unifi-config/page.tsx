import Header from '@/back-end/components/Header/Header';
import UnifiConfigForm from '@/back-end/components/UnifiConfigForm/UnifiConfigForm';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '../api/auth/[...nextauth]/route';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function UnifiConfigPage() {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Configuração Ubiquiti</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faça login para visualizar esta página</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <div className="max-w-[86.4rem] mx-auto px-4">
                <div className="form-title-sticky flex items-center justify-between mb-8 mt-4">
                    <div className="flex items-center gap-4">
                        <Link href="/monitor-patrimonios" className="mr-4">
                            <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition" />
                        </Link>
                        <div>
                            <h1 className="text-h2 font-bold">Configuração Ubiquiti</h1>
                            <p className="text-gray-600 text-sm mt-1">Configuração e monitoramento da rede Ubiquiti</p>
                        </div>
                    </div>
                </div>
                <UnifiConfigForm />
            </div>
        </div>
    );
}