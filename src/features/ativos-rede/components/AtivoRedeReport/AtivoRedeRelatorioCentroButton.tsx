'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/button';

export type AtivoRedeRelatorioItem = {
    codigoAtivoRede: string;
    nomeAtivoRede: string;
    tipoAtivoRede?: string | null;
    statusAtivoRede?: string | null;
    localInstalacaoAtivoRede?: string | null;
    dataEntradaAtivoRede?: string | Date | null;
    tbTipoAtivoRede?: {
        descricaoTipoAtivoRede?: string | null;
    } | null;
    tbStatusAtivoRede?: {
        descricaoStatusAtivoRede?: string | null;
    } | null;
};

type Props = {
    centroLabel: string;
    itens: AtivoRedeRelatorioItem[];
    disabled?: boolean;
};

type BadgeKind = 'ok' | 'warn' | 'error' | 'neutral';

function formatarData(valor?: string | Date | null) {
    if (!valor) return '-';
    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(data);
}

function formatarDataHora(valor: Date) {
    return new Intl.DateTimeFormat('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(valor);
}

function pdfSafeText(valor: string) {
    return String(valor || '')
        .replace(/[\u2013\u2014]/g, '-')
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ');
}

function normalizeStatus(valor?: string | null) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();
}

function statusKind(status?: string | null): BadgeKind {
    const s = normalizeStatus(status);
    if (s.includes('INATIVO')) return 'warn';
    if (s.includes('DEVOL')) return 'error';
    if (s.includes('ATIVO')) return 'ok';
    if (s.includes('MANUT')) return 'neutral';
    if (s.includes('TRANSFER')) return 'neutral';
    return 'neutral';
}

function badgePalette(kind: BadgeKind) {
    const palette = {
        ok: { bg: [226, 248, 236] as const, fg: [15, 125, 67] as const },
        warn: { bg: [255, 238, 218] as const, fg: [185, 83, 0] as const },
        error: { bg: [255, 224, 224] as const, fg: [171, 34, 34] as const },
        neutral: { bg: [233, 238, 246] as const, fg: [64, 83, 111] as const }
    } as const;

    return palette[kind];
}

function truncate(pdf: jsPDF, value: string, maxWidth: number) {
    const txt = pdfSafeText(value);
    if (pdf.getTextWidth(txt) <= maxWidth) return txt;
    let base = txt;
    while (base.length > 0 && pdf.getTextWidth(`${base}...`) > maxWidth) {
        base = base.slice(0, -1);
    }
    return base ? `${base}...` : '...';
}

function badgeWidth(pdf: jsPDF, text: string) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(6.4);
    return pdf.getTextWidth(pdfSafeText(text)) + 3.2;
}

function drawCard(
    pdf: jsPDF,
    x: number,
    top: number,
    w: number,
    h: number,
    title: string,
    value: string,
    subtitle: string,
    color: [number, number, number]
) {
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
    pdf.text(pdfSafeText(value), x + 2, top + 10.5);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(86, 98, 114);
    pdf.text(pdfSafeText(subtitle), x + 2, top + 15);
}

function drawBadge(pdf: jsPDF, x: number, top: number, text: string, kind: BadgeKind) {
    const p = badgePalette(kind);
    const width = badgeWidth(pdf, text);
    pdf.setFillColor(p.bg[0], p.bg[1], p.bg[2]);
    pdf.roundedRect(x, top - 2.8, width, 4.1, 2, 2, 'F');
    pdf.setTextColor(p.fg[0], p.fg[1], p.fg[2]);
    pdf.text(pdfSafeText(text), x + 1.6, top);
    return width;
}

