'use client'

import { useState } from 'react';
import { useEnterToNext } from '@/back-end/hooks/useEnterToNext';
import { Button } from '@/back-end/components/ui/button';

type CentroCustoOption = {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
};

type LinhaResultado = {
    linha: number;
    idPat: string;
    valorInformado: number | null;
    valorSistema: number | null;
    status: 'OK' | 'VALOR_DIVERGENTE' | 'NAO_ENCONTRADO' | 'INVALIDO';
    mensagem: string;
};

type RespostaMedicao = {
    resumo: {
        totalLinhas: number;
        ok: number;
        divergentes: number;
        naoEncontrados: number;
        invalidos: number;
    };
    resultados: LinhaResultado[];
    naoInformados: Array<{
        idPat: string;
        descricaoPat: string | null;
        valorSistema: number | null;
    }>;
};

export default function MedicaoCCustoForm({ centros }: { centros: CentroCustoOption[] }) {
    const handleEnterToNext = useEnterToNext();
    const [centroSelecionado, setCentroSelecionado] = useState('');
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [resultado, setResultado] = useState<RespostaMedicao | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErro(null);
        setResultado(null);

        if (!centroSelecionado) {
            setErro('Selecione um centro de custo.');
            return;
        }
        if (!arquivo) {
            setErro('Selecione um arquivo Excel.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('idCCusto', centroSelecionado);
            formData.append('file', arquivo);

            const res = await fetch('/api/ccusto/medicao', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setErro(data.message || 'Falha ao processar o arquivo.');
                return;
            }

            const data = (await res.json()) as RespostaMedicao;
            setResultado(data);
        } catch (error) {
            console.error(error);
            setErro('Erro ao processar o arquivo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Centro de Custo</label>
                    <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={centroSelecionado}
                        onChange={(e) => setCentroSelecionado(e.target.value)}
                    >
                        <option value="">Selecione um centro de custo</option>
                        {centros.map((centro) => (
                            <option key={centro.idCCusto} value={centro.idCCusto}>
                                {(centro.codigoCCusto ? `${centro.codigoCCusto} - ` : '') +
                                    (centro.descricaoCCusto || 'Sem descriÃ§Ã£o')}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Arquivo Excel</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        A planilha deve ter colunas: <strong>idPat</strong> e <strong>valor</strong>.
                    </p>
                </div>

                {erro && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {erro}
                    </div>
                )}

                <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? 'Processando...' : 'Conferir PatrimÃ´nios'}
                </Button>
            </form>

            {resultado && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">Total de linhas</p>
                            <p className="text-xl font-semibold">{resultado.resumo.totalLinhas}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">OK</p>
                            <p className="text-xl font-semibold text-green-600">{resultado.resumo.ok}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">Divergentes</p>
                            <p className="text-xl font-semibold text-orange-600">{resultado.resumo.divergentes}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">NÃ£o encontrados</p>
                            <p className="text-xl font-semibold text-red-600">{resultado.resumo.naoEncontrados}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">InvÃ¡lidos</p>
                            <p className="text-xl font-semibold text-gray-600">{resultado.resumo.invalidos}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Linha</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">ID PatrimÃ´nio</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Valor Informado</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Valor Sistema</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultado.resultados.map((linha) => (
                                        <tr key={`${linha.linha}-${linha.idPat}`} className="border-b">
                                            <td className="px-4 py-3 text-sm">{linha.linha}</td>
                                            <td className="px-4 py-3 text-sm">{linha.idPat || '-'}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {linha.valorInformado !== null
                                                    ? linha.valorInformado.toFixed(2)
                                                    : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                {linha.valorSistema !== null ? linha.valorSistema.toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        linha.status === 'OK'
                                                            ? 'bg-green-100 text-green-800'
                                                            : linha.status === 'VALOR_DIVERGENTE'
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : linha.status === 'NAO_ENCONTRADO'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {linha.mensagem}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {resultado.naoInformados.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-4">
                            <h3 className="font-semibold mb-2">
                                PatrimÃ´nios no centro de custo que nÃ£o vieram no arquivo
                            </h3>
                            <ul className="text-sm text-gray-700 list-disc pl-4">
                                {resultado.naoInformados.map((item) => (
                                    <li key={item.idPat}>
                                        {item.idPat} - {item.descricaoPat || 'Sem descriÃ§Ã£o'} (R$ {item.valorSistema?.toFixed(2) || '0.00'})
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

