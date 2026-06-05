'use client';

import { Button } from '@/back-end/components/ui/button';

type LinhaResultado = {
    linha: number;
    idPat: string;
    descricaoPat: string | null;
    matriculaAlocada: string | null;
    nomeFuncionarioAlocado: string | null;
    statusPatrimonio: string | null;
    dataTransferenciaConsiderada?: string | null;
    valorInformado: number | null;
    valorSistema: number | null;
    detalheRateio?: string | null;
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
        detalheDevolucao?: string | null;
    }>;
};

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

function formatarMoedaOuTraco(valor: number | null) {
    return valor === null ? '-' : formatarMoeda(valor);
}

function limparDetalheRateio(detalhe?: string | null) {
    if (!detalhe) return '';
    return detalhe
        .replace(/\s*\|\s*Base da medição:[^|]*/gi, '')
        .trim();
}

function escaparCsv(valor: string | number) {
    return `"${String(valor).replace(/"/g, '""')}"`;
}

export default function GerarRelatorioMedicaoButton({
    resultado,
    disabled,
    onRegistrarBm
}: {
    resultado: RespostaMedicao | null;
    disabled?: boolean;
    onRegistrarBm?: (formato: 'excel') => Promise<string | null>;
}) {
    const handleGerarRelatorio = async () => {
        if (!resultado) return;

        const valorDivergentes = resultado.resultados
            .filter((r) => r.status === 'VALOR_DIVERGENTE')
            .reduce((acc, r) => acc + Math.abs((r.valorInformado ?? 0) - (r.valorSistema ?? 0)), 0);
        const valorNaoEncontrados = resultado.resultados
            .filter((r) => r.status === 'NAO_ENCONTRADO')
            .reduce((acc, r) => acc + (r.valorInformado ?? 0), 0);
        const valorInvalidos = resultado.resultados
            .filter((r) => r.status === 'INVALIDO')
            .reduce((acc, r) => acc + (r.valorInformado ?? 0), 0);
        const valorNaoInformados = resultado.naoInformados
            .reduce((acc, r) => acc + (r.valorSistema ?? 0), 0);
        const valorTotalLinhas = resultado.resultados
            .reduce((acc, r) => acc + (r.valorSistema ?? 0), 0);
        const valorOk = resultado.resultados
            .filter((r) => r.status === 'OK')
            .reduce((acc, r) => acc + (r.valorSistema ?? 0), 0);

        const linhas: string[] = [];
        linhas.push('RELATORIO DE MEDICAO');
        linhas.push(`Data/Hora;${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`);
        linhas.push('');
        linhas.push('RESUMO');
        linhas.push('Indicador;Quantidade;Valor');
        linhas.push(`OK;${resultado.resumo.ok};${formatarMoeda(valorOk)}`);
        linhas.push(`Valor divergente;${resultado.resumo.divergentes};${formatarMoeda(valorDivergentes)}`);
        linhas.push(`Nao encontrado;${resultado.resumo.naoEncontrados};${formatarMoeda(valorNaoEncontrados)}`);
        linhas.push(`Linha invalida;${resultado.resumo.invalidos};${formatarMoeda(valorInvalidos)}`);
        linhas.push(`Nao informados no arquivo;${resultado.naoInformados.length};${formatarMoeda(valorNaoInformados)}`);
        linhas.push(`Total de linhas;${resultado.resumo.totalLinhas};${formatarMoeda(valorTotalLinhas)}`);
        linhas.push('');
        linhas.push('DETALHE DA CONFERENCIA');
        linhas.push('Linha;ID Patrimonio;Matricula Alocada;Status Patrimonio;Data Transferencia Considerada;Valor Informado;Valor Sistema;Rateio;Movimentos do Patrimonio;Status;Mensagem');

        for (const item of resultado.resultados) {
            linhas.push([
                item.linha,
                escaparCsv(`${item.idPat || '-'}\n${item.descricaoPat || 'Sem descricao'}`),
                escaparCsv(`${item.matriculaAlocada || '-'}\n${item.nomeFuncionarioAlocado || '-'}`),
                escaparCsv(item.statusPatrimonio || 'SEM STATUS'),
                escaparCsv(item.dataTransferenciaConsiderada || '-'),
                escaparCsv(formatarMoedaOuTraco(item.valorInformado)),
                escaparCsv(formatarMoedaOuTraco(item.valorSistema)),
                escaparCsv(limparDetalheRateio(item.detalheRateio) || '-'),
                escaparCsv(item.movimentosPatrimonio || '-'),
                escaparCsv(item.status),
                escaparCsv(item.mensagem)
            ].join(';'));
        }

        linhas.push('');
        linhas.push('PATRIMONIOS NAO INFORMADOS');
        linhas.push('ID Patrimonio;Descricao;Valor Sistema;Situacao;Detalhe');

        for (const item of resultado.naoInformados) {
            linhas.push([
                escaparCsv(item.idPat),
                escaparCsv(item.descricaoPat || 'Sem descricao'),
                escaparCsv(formatarMoeda(item.valorSistema ?? 0)),
                escaparCsv(item.statusPatrimonio || 'SEM STATUS'),
                escaparCsv(item.detalheDevolucao || '-')
            ].join(';'));
        }

        const conteudo = `\uFEFF${linhas.join('\n')}`;
        const blob = new Blob([conteudo], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const nomeArquivo = (await onRegistrarBm?.('excel')) || 'relatorio-medicao.csv';
        link.download = nomeArquivo.endsWith('.csv') ? nomeArquivo : `${nomeArquivo}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Button type="button" onClick={handleGerarRelatorio} disabled={!resultado || disabled}>
            Gerar Relatorio da Medicao
        </Button>
    );
}