export default function AtivoRedeRelatorioCentroButton({ centroLabel, itens, disabled }: Props) {
    const [loading, setLoading] = useState(false);

    const gerarPdf = () => {
        const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const contentWidth = pageWidth - margin * 2;
        const agora = new Date();
        const dataToken = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}`;
        const contadorKey = `pdf-emissao-ativos-rede-${dataToken}`;
        let contador = 1;

        try {
            const ultimo = Number(window.localStorage.getItem(contadorKey) || '0');
            contador = Number.isFinite(ultimo) ? ultimo + 1 : 1;
            window.localStorage.setItem(contadorKey, String(contador));
        } catch {
            contador = 1;
        }

        const emissaoCode = `AR${dataToken}-${String(contador).padStart(3, '0')}`;
        let y = 12;

        const ensureSpace = (needed: number) => {
            if (y + needed > pageHeight - 10) {
                pdf.addPage();
                y = 12;
            }
        };

        const addTableHeader = (headers: Array<string | string[]>, widths: number[]) => {
            const rowHeight = 11;
            const lineHeight = 3.4;
            ensureSpace(rowHeight);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(9.2);
            pdf.setFillColor(34, 47, 67);
            pdf.rect(margin, y, widths.reduce((acc, w) => acc + w, 0), rowHeight, 'F');
            let x = margin;
            pdf.setDrawColor(82, 96, 118);
            pdf.setLineWidth(0.55);
            pdf.setTextColor(245, 248, 255);

            headers.forEach((header, index) => {
                pdf.rect(x, y, widths[index], rowHeight, 'S');
                const lines = Array.isArray(header) ? header : [header];
                lines.forEach((line, lineIndex) => {
                    pdf.text(pdfSafeText(line), x + 1.6, y + 3.8 + (lineIndex * lineHeight));
                });
                x += widths[index];
            });

            y += rowHeight;
            pdf.setTextColor(35, 43, 54);
        };

        const addTableRow = (item: AtivoRedeRelatorioItem, widths: number[]) => {
            const cells = [
                item.codigoAtivoRede || '-',
                item.nomeAtivoRede || '-',
                item.tbTipoAtivoRede?.descricaoTipoAtivoRede || item.tipoAtivoRede || '-',
                item.tbStatusAtivoRede?.descricaoStatusAtivoRede || item.statusAtivoRede || '-',
                item.localInstalacaoAtivoRede || '-',
                formatarData(item.dataEntradaAtivoRede)
            ];

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(7.3);
            const lineHeight = 3.8;
            const split = cells.map((cell, index) => pdf.splitTextToSize(truncate(pdf, cell, widths[index] - 3), widths[index] - 3));
            const maxLines = Math.max(...split.map((s) => s.length), 1);
            const rowHeight = Math.max(7, maxLines * lineHeight + 2);
            ensureSpace(rowHeight);

            let x = margin;
            pdf.setDrawColor(156, 170, 190);
            pdf.setLineWidth(0.42);

            cells.forEach((cell, index) => {
                pdf.rect(x, y, widths[index], rowHeight);

                if (index === 3) {
                    const badgeY = y + (rowHeight / 2) + 1.2;
                    const w = badgeWidth(pdf, cell);
                    const badgeX = x + Math.max(1.2, (widths[index] - w) / 2);
                    drawBadge(pdf, badgeX, badgeY, cell, statusKind(cell));
                } else {
                    const center = index === 0 || index === 2 || index === 3 || index === 5;
                    pdf.setTextColor(35, 43, 54);
                    if (center) {
                        const blocoAltura = split[index].length * lineHeight;
                        const yCentro = y + ((rowHeight - blocoAltura) / 2) + 3.2;
                        pdf.text(split[index], x + (widths[index] / 2), yCentro, { align: 'center' });
                    } else {
                        pdf.text(split[index], x + 1.5, y + 4.3);
                    }
                }

                x += widths[index];
            });

            y += rowHeight;
        };

        const total = itens.length;
        const totalAtivos = itens.filter((item) => statusKind(item.tbStatusAtivoRede?.descricaoStatusAtivoRede || item.statusAtivoRede) === 'ok').length;
        const comLocal = itens.filter((item) => String(item.localInstalacaoAtivoRede || '').trim()).length;
        const semLocal = total - comLocal;

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.setTextColor(18, 24, 40);
        pdf.text('Relatório - Ativos de Rede', margin, y);
        const codeWidth = pdf.getTextWidth(emissaoCode);
        pdf.text(emissaoCode, pageWidth - margin - codeWidth, y);
        y += 6;

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(86, 98, 114);
        pdf.text(pdfSafeText(`Data/Hora: ${formatarDataHora(agora)}`), margin, y);
        y += 5;
        pdf.text(pdfSafeText(`Total de ativos de rede selecionados: ${total}`), margin, y);
        y += 6;

        ensureSpace(24);
        const gap = 2;
        const cardWidth = (contentWidth - gap * 3) / 4;
        const cardTop = y + 2;
        drawCard(pdf, margin, cardTop, cardWidth, 18, 'Total de itens', String(total), '-', [35, 43, 54]);
        drawCard(pdf, margin + cardWidth + gap, cardTop, cardWidth, 18, 'Status ativo', String(totalAtivos), '-', [15, 125, 67]);
        drawCard(pdf, margin + (cardWidth + gap) * 2, cardTop, cardWidth, 18, 'Com local', String(comLocal), '-', [64, 83, 111]);
        drawCard(pdf, margin + (cardWidth + gap) * 3, cardTop, cardWidth, 18, 'Sem local', String(semLocal), '-', [185, 83, 0]);
        y = cardTop + 22;

        ensureSpace(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(10);
        pdf.setTextColor(35, 43, 54);
        pdf.text('Detalhe da lista selecionada', margin, y);
        y += 5;

        ensureSpace(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9.5);
        pdf.setTextColor(35, 43, 54);
        pdf.text(pdfSafeText(`Centro de Custo: ${centroLabel}`), margin, y);
        y += 4.5;

        addTableHeader(
            [
                ['Código', 'Ativo'],
                'Nome',
                'Tipo',
                'Status',
                'Local',
                'Entrada'
            ],
            [28, 86, 38, 34, 48, 30]
        );

        itens.forEach((item) => {
            addTableRow(item, [28, 86, 38, 34, 48, 30]);
        });

        pdf.save(`${emissaoCode}.pdf`);
    };

    return (
        <Button
            type="button"
            onClick={async () => {
                setLoading(true);
                try {
                    gerarPdf();
                } finally {
                    setLoading(false);
                }
            }}
            disabled={disabled || loading || itens.length === 0}
            className="bg-amber-500 hover:bg-amber-600 text-white"
        >
            {loading ? 'Gerando...' : 'Gerar Relatório PDF'}
        </Button>
    );
}


