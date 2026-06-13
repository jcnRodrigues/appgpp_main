'use client'

import { useEffect, useState } from 'react';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { Eye, EyeOff } from 'lucide-react';
import ConferirPatrimoniosButton from './ConferirPatrimoniosButton';
import GerarRelatorioMedicaoButton from './GerarRelatorioMedicaoButton';
import GerarRelatorioMedicaoPdfButton from './GerarRelatorioMedicaoPdfButton';

type CentroCustoOption = {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
};

type LinhaResultado = {
    linha: number;
    idPat: string;
    descricaoPat: string | null;
    matriculaAlocada: string | null;
    nomeFuncionarioAlocado: string | null;
    statusPatrimonio: string | null;
    badgeAlocacao?: string | null;
    dataTransferenciaConsiderada?: string | null;
    valorInformado: number | null;
    valorSistema: number | null;
    detalheRateio: string | null;
    movimentosPatrimonio: string | null;
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
        statusPatrimonio?: string | null;
        devolvido?: boolean;
        detalheDevolucao?: string | null;
    }>;
};

type BmMedicao = {
    idBm: string;
    codigoBm: string;
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
    statusBm: 'ABERTO' | 'FECHADO';
    mesBm: number;
    anoBm: number;
    dataInicioMedicao: string;
    dataFimMedicao: string;
    gerouRelatorioExcel: boolean;
    gerouRelatorioPdf: boolean;
    updatedAt?: string;
    resumo: RespostaMedicao['resumo'] | null;
    resultados: LinhaResultado[] | null;
    naoInformados: RespostaMedicao['naoInformados'] | null;
};

type BmSelecionadoInfo = {
    idBm: string;
    codigoBm: string;
    statusBm: 'ABERTO' | 'FECHADO';
    dataInicioMedicao: string;
    dataFimMedicao: string;
} | null;

