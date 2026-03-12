import puppeteer from 'puppeteer';
import type { DadosTermoResponsabilidade } from './termoResponsabilidadePdf';

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatarCpf(cpf: string | null): string {
    if (!cpf || !cpf.trim()) return '_______________________';
    const n = cpf.replace(/\D/g, '');
    if (n.length === 11) {
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    }
    return cpf;
}

/** Exportado para uso em renderPdf (gera HTML sem React). */
export function buildHtml(dados: DadosTermoResponsabilidade): string {
    const nomeMatricula = escapeHtml(`${dados.nomeFun} – ${dados.idMatFun}`);
    const cpfFormatado = escapeHtml(formatarCpf(dados.cpfFun));
    const marca = escapeHtml(dados.marca?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro');
    const modelo = escapeHtml(dados.modelo?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro');
    const patrimonio = escapeHtml(dados.idPat);
    const localData = escapeHtml(
        dados.localData?.trim() || 'PARAUAPEBAS PA, _____ de ______________ de 2026'
    );
    let textoProgramas =
        'É proibida a instalação de softwares sem a autorização da coordenação da TI. Este equipamento está licenciado com o sistema operacional Windows e o pacote Office (Word – Excel – Outlook – Power Point)';
    if (dados.outrosProgramas && dados.outrosProgramas.length > 0) {
        textoProgramas += ` e ${escapeHtml(dados.outrosProgramas.join(', '))}.`;
    } else {
        textoProgramas += ' e OBS se necessário incluir outros programas instalado que não estão na lista.';
    }

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Termo de Responsabilidade - FO-09-052</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Arial, Helvetica, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
      padding: 20mm;
      max-width: 210mm;
      margin: 0 auto;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
    .logo-box {
      width: 28mm; min-height: 18mm;
      border: 1px solid #b4b4b4;
      padding: 4px 6px;
    }
    .logo-box .logo { font-size: 16pt; font-weight: bold; }
    .logo-box .sub { font-size: 8pt; margin-top: 2px; }
    .header-center { text-align: center; flex: 1; }
    .header-center .titulo1 { font-size: 11pt; font-weight: bold; }
    .header-center .titulo2 { font-size: 9pt; margin-top: 4px; }
    .doc-box {
      width: 32mm; min-height: 18mm;
      border: 1px solid #b4b4b4;
      padding: 4px 6px;
      font-size: 8pt;
      line-height: 1.5;
    }
    .doc-title { text-align: center; margin: 14px 0 16px; }
    .doc-title h1 { font-size: 14pt; font-weight: bold; line-height: 1.5; }
    .body p { margin-bottom: 12px; text-align: justify; }
    .assinatura { margin-top: 24px; font-size: 10pt; line-height: 2; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-box">
      <div class="logo">PAREX</div>
      <div class="sub">ENGENHARIA</div>
    </div>
    <div class="header-center">
      <div class="titulo1">USO NOTEBOOK PAREX</div>
      <div class="titulo2">Gerenciamento de Recursos Humanos</div>
    </div>
    <div class="doc-box">
      PMO<br>FO-09-052<br>REV.:00<br>PÁG: 1 de 1
    </div>
  </div>

  <div class="doc-title">
    <h1>Termo de Responsabilidade -<br>Uso Notebooks Parex – Funcionários</h1>
  </div>

  <div class="body">
    <p>Por este instrumento a PAREX entrega à guarda ao Sr., ${nomeMatricula}, neste ato denominado USUÁRIO, inscrito no CPF nº. ${cpfFormatado}, um computador Notebook marca ${marca}, modelo ${modelo}, contendo: 01 carregador de bateria, patrimoniado sob o Número ${patrimonio}, ficando o mesmo responsável por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutenção deste equipamento, sob pena de ressarcimento à PAREX se algum destes fatos ocorrer e for constatada negligência por parte do USUÁRIO. O usuário permanece responsável também pelo equipamento quando da transferência do mesmo à outros funcionários / terceiros sem a prévia autorização da Coordenação de TI Corporativa.</p>

    <p>O USUÁRIO reconhece que a utilização do equipamento se dará somente no horário comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) às 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2ª a 5ª feiras e das 07h30min (Sete horas e trinta minutos) às 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) às 6ª feiras e que o equipamento é para uso exclusivo no trabalho da empresa.</p>

    <p>${textoProgramas}</p>

    <div class="assinatura">
      <div>${localData}</div>
      <div style="margin-top: 12px;">Nome __________________________</div>
      <div style="margin-top: 8px;">CPF nº ____________________</div>
      <div style="margin-top: 8px;">________________________</div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Gera o PDF do Termo de Responsabilidade FO-09-052 usando Puppeteer (HTML → PDF).
 * Executar apenas no servidor (Node).
 */
export async function gerarTermoPdfPuppeteer(
    dados: DadosTermoResponsabilidade
): Promise<Buffer> {
    const html = buildHtml(dados);
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, {
            waitUntil: 'networkidle0',
            timeout: 10000
        });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
        });
        return Buffer.from(pdfBuffer);
    } finally {
        await browser.close();
    }
}
