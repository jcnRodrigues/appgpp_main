'use client';

import jsPDF from 'jspdf';
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

function pdfSafeText(valor: string) {
    return String(valor)
        .replace(/[\u2013\u2014]/g, '-')
        // Preserva quebras de linha para células com conteúdo em duas linhas
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ');
}

function kindStatusPatrimonio(status: string): 'ok' | 'warn' | 'error' | 'neutral' {
    const s = status.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    if (s.includes('ATIVO')) return 'ok';
    if (s.includes('DEVOLUCAO')) return 'error';
    if (s.includes('INATIVO')) return 'warn';
    if (s.includes('MANUTENCAO')) return 'neutral';
    if (s.includes('TRANSFERIDO')) return 'neutral';
    return 'neutral';
}

function truncarTextoPdf(pdf: jsPDF, texto: string, larguraMax: number) {
    const limpo = pdfSafeText(texto || '');
    if (pdf.getTextWidth(limpo) <= larguraMax) return limpo;
    let base = limpo;
    while (base.length > 0 && pdf.getTextWidth(`${base}...`) > larguraMax) {
        base = base.slice(0, -1);
    }
    return base ? `${base}...` : '...';
}

export default function GerarRelatorioMedicaoPdfButton({
    resultado,
    disabled,
    codigoCentroCusto,
    centroCustoLabel,
    periodoInicioMedicao,
    periodoFimMedicao,
    onRegistrarBm
}: {
    resultado: RespostaMedicao | null;
    disabled?: boolean;
    codigoCentroCusto?: string | null;
    centroCustoLabel?: string | null;
    periodoInicioMedicao?: string | null;
    periodoFimMedicao?: string | null;
    onRegistrarBm?: (formato: 'pdf') => Promise<string | null>;
}) {
    const handleGerarPdf = async () => {
        if (!resultado) return;
        const nomeArquivoPdf = (await onRegistrarBm?.('pdf')) || `BM${String(codigoCentroCusto || '').replace(/\D/g, '').padStart(4, '0').slice(-4)}.pdf`;
        const nomenclaturaBm = nomeArquivoPdf.replace(/\.pdf$/i, '');

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
        const agora = new Date();
        const inicioConferencia = periodoInicioMedicao
            ? new Date(`${periodoInicioMedicao}T00:00:00`)
            : new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), 0, 0, 0);
        const fimConferencia = periodoFimMedicao
            ? new Date(`${periodoFimMedicao}T23:59:59`)
            : agora;
        const formatoDataHora = (d: Date) =>
            d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const contentWidth = pageWidth - margin * 2;
        let y = 12;

        const ensureSpace = (needed: number) => {
            if (y + needed > pageHeight - 10) {
                pdf.addPage();
                y = 12;
            }
        };

        const drawCard = (x: number, top: number, w: number, h: number, title: string, qtd: string, valor: string, color: [number, number, number]) => {
            pdf.setDrawColor(220, 226, 232);
            pdf.setFillColor(250, 251, 252);
            pdf.roundedRect(x, top, w, h, 1.8, 1.8, 'FD');
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(86, 98, 114);
            pdf.text(pdfSafeText(title), x + 2, top + 5);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(color[0], color[1], color[2]);
            pdf.setFontSize(12);
            pdf.text(pdfSafeText(qtd), x + 2, top + 10.5);
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(8);
            pdf.setTextColor(86, 98, 114);
            pdf.text(pdfSafeText(valor), x + 2, top + 15);
        };

        const drawStatusBadge = (x: number, top: number, text: string, kind: 'ok' | 'warn' | 'error' | 'neutral') => {
            const palette = {
                ok: { bg: [226, 248, 236], fg: [15, 125, 67] },
                warn: { bg: [255, 238, 218], fg: [185, 83, 0] },
                error: { bg: [255, 224, 224], fg: [171, 34, 34] },
                neutral: { bg: [233, 238, 246], fg: [64, 83, 111] }
            } as const;
            const p = palette[kind];
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6.4);
            const textWidth = pdf.getTextWidth(text) + 3.2;
            pdf.setFillColor(p.bg[0], p.bg[1], p.bg[2]);
            pdf.roundedRect(x, top - 2.8, textWidth, 4.1, 2, 2, 'F');
            pdf.setTextColor(p.fg[0], p.fg[1], p.fg[2]);
            pdf.text(pdfSafeText(text), x + 1.6, top);
            return textWidth;
        };

        const measureStatusBadgeWidth = (text: string) => {
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(6.4);
            return pdf.getTextWidth(text) + 3.2;
        };

        const addTableHeader = (headers: Array<string | string[]>, widths: number[]) => {
            const fontSize = 9.2;
            const rowHeight = 11;
            const lineHeight = 3.4;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(fontSize);

            ensureSpace(rowHeight);
            const totalWidth = widths.reduce((acc, w) => acc + w, 0);
            pdf.setFillColor(34, 47, 67);
            pdf.rect(margin, y, totalWidth, rowHeight, 'F');

            let x = margin;
            pdf.setDrawColor(82, 96, 118);
            pdf.setLineWidth(0.55);
            pdf.setTextColor(245, 248, 255);
            for (let i = 0; i < headers.length; i += 1) {
                pdf.rect(x, y, widths[i], rowHeight, 'S');
                const headerValue = headers[i];
                const lines = Array.isArray(headerValue) ? headerValue : [headerValue];
                for (let j = 0; j < lines.length; j += 1) {
                    pdf.text(pdfSafeText(lines[j]), x + 1.6, y + 3.8 + (j * lineHeight));
                }
                x += widths[i];
            }
            y += rowHeight;
            pdf.setTextColor(35, 43, 54);
        };

        const addTableRow = (
            cells: string[],
            widths: number[],
            opts?: {
                statusBadges?: Array<{ col: number; kind: 'ok'|'warn'|'error'|'neutral' }>;
                centerCols?: number[];
            }
        ) => {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7.3);
            const lineHeight = 3.8;
            const split = cells.map((c, i) => pdf.splitTextToSize(pdfSafeText(c), widths[i] - 3));
            const maxLines = Math.max(...split.map((s) => s.length), 1);
            const rowHeight = Math.max(7, maxLines * lineHeight + 2);
            ensureSpace(rowHeight);
            let x = margin;
            pdf.setDrawColor(156, 170, 190);
            pdf.setLineWidth(0.42);
            for (let i = 0; i < cells.length; i += 1) {
                pdf.rect(x, y, widths[i], rowHeight);
                const badge = opts?.statusBadges?.find((b) => b.col === i);
                if (badge) {
                    const statusTxt = cells[i];
                    const badgeWidth = measureStatusBadgeWidth(statusTxt);
                    const badgeX = x + Math.max(1.2, (widths[i] - badgeWidth) / 2);
                    const badgeY = y + (rowHeight / 2) + 1.2;
                    drawStatusBadge(badgeX, badgeY, statusTxt, badge.kind);
                } else if ((i === 1 || i === 2) && cells[i].includes('\n')) {
                    const [linhaPrincipal, ...resto] = cells[i].split('\n');
                    const linhaSecundaria = resto.join(' ').trim();
                    const larguraUtil = widths[i] - 3.2;
                    pdf.setTextColor(15, 23, 42);
                    pdf.setFontSize(7.3);
                    pdf.text(truncarTextoPdf(pdf, linhaPrincipal, larguraUtil), x + 1.5, y + 4.3);
                    if (linhaSecundaria) {
                        pdf.setTextColor(100, 116, 139);
                        pdf.setFontSize(6.1);
                        pdf.text(truncarTextoPdf(pdf, linhaSecundaria, larguraUtil), x + 1.5, y + 8.2);
                    }
                } else {
                    pdf.setTextColor(35, 43, 54);
                    const centralizar = !!opts?.centerCols?.includes(i);
                    if (centralizar) {
                        const blocoAltura = split[i].length * lineHeight;
                        const yCentro = y + ((rowHeight - blocoAltura) / 2) + 3.2;
                        pdf.text(split[i], x + (widths[i] / 2), yCentro, { align: 'center' });
                    } else {
                        pdf.text(split[i], x + 1.5, y + 4.3);
                    }
                }
                x += widths[i];
            }
            y += rowHeight;
        };

        // Cabeçalho
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(18, 24, 40);
        pdf.text('Relatório de Medição', margin, y);
        const bmText = pdfSafeText(`BM: ${nomenclaturaBm}`);
        const bmTextWidth = pdf.getTextWidth(bmText);
        pdf.text(bmText, pageWidth - margin - bmTextWidth, y);
        y += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(86, 98, 114);
        pdf.text(pdfSafeText(`Data/Hora: ${formatoDataHora(agora)}`), margin, y);
        y += 5;
        pdf.text(pdfSafeText(`Centro de Custo: ${centroCustoLabel || 'Não informado'}`), margin, y);
        y += 5;
        pdf.text(
            pdfSafeText(`Período de conferência: Início ${formatoDataHora(inicioConferencia)} | Fim ${formatoDataHora(fimConferencia)}`),
            margin,
            y
        );
        y += 6;

        // Resumo cards (4)
        ensureSpace(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(35, 43, 54);
        pdf.setFontSize(10);
        pdf.text(pdfSafeText('Resumo de inconsistências da importação'), margin, y);
        y += 2;

        const gap = 2;
        const cW = (contentWidth - gap * 3) / 4;
        const cardTop = y + 3;
        drawCard(margin, cardTop, cW, 18, 'Valor divergente', String(resultado.resumo.divergentes), formatarMoeda(valorDivergentes), [185, 83, 0]);
        drawCard(margin + cW + gap, cardTop, cW, 18, 'Não encontrado', String(resultado.resumo.naoEncontrados), formatarMoeda(valorNaoEncontrados), [171, 34, 34]);
        drawCard(margin + (cW + gap) * 2, cardTop, cW, 18, 'Linha inválida', String(resultado.resumo.invalidos), formatarMoeda(valorInvalidos), [64, 83, 111]);
        drawCard(margin + (cW + gap) * 3, cardTop, cW, 18, 'Não informados no arquivo', String(resultado.naoInformados.length), formatarMoeda(valorNaoInformados), [64, 83, 111]);
        y = cardTop + 21;

        // Totais cards (5)
        ensureSpace(24);
        const cW5 = (contentWidth - gap * 4) / 5;
        const tTop = y + 2;
        drawCard(margin, tTop, cW5, 18, 'Total de linhas', String(resultado.resumo.totalLinhas), formatarMoeda(valorTotalLinhas), [35, 43, 54]);
        drawCard(margin + (cW5 + gap) * 1, tTop, cW5, 18, 'OK', String(resultado.resumo.ok), formatarMoeda(valorOk), [15, 125, 67]);
        drawCard(margin + (cW5 + gap) * 2, tTop, cW5, 18, 'Divergentes', String(resultado.resumo.divergentes), formatarMoeda(valorDivergentes), [185, 83, 0]);
        drawCard(margin + (cW5 + gap) * 3, tTop, cW5, 18, 'Não encontrados', String(resultado.resumo.naoEncontrados), formatarMoeda(valorNaoEncontrados), [171, 34, 34]);
        drawCard(margin + (cW5 + gap) * 4, tTop, cW5, 18, 'Inválidos', String(resultado.resumo.invalidos), formatarMoeda(valorInvalidos), [64, 83, 111]);
        y = tTop + 22;

        // Tabela principal
        ensureSpace(18);
        y += 2;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(35, 43, 54);
        pdf.text(pdfSafeText('Detalhe da conferência'), margin, y);
        y += 3.5;

        const cols = [10, 34, 44, 20, 24, 20, 20, 40, contentWidth - (10 + 34 + 44 + 20 + 24 + 20 + 20 + 40)];
        addTableHeader(
            [
                'Linha',
                ['ID', 'Patrimônio'],
                ['Matrícula', 'Funcionário'],
                ['Status', 'Patrimônio'],
                ['Data', 'Transferência'],
                ['Valor', 'Informado'],
                ['Valor', 'Sistema'],
                ['Movimentos', 'Patrimônio'],
                'Status'
            ],
            cols
        );
        resultado.resultados.forEach((r) => {
            let statusConferenciaKind: 'ok'|'warn'|'error'|'neutral' = 'neutral';
            if (r.status === 'OK') statusConferenciaKind = 'ok';
            if (r.status === 'VALOR_DIVERGENTE') statusConferenciaKind = 'warn';
            if (r.status === 'NAO_ENCONTRADO') statusConferenciaKind = 'error';
            addTableRow(
                [
                    String(r.linha -1), // -1 para considerar que a linha 1 é o cabeçalho do arquivo
                    `${r.idPat || '-'}\n${r.descricaoPat || 'Sem descrição'}`,
                    `${r.matriculaAlocada || '-'}\n${r.nomeFuncionarioAlocado || '-'}`,
                    r.statusPatrimonio || 'SEM STATUS',
                    r.dataTransferenciaConsiderada || '-',
                    formatarMoedaOuTraco(r.valorInformado),
                    formatarMoedaOuTraco(r.valorSistema),
                    r.movimentosPatrimonio || '-',
                    r.mensagem
                ],
                cols,
                {
                    centerCols: [0, 4, 5, 6],
                    statusBadges: [
                        { col: 3, kind: kindStatusPatrimonio(r.statusPatrimonio || 'SEM STATUS') },
                        { col: 8, kind: statusConferenciaKind }
                    ]
                }
            );
        });

        // Seção "não vieram" sempre nova página
        pdf.addPage();
        y = 12;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(18, 24, 40);
        pdf.text(pdfSafeText('Patrimônios no centro de custo que não vieram no arquivo'), margin, y);
        y += 6;

        const cols2 = [20, 46, 24, 28, contentWidth - (20 + 46 + 24 + 28)];
        addTableHeader(
            [
                ['ID', 'Patrimônio'],
                'Descrição',
                ['Valor', 'Sistema'],
                'Situação',
                'Detalhe'
            ],
            cols2
        );
        resultado.naoInformados.forEach((r) => {
            addTableRow([
                r.idPat,
                r.descricaoPat || 'Sem descrição',
                formatarMoeda(r.valorSistema ?? 0),
                r.statusPatrimonio || 'SEM STATUS',
                r.detalheDevolucao || '-'
            ], cols2);
        });

        pdf.save(nomeArquivoPdf);
    };

    return (
        <Button type="button" onClick={handleGerarPdf} disabled={!resultado || disabled}>
            Gerar Relatório PDF
        </Button>
    );
}