export default function MedicaoCCustoForm({
    centros,
    bmIdInicial
}: {
    centros: CentroCustoOption[];
    bmIdInicial?: string | null;
}) {
    const handleEnterToNext = useEnterToNext();
    const [centroSelecionado, setCentroSelecionado] = useState('');
    const [arquivo, setArquivo] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [resultado, setResultado] = useState<RespostaMedicao | null>(null);
    const [mostrarNaoInformados, setMostrarNaoInformados] = useState(false);
    const hoje = new Date().toISOString().slice(0, 10);
    const [dataInicioMedicao, setDataInicioMedicao] = useState(hoje);
    const [dataFimMedicao, setDataFimMedicao] = useState(hoje);
    const dataAtual = new Date();
    const [mesBm, setMesBm] = useState(String(dataAtual.getMonth() + 1).padStart(2, '0'));
    const [anoBm, setAnoBm] = useState(String(dataAtual.getFullYear()));
    const [bmAtualId, setBmAtualId] = useState<string | null>(null);
    const [bmSelecionadoInfo, setBmSelecionadoInfo] = useState<BmSelecionadoInfo>(null);

    const compararIdPatrimonio = (a: string, b: string) =>
        a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' });

    const formatarMoeda = (valor: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
    const formatarMoedaOuTraco = (valor: number | null) =>
        valor === null ? '-' : formatarMoeda(valor);
    const formatarDataPtBr = (value?: string | Date | null) => {
        if (!value) return '-';
        const data = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(data.getTime())) return '-';
        return new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(data);
    };
    const formatarDataInput = (value?: string | Date | null) => {
        if (!value) return '';
        const data = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(data.getTime())) return '';
        // Evita deslocamento de dia ao carregar datas salvas em UTC.
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(data);
    };
    const centroSelecionadoObj = centros.find((c) => c.idCCusto === centroSelecionado);
    const codigoCentroSelecionado =
        centroSelecionadoObj?.codigoCCusto || null;
    const centroSelecionadoLabel = centroSelecionadoObj
        ? `${centroSelecionadoObj.codigoCCusto ? `${centroSelecionadoObj.codigoCCusto} - ` : ''}${centroSelecionadoObj.descricaoCCusto || 'Sem descrição'}`
        : null;
    const bmFechado = bmSelecionadoInfo?.statusBm === 'FECHADO';

    const resumoInconsistencias = resultado
        ? {
            divergentes: resultado.resumo.divergentes,
            naoEncontrados: resultado.resumo.naoEncontrados,
            invalidos: resultado.resumo.invalidos,
            naoInformados: resultado.naoInformados.length,
            valorDivergentes: resultado.resultados
                .filter((r) => r.status === 'VALOR_DIVERGENTE')
                .reduce((acc, r) => acc + Math.abs((r.valorInformado ?? 0) - (r.valorSistema ?? 0)), 0),
            valorNaoEncontrados: resultado.resultados
                .filter((r) => r.status === 'NAO_ENCONTRADO')
                .reduce((acc, r) => acc + (r.valorInformado ?? 0), 0),
            valorInvalidos: resultado.resultados
                .filter((r) => r.status === 'INVALIDO')
                .reduce((acc, r) => acc + (r.valorInformado ?? 0), 0),
            valorNaoInformados: resultado.naoInformados
                .reduce((acc, r) => acc + (r.valorSistema ?? 0), 0),
            valorTotalLinhas: resultado.resultados
                .reduce((acc, r) => acc + (r.valorSistema ?? 0), 0),
            valorOk: resultado.resultados
                .filter((r) => r.status === 'OK')
                .reduce((acc, r) => acc + (r.valorSistema ?? 0), 0),
            total:
                resultado.resumo.divergentes +
                resultado.resumo.naoEncontrados +
                resultado.resumo.invalidos +
                resultado.naoInformados.length
        }
        : null;

    const resultadosOrdenados = resultado
        ? [...resultado.resultados].sort((a, b) => {
            const linhaDiff = a.linha - b.linha;
            if (linhaDiff !== 0) return linhaDiff;
            return compararIdPatrimonio(a.idPat || '', b.idPat || '');
        })
        : [];

    const naoInformadosOrdenados = resultado
        ? [...resultado.naoInformados].sort((a, b) => compararIdPatrimonio(a.idPat || '', b.idPat || ''))
        : [];


    useEffect(() => {
        if (bmIdInicial) {
            void carregarBm(bmIdInicial);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bmIdInicial]);

    const registrarBm = async (formato: 'excel' | 'pdf') => {
        if (bmFechado) {
            setErro('BM fechado não pode ser alterado.');
            return null;
        }
        if (!resultado || !centroSelecionado || !centroSelecionadoObj) return null;

        const res = await fetch('/api/ccusto/medicao/bm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idBm: bmAtualId,
                idCCusto: centroSelecionado,
                codigoCCusto: codigoCentroSelecionado,
                descricaoCCusto: centroSelecionadoObj.descricaoCCusto || null,
                mesBm,
                anoBm,
                dataInicioMedicao: `${dataInicioMedicao}T00:00:00`,
                dataFimMedicao: `${dataFimMedicao}T23:59:59.999`,
                resumo: resultado.resumo,
                resultados: resultado.resultados,
                naoInformados: resultado.naoInformados,
                formatoRelatorio: formato
            })
        });

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setErro(data.message || 'Falha ao registrar BM.');
            return null;
        }

        const data = await res.json();
        const bm = data.data as BmMedicao;
        setBmAtualId(bm.idBm);
        setBmSelecionadoInfo({
            idBm: bm.idBm,
            codigoBm: bm.codigoBm,
            statusBm: bm.statusBm,
            dataInicioMedicao: bm.dataInicioMedicao,
            dataFimMedicao: bm.dataFimMedicao
        });
        const ext = formato === 'excel' ? 'csv' : 'pdf';
        return `${bm.codigoBm}.${ext}`;
    };

    const carregarBm = async (idBm: string) => {
        const res = await fetch(`/api/ccusto/medicao/bm?idBm=${encodeURIComponent(idBm)}`);
        const data = await res.json();
        if (!res.ok) {
            setErro(data.message || 'Falha ao carregar BM.');
            return;
        }
        const bm = data.data as BmMedicao;
        setBmAtualId(bm.idBm);
        setBmSelecionadoInfo({
            idBm: bm.idBm,
            codigoBm: bm.codigoBm,
            statusBm: bm.statusBm,
            dataInicioMedicao: bm.dataInicioMedicao,
            dataFimMedicao: bm.dataFimMedicao
        });
        setCentroSelecionado(bm.idCCusto);
        setDataInicioMedicao(formatarDataInput(bm.dataInicioMedicao));
        setDataFimMedicao(formatarDataInput(bm.dataFimMedicao));
        setMesBm(String(bm.mesBm).padStart(2, '0'));
        setAnoBm(String(bm.anoBm));
        if (bm.resumo && bm.resultados && bm.naoInformados) {
            setResultado({
                resumo: bm.resumo,
                resultados: bm.resultados,
                naoInformados: bm.naoInformados
            });
        }
    };

    const atualizarBmSelecionado = async () => {
        if (bmFechado) {
            setErro('BM fechado não pode ser alterado.');
            return;
        }
        if (!bmAtualId || !resultado) {
            setErro('Selecione um BM e carregue a medição para atualizar.');
            return;
        }

        const res = await fetch('/api/ccusto/medicao/bm', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                idBm: bmAtualId,
                dataInicioMedicao: `${dataInicioMedicao}T00:00:00`,
                dataFimMedicao: `${dataFimMedicao}T23:59:59.999`,
                resumo: resultado.resumo,
                resultados: resultado.resultados,
                naoInformados: resultado.naoInformados
            })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            setErro(data.message || 'Falha ao atualizar o BM selecionado.');
            return;
        }

        const bm = data.data as BmMedicao;
        setBmSelecionadoInfo({
            idBm: bm.idBm,
            codigoBm: bm.codigoBm,
            statusBm: bm.statusBm,
            dataInicioMedicao: bm.dataInicioMedicao,
            dataFimMedicao: bm.dataFimMedicao
        });
    };


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
        if (!dataInicioMedicao) {
            setErro('Informe a data de início da medição.');
            return;
        }
        if (!dataFimMedicao) {
            setErro('Informe a data de fim da medição.');
            return;
        }
        if (dataInicioMedicao > dataFimMedicao) {
            setErro('A data de início não pode ser maior que a data de fim da medição.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('idCCusto', centroSelecionado);
            formData.append('file', arquivo);
            formData.append('dataInicioMedicao', dataInicioMedicao);
            formData.append('dataFimMedicao', dataFimMedicao);

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
            const resultadosOrdenados = [...(data.resultados || [])].sort((a, b) => {
                const linhaA = Number(a.linha) || 0;
                const linhaB = Number(b.linha) || 0;
                if (linhaA !== linhaB) return linhaA - linhaB;
                return compararIdPatrimonio(a.idPat || '', b.idPat || '');
            });
            setResultado({
                ...data,
                resultados: resultadosOrdenados
            });
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
                {bmSelecionadoInfo && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 flex items-center justify-between gap-3">
                        <p className="text-sm text-blue-900">
                            BM selecionado: <strong>{bmSelecionadoInfo.codigoBm}</strong> | {bmSelecionadoInfo.statusBm} | {formatarDataPtBr(bmSelecionadoInfo.dataInicioMedicao)} até {formatarDataPtBr(bmSelecionadoInfo.dataFimMedicao)}
                        </p>
                        <button
                            type="button"
                            className="text-xs px-2 py-1 rounded border bg-white"
                            onClick={atualizarBmSelecionado}
                            disabled={loading || !resultado || bmFechado}
                        >
                            Atualizar BM Selecionado
                        </button>
                    </div>
                )}
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <ConferirPatrimoniosButton loading={loading} />
                    <GerarRelatorioMedicaoButton
                        resultado={resultado}
                        disabled={loading || bmFechado}
                        onRegistrarBm={registrarBm}
                    />
                    <GerarRelatorioMedicaoPdfButton
                        resultado={resultado}
                        disabled={loading || bmFechado}
                        codigoCentroCusto={codigoCentroSelecionado}
                        centroCustoLabel={centroSelecionadoLabel}
                        periodoInicioMedicao={dataInicioMedicao}
                        periodoFimMedicao={dataFimMedicao}
                        onRegistrarBm={registrarBm}
                    />
                </div>


                <div>
                    <label className="block text-sm font-medium mb-2">Centro de Custo</label>
                    <select
                        className="w-full border rounded-lg px-3 py-2"
                        value={centroSelecionado}
                        onChange={(e) => setCentroSelecionado(e.target.value)}
                        disabled={bmFechado}
                    >
                        <option value="">Selecione um centro de custo</option>
                        {centros.map((centro) => (
                            <option key={centro.idCCusto} value={centro.idCCusto}>
                                {(centro.codigoCCusto ? `${centro.codigoCCusto} - ` : '') +
                                    (centro.descricaoCCusto || 'Sem descrição')}
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
                        disabled={bmFechado}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        A planilha deve ter colunas: <strong>idPat</strong> e <strong>valor</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Data Início da Medição
                        </label>
                        <input
                            type="date"
                            value={dataInicioMedicao}
                            onChange={(e) => setDataInicioMedicao(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            disabled={bmFechado}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Data Fim da Medição
                        </label>
                        <input
                            type="date"
                            value={dataFimMedicao}
                            onChange={(e) => setDataFimMedicao(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            disabled={bmFechado}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Mês BM
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={12}
                            value={mesBm}
                            onChange={(e) => setMesBm(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            disabled={bmFechado}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Ano BM
                        </label>
                        <input
                            type="number"
                            min={2000}
                            max={2099}
                            value={anoBm}
                            onChange={(e) => setAnoBm(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            disabled={bmFechado}
                        />
                    </div>
                </div>

                {erro && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        {erro}
                    </div>
                )}
            </form>

            {resultado && (
                <div className="space-y-6">
                    <div className={`rounded-lg border p-4 ${(resumoInconsistencias?.total || 0) > 0
                        ? 'bg-amber border-amber-200'
                        : 'bg-green-50 border-green-200'
                        }`}>
                        <h3 className="font-semibold text-sm">
                            Resumo de inconsistências da importação
                        </h3>
                        <p className="text-xs mt-1 text-gray-600">
                            Rateio calculado com base no período informado (inclusive início e fim da medição).
                        </p>
                        <p className="text-sm mt-1 text-gray-700">
                            {(resumoInconsistencias?.total || 0) > 0
                                ? `Foram encontradas ${resumoInconsistencias?.total} inconsistências no total.`
                                : 'Nenhuma inconsistência encontrada na importação.'}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-sm">
                            <div className="bg-white rounded border px-3 py-2">
                                <p className="text-xs text-gray-500">Valor divergente</p>
                                <p className="font-semibold text-orange-600">
                                    {resumoInconsistencias?.divergentes || 0}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {formatarMoeda(resumoInconsistencias?.valorDivergentes || 0)}
                                </p>
                            </div>
                            <div className="bg-white rounded border px-3 py-2">
                                <p className="text-xs text-gray-500">Não encontrado</p>
                                <p className="font-semibold text-red-600">{resumoInconsistencias?.naoEncontrados || 0}</p>
                                <p className="text-xs text-gray-500">{formatarMoeda(resumoInconsistencias?.valorNaoEncontrados || 0)}</p>
                            </div>
                            <div className="bg-white rounded border px-3 py-2">
                                <p className="text-xs text-gray-500">Linha inválida</p>
                                <p className="font-semibold text-gray-700">{resumoInconsistencias?.invalidos || 0}</p>
                                <p className="text-xs text-gray-500">{formatarMoeda(resumoInconsistencias?.valorInvalidos || 0)}</p>
                            </div>
                            <div className="bg-white rounded border px-3 py-2">
                                <p className="text-xs text-gray-500">Não informados no arquivo</p>
                                <p className="font-semibold text-slate-700">{resumoInconsistencias?.naoInformados || 0}</p>
                                <p className="text-xs text-gray-500">{formatarMoeda(resumoInconsistencias?.valorNaoInformados || 0)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">Total de linhas</p>
                            <p className="text-xl font-semibold">{resultado.resumo.totalLinhas}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatarMoeda(resumoInconsistencias?.valorTotalLinhas || 0)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">OK</p>
                            <p className="text-xl font-semibold text-green-600">{resultado.resumo.ok}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatarMoeda(resumoInconsistencias?.valorOk || 0)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">Divergentes</p>
                            <p className="text-xl font-semibold text-orange-600">{resultado.resumo.divergentes}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatarMoeda(resumoInconsistencias?.valorDivergentes || 0)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">Não encontrados</p>
                            <p className="text-xl font-semibold text-red-600">{resultado.resumo.naoEncontrados}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatarMoeda(resumoInconsistencias?.valorNaoEncontrados || 0)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <p className="text-xs text-gray-500">Inválidos</p>
                            <p className="text-xl font-semibold text-gray-600">{resultado.resumo.invalidos}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatarMoeda(resumoInconsistencias?.valorInvalidos || 0)}</p>
                        </div>
                    </div>

                    <div className="md:hidden space-y-3">
                        {resultadosOrdenados.map((linha) => (
                            <div key={`${linha.linha}-${linha.idPat}`}
                                className="bg-white rounded-lg shadow p-4 space-y-2">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900">Patrimônio: {linha.idPat || '-'}</div>
                                        <div className="text-xs text-gray-500">
                                            {linha.descricaoPat || 'Sem descrição'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Linha: {linha.linha}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Matrícula: {linha.matriculaAlocada || '-'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Funcionário: {linha.nomeFuncionarioAlocado || '-'}
                                        </div>
                                        {linha.badgeAlocacao && (
                                            <div className="mt-1">
                                                <span className="inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-semibold">
                                                    {linha.badgeAlocacao}
                                                </span>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500">
                                            Status Patrimônio: {linha.statusPatrimonio || '-'}
                                        </div>
                                    </div>
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${linha.status === 'OK'
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
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="text-gray-500">
                                        Valor Informado
                                    </div>
                                    <div className="text-gray-800 text-right">
                                        {formatarMoedaOuTraco(linha.valorInformado)}
                                    </div>
                                    <div className="text-gray-500">
                                        Valor Sistema
                                    </div>
                                    <div className="text-gray-800 text-right">
                                        {formatarMoedaOuTraco(linha.valorSistema)}
                                        {linha.detalheRateio && (
                                            <div className="text-[10px] text-gray-500 mt-1 whitespace-normal text-right">
                                                {linha.detalheRateio}
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-gray-500">
                                        Movimentos
                                    </div>
                                    <div className="text-gray-800 text-right">
                                        {linha.movimentosPatrimonio || '-'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Linha</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">ID Patrimônio</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Matrícula Alocada</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Status Patrimônio</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Valor Informado</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Valor Sistema</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Movimentos do Patrimônio</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultadosOrdenados.map((linha) => (
                                        <tr key={`${linha.linha}-${linha.idPat}`} className="border-b">
                                            <td className="px-4 py-3 text-sm text-[12px]">
                                                {linha.linha - 1}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[12px]">
                                                <div>
                                                    {linha.idPat || '-'}
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">
                                                    {linha.descricaoPat || 'Sem descrição'}
                                                </div>

                                            </td>
                                            <td className="px-4 py-3 text-sm text-[12px]">
                                                <div>
                                                    {linha.matriculaAlocada || '-'}
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">
                                                    {linha.nomeFuncionarioAlocado || '-'}
                                                </div>
                                                {linha.badgeAlocacao && (
                                                    <div className="mt-1">
                                                        <span className="inline-block rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[9px] font-semibold">
                                                            {linha.badgeAlocacao}
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[12px]">
                                                {linha.statusPatrimonio ? (
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs text-[9px] font-semibold 
                                                                ${linha.statusPatrimonio === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                                                linha.statusPatrimonio === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' :
                                                                    linha.statusPatrimonio === 'INATIVO' ? 'bg-orange-100 text-orange-800' :
                                                                        linha.statusPatrimonio === 'MANUTENÇÃO' ? 'bg-purple-100 text-purple-800' :
                                                                            linha.statusPatrimonio === 'TRANSFERIDO' ? 'bg-blue-100 text-blue-800' :
                                                                                'bg-gray-100 text-gray-800'
                                                            }`}
                                                    >
                                                        {linha.statusPatrimonio || '-'}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs text-[9px] font-semibold">
                                                        SEM STATUS
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[12px]">
                                                {formatarMoedaOuTraco(linha.valorInformado)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[12px]">
                                                {formatarMoedaOuTraco(linha.valorSistema)}
                                                {linha.detalheRateio && (
                                                    <div className="text-xs text-[8px] text-gray-500 mt-1">
                                                        {linha.detalheRateio}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-[11px] text-gray-700">
                                                {linha.movimentosPatrimonio || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs text-[9px] font-semibold 
                                                        ${linha.status === 'OK'
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
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="font-semibold">
                                    Patrimônios no centro de custo que não vieram no arquivo
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => setMostrarNaoInformados((prev) => !prev)}
                                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
                                    aria-label={mostrarNaoInformados ? 'Ocultar seção' : 'Visualizar seção'}
                                >
                                    {mostrarNaoInformados ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    <span>{mostrarNaoInformados ? 'Ocultar' : 'Visualizar'}</span>
                                </button>
                            </div>
                            {mostrarNaoInformados && (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[720px] text-sm">
                                        <thead className="bg-gray-50 border-b">
                                            <tr>
                                                <th className="px-3 py-2 text-left font-semibold">ID Patrimônio</th>
                                                <th className="px-3 py-2 text-left font-semibold">Descrição</th>
                                                <th className="px-3 py-2 text-left font-semibold">Valor Sistema</th>
                                                <th className="px-3 py-2 text-left font-semibold">Situação</th>
                                                <th className="px-3 py-2 text-left font-semibold">Detalhe</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {naoInformadosOrdenados.map((item) => (
                                                <tr key={item.idPat} className="border-b align-top">
                                                    <td className="px-3 py-2 text-[12px]">
                                                        {item.idPat}
                                                    </td>
                                                    <td className="px-3 py-2 text-[12px]">
                                                        {item.descricaoPat || 'Sem descrição'}
                                                    </td>
                                                    <td className="px-3 py-2 text-[12px]">
                                                        {formatarMoeda(item.valorSistema ?? 0)}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.statusPatrimonio ? (
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs text-[9px] font-semibold 
                                                                ${item.statusPatrimonio === 'ATIVO' ? 'bg-green-100 text-green-800' :
                                                                        item.statusPatrimonio === 'DEVOLUÇÃO' ? 'bg-red-100 text-red-800' :
                                                                            item.statusPatrimonio === 'INATIVO' ? 'bg-orange-100 text-orange-800' :
                                                                                item.statusPatrimonio === 'MANUTENÇÃO' ? 'bg-gray-100 text-purple-800' :
                                                                                    item.statusPatrimonio === 'TRANSFERIDO' ? 'bg-gray-100 text-blue-800' :
                                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}
                                                            >
                                                                {item.statusPatrimonio || '-'}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-block rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-semibold">
                                                                SEM STATUS
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-xs text-gray-700">{item.detalheDevolucao || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
