'use client';

import jsPDF from 'jspdf';

export type ItemBusca = {
  idP: string;
  idPat: string;
  descricaoPat: string;
  valorPat: number | null;
  dataEntPat: string | null;
  dataSaiPat?: string | null;
  idDevolucao?: string | null;
  idDevolucaoProcesso?: string | null;
  dataInicioDevolucao?: string | null;
  dataFimDevolucao?: string | null;
  dataSaidaFornecedor?: string | null;
  dataChegadaFornecedor?: string | null;
  motivoDevolucao?: string | null;
  notaFiscalDevolucao?: string | null;
  tbTipoPat?: { descricaoTipPat?: string | null } | null;
  tbStatusPat?: { descricaoStatPat?: string | null } | null;
  tbCCusto?: { descricaoCCusto?: string | null } | null;
};

function formatarMoeda(valor?: number | null) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function formatarData(value?: string | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d);
}

function pdfSafeText(valor: string) {
  return String(valor)
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' ');
}

function kindStatusPatrimonio(status?: string | null): 'ok' | 'warn' | 'error' | 'neutral' {
  const s = String(status || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
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

export function gerarListaPatrimoniosPdf(selecionados: ItemBusca[], codigoDevolucao?: string) {
  if (selecionados.length === 0) return;

  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const margin = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
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
    const rowHeight = 11;
    const lineHeight = 3.4;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.2);
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
      const lines: string[] = Array.isArray(headerValue) ? headerValue : [headerValue];
      for (let j = 0; j < lines.length; j += 1) {
        pdf.text(pdfSafeText(lines[j]), x + 1.6, y + 3.8 + (j * lineHeight));
      }
      x += widths[i];
    }
    y += rowHeight;
    pdf.setTextColor(35, 43, 54);
  };

  const addTableRow = (cells: string[], widths: number[]) => {
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
      if (i === 4) {
        const statusTxt = cells[i];
        const badgeWidth = measureStatusBadgeWidth(statusTxt);
        const badgeX = x + Math.max(1.2, (widths[i] - badgeWidth) / 2);
        const badgeY = y + (rowHeight / 2) + 1.2;
        drawStatusBadge(badgeX, badgeY, statusTxt, kindStatusPatrimonio(statusTxt));
      } else if (i === 1 && cells[i].includes('\n')) {
        const [linhaPrincipal, ...resto] = cells[i].split('\n');
        const linhaSecundaria = resto.join(' ').trim();
        const larguraUtil = widths[i] - 3.2;
        pdf.setTextColor(15, 23, 42);
        pdf.setFontSize(7.3);
        pdf.text(truncarTextoPdf(pdf, linhaPrincipal, larguraUtil), x + 1.5, y + 4.3);
        if (linhaSecundaria) {
          pdf.setFontSize(5.8);
          const badgePaddingX = 1.4;
          const badgeHeight = 3.7;
          const badgeY = y + 5.6;
          const txt = truncarTextoPdf(pdf, linhaSecundaria, larguraUtil - 2);
          const txtW = pdf.getTextWidth(txt);
          const badgeW = Math.min(larguraUtil, txtW + badgePaddingX * 2);
          pdf.setFillColor(226, 248, 236);
          pdf.roundedRect(x + 1.5, badgeY, badgeW, badgeHeight, 1.4, 1.4, 'F');
          pdf.setTextColor(15, 125, 67);
          pdf.text(txt, x + 1.5 + badgePaddingX, badgeY + 2.55);
        }
      } else {
        pdf.setTextColor(35, 43, 54);
        const centralizar = i === 0 || i === 2 || i === 3 || i === 5 || i === 6;
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

  const totalValor = selecionados.reduce((acc, item) => acc + (item.valorPat || 0), 0);
  const totalAtivos = selecionados.filter((item) => kindStatusPatrimonio(item.tbStatusPat?.descricaoStatPat) === 'ok').length;
  const totalComSaída = selecionados.filter((item) => !!item.dataSaiPat).length;
  const agora = new Date();
  const emissaoCode = codigoDevolucao?.trim() || (() => {
    const dataToken = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}`;
    const contadorKey = `pdf-emissao-dev-${dataToken}`;
    let contador = 1;
    try {
      const ultimo = Number(window.localStorage.getItem(contadorKey) || '0');
      contador = Number.isFinite(ultimo) ? ultimo + 1 : 1;
      window.localStorage.setItem(contadorKey, String(contador));
    } catch {
      contador = 1;
    }
    return `DEV${dataToken}-${String(contador).padStart(3, '0')}`;
  })();

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(18, 24, 40);
  pdf.text('Relatório - Lista de Devolução', margin, y);
  const codeWidth = pdf.getTextWidth(emissaoCode);
  pdf.text(emissaoCode, pageWidth - margin - codeWidth, y);
  y += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(86, 98, 114);
  pdf.text(pdfSafeText(`Data/Hora: ${agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`), margin, y);
  y += 5;
  pdf.text(pdfSafeText(`Total de patrimônios selecionados: ${selecionados.length}`), margin, y);
  y += 6;

  ensureSpace(24);
  const gap = 2;
  const cW = (contentWidth - gap * 3) / 4;
  const cardTop = y + 2;
  drawCard(margin, cardTop, cW, 18, 'Total de itens', String(selecionados.length), formatarMoeda(totalValor), [35, 43, 54]);
  drawCard(margin + cW + gap, cardTop, cW, 18, 'Status ativo', String(totalAtivos), '-', [15, 125, 67]);
  drawCard(margin + (cW + gap) * 2, cardTop, cW, 18, 'Com data de saída', String(totalComSaída), '-', [64, 83, 111]);
  drawCard(margin + (cW + gap) * 3, cardTop, cW, 18, 'Sem data de saída', String(selecionados.length - totalComSaída), '-', [185, 83, 0]);
  y = cardTop + 22;

  ensureSpace(18);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(35, 43, 54);
  pdf.text('Detalhe da lista selecionada', margin, y);
  y += 5;

  const cols = [24, 100, 35, 24, 40, 20, 20];
  const gruposPorCentro = new Map<string, ItemBusca[]>();
  selecionados.forEach((item) => {
    const centro = item.tbCCusto?.descricaoCCusto || 'Sem centro de custo';
    const lista = gruposPorCentro.get(centro) || [];
    lista.push(item);
    gruposPorCentro.set(centro, lista);
  });

  const grupos = Array.from(gruposPorCentro.entries());
  grupos.forEach(([centroCusto, itens], idx) => {
    if (idx > 0) {
      y += 5;
    }
    ensureSpace(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(35, 43, 54);
    pdf.text(pdfSafeText(`Centro de Custo: ${centroCusto}`), margin, y);
    y += 4.5;

    addTableHeader(
      [
        ['ID', 'Patrimônio'],
        'Descrição',
        'Tipo',
        ['Valor', 'BRL'],
        ['Status', 'Patrimônio'],
        'Entrada',
        'Saída'
      ],
      cols
    );

    itens.forEach((item) => {
      const centroCustoItem = item.tbCCusto?.descricaoCCusto || 'Sem centro de custo';
      addTableRow(
        [
          item.idPat || '-',
          `${item.descricaoPat || '-'}\nCentro de Custo: ${centroCustoItem}`,
          item.tbTipoPat?.descricaoTipPat || '-',
          formatarMoeda(item.valorPat),
          item.tbStatusPat?.descricaoStatPat || 'SEM STATUS',
          formatarData(item.dataEntPat),
          formatarData(item.dataSaiPat || null)
        ],
        cols
      );
    });
    y += 1.5;
  });

  pdf.save(`${emissaoCode}.pdf`);
}




