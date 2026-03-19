import Header from '@/back-end/components/Header/Header';

export default function AcessoNegadoPage() {
    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <h1 className="text-h3 font-bold mb-4">Acesso negado</h1>
                <p className="text-muted-foreground">
                    Voce nao possui permissao para acessar este formulario.
                </p>
            </div>
        </>
    );
}
