'use client';

import jsPDF from 'jspdf';

export type ItemTransferenciaRelatorio = {
  idPat: string;
  descricaoPat: string;
  situacaoPatrimonio?: string | null;
  custoAnteriorTransferencia?: string | null;
  custoAtualTransferencia?: string | null;
  dataUltimaTransferencia?: string | Date | null;
  valorPat?: number | null;
  observacao?: string | null;
};

function formatarMoeda(valor?: number | null) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

function formatarData(value?: string | Date | null) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '-';
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
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

function truncarTextoPdf(pdf: jsPDF, texto: string, larguraMax: number) {
  const limpo = pdfSafeText(texto || '');
  if (pdf.getTextWidth(limpo) <= larguraMax) return limpo;
  let base = limpo;
  while (base.length > 0 && pdf.getTextWidth(`${base}...`) > larguraMax) {
    base = base.slice(0, -1);
  }
  return base ? `${base}...` : '...';
}

export function gerarTransferenciaCustoPatrimonioPdf(dados: ItemTransferenciaRelatorio[]) {
  if (dados.length === 0) return;

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

  const addTableHeader = (headers: string[], widths: number[]) => {
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
      pdf.text(pdfSafeText(headers[i]), x + 1.6, y + 3.8 + (lineHeight * 0.5));
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
      pdf.setTextColor(35, 43, 54);
      pdf.text(split[i], x + 1.5, y + 4.3);
      x += widths[i];
    }
    y += rowHeight;
  };

  const totalValor = dados.reduce((acc, item) => acc + (item.valorPat || 0), 0);
  const gruposDestino = Array.from(
    dados.reduce((map, item) => {
      const chave = item.custoAtualTransferencia || 'Sem centro de destino';
      const lista = map.get(chave) || [];
      lista.push(item);
      map.set(chave, lista);
      return map;
    }, new Map<string, ItemTransferenciaRelatorio[]>())
  ).sort((a, b) => a[0].localeCompare(b[0], 'pt-BR'));

  const agora = new Date();
  const dataToken = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}`;
  const contadorKey = `pdf-emissao-transferencia-${dataToken}`;
  let contador = 1;
  try {
    const ultimo = Number(window.localStorage.getItem(contadorKey) || '0');
    contador = Number.isFinite(ultimo) ? ultimo + 1 : 1;
    window.localStorage.setItem(contadorKey, String(contador));
  } catch {
    contador = 1;
  }
  const emissaoCode = `TRANSF${dataToken}-${String(contador).padStart(3, '0')}`;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.setTextColor(18, 24, 40);
  pdf.text('Relatório - Transferência de Patrimônio', margin, y);
  const codeWidth = pdf.getTextWidth(emissaoCode);
  pdf.text(emissaoCode, pageWidth - margin - codeWidth, y);
  y += 6;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(86, 98, 114);
  pdf.text(pdfSafeText(`Data/Hora: ${agora.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`), margin, y);
  y += 5;
  pdf.text(pdfSafeText(`Total de patrimônios transferidos: ${dados.length}`), margin, y);
  y += 6;

  ensureSpace(24);
  const gap = 2;
  const cW = (contentWidth - gap * 3) / 4;
  const cardTop = y + 2;
  drawCard(margin, cardTop, cW, 18, 'Total de itens', String(dados.length), formatarMoeda(totalValor), [35, 43, 54]);
  drawCard(margin + cW + gap, cardTop, cW, 18, 'Valor total', formatarMoeda(totalValor), '-', [15, 125, 67]);
  drawCard(margin + (cW + gap) * 2, cardTop, cW, 18, 'Destinos distintos', String(gruposDestino.length), '-', [185, 83, 0]);
  drawCard(margin + (cW + gap) * 3, cardTop, cW, 18, 'Emissão', emissaoCode, '-', [64, 83, 111]);
  y = cardTop + 22;

  const cols = [22, 70, 28, 35, 35, 25, 30];
  gruposDestino.forEach(([destino, itensDestino], index) => {
    if (index > 0) {
      pdf.addPage();
      y = 12;
    }

    ensureSpace(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.setTextColor(35, 43, 54);
    pdf.text(pdfSafeText(`Centro de destino: ${destino}`), margin, y);
    y += 4.8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(86, 98, 114);
    const totalGrupo = itensDestino.reduce((acc, item) => acc + (item.valorPat || 0), 0);
    pdf.text(pdfSafeText(`Itens: ${itensDestino.length} | Valor total: ${formatarMoeda(totalGrupo)}`), margin, y);
    y += 5;

    addTableHeader(
      ['ID', 'Descrição', 'Situação', 'Centro Anterior', 'Centro Atual', 'Valor BRL', 'Data Transferência'],
      cols
    );

    itensDestino.forEach((item) => {
      addTableRow(
        [
          truncarTextoPdf(pdf, item.idPat || '-', cols[0]),
          truncarTextoPdf(pdf, item.descricaoPat || '-', cols[1]),
          truncarTextoPdf(pdf, item.situacaoPatrimonio || '-', cols[2]),
          truncarTextoPdf(pdf, item.custoAnteriorTransferencia || '-', cols[3]),
          truncarTextoPdf(pdf, item.custoAtualTransferencia || '-', cols[4]),
          formatarMoeda(item.valorPat),
          formatarData(item.dataUltimaTransferencia)
        ],
        cols
      );
    });
  });

  pdf.save(`${emissaoCode}.pdf`);
}
