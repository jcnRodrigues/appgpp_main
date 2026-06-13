import { Suspense } from 'react';
import Header from '@/components/Header/Header';
import AutorizacaoDeleteForm from '@/features/autorizacao-delete/components/AutorizacaoDeleteForm/AutorizacaoDeleteForm';

export default function AutorizacaoDeletePage() {
    return (
        <div className="bg-background min-h-screen py-6">
            <Header />
            <Suspense fallback={<div className="max-w-md mx-auto px-4">Carregando...</div>}>
                <AutorizacaoDeleteForm />
            </Suspense>
        </div>
    );
}
