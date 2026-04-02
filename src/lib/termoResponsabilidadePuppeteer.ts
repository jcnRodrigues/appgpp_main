import fs from 'node:fs';
import path from 'node:path';
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

function getParexLogoDataUri(): string | null {
    const logoCandidates = [
        path.join(process.cwd(), 'public', 'iconPX.png'),
        path.join(process.cwd(), 'public', 'Imagens', 'parex.png'),
        path.join(process.cwd(), 'public', 'Imagens', 'parex_logo.png')
    ];

    for (const logoPath of logoCandidates) {
        if (fs.existsSync(logoPath)) {
            const ext = path.extname(logoPath).toLowerCase();
            const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
            const base64 = fs.readFileSync(logoPath).toString('base64');
            return `data:${mime};base64,${base64}`;
        }
    }

    return null;
}

/** Exportado para uso em renderPdf (gera HTML sem React). */
export function buildHtml(dados: DadosTermoResponsabilidade): string {
    const nomeMatricula = escapeHtml(`${dados.nomeFun} - ${dados.idMatFun}`);
    const cpfFormatado = escapeHtml(formatarCpf(dados.cpfFun));
    const tipoPatrimonioBase = dados.tipoPatrimonio?.trim() || dados.descricaoPat?.trim() || 'PATRIMONIO';
    const tipoPatrimonio = escapeHtml(tipoPatrimonioBase.split(/\s+/).filter(Boolean)[0] || tipoPatrimonioBase);
    const marcaBase = dados.marca?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro';
    const marcaPrimeiraPalavra = marcaBase.split(/\s+/).filter(Boolean)[0] || marcaBase;
    const marca = escapeHtml(marcaPrimeiraPalavra);
    const modelo = escapeHtml(dados.modelo?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro');
    const patrimonio = escapeHtml(dados.idPat);
    const localData = escapeHtml(
        dados.localData?.trim() || 'PARAUAPEBAS PA, _____ de ______________ de ______'
    );
    const statusAlocacaoNormalizado = (dados.statusAlocacao || '').trim().toUpperCase();

    const condicaoPorStatusRaw =
        statusAlocacaoNormalizado.includes('DEVOL')
            ? 'Devolução'
            : statusAlocacaoNormalizado.includes('TRANSFER')
                ? 'Transferido'
                : statusAlocacaoNormalizado.includes('ATIVO')
                    ? 'Recebimento'
                    : 'Condicao da alocacao: o usuario declara ciencia do status atual do patrimonio e de suas responsabilidades conforme as normas internas.';
    const condicaoPorStatus = escapeHtml(condicaoPorStatusRaw);

    let textoProgramas =
        'E proibida a instalacao de softwares sem a autorizacao da coordenacao da TI. Este equipamento esta licenciado com o sistema operacional Windows e o pacote Office (Word - Excel - Outlook - Power Point)';
    if (dados.outrosProgramas && dados.outrosProgramas.length > 0) {
        textoProgramas += ` e ${escapeHtml(dados.outrosProgramas.join(', '))}.`;
    } else {
        textoProgramas += ' e OBS se necessario incluir outros programas instalados que nao estao na lista.';
    }

    const logoDataUri = getParexLogoDataUri();
    const logoHtml = logoDataUri
        ? `<img src="${logoDataUri}" alt="Logo Parex" class="logo-img" />`
        : `<div class="logo-fallback"><div class="logo">PAREX</div><div class="sub">ENGENHARIA</div></div>`;

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Termo de Responsabilidade - PAT${patrimonio} - ${nomeMatricula}</title>
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
    .header {
      display: grid;
      grid-template-columns: 38mm 1fr 34mm;
      border: 1px solid #7d7d7d;
      margin-bottom: 18px;
      min-height: 26mm;
    }
    .logo-box {
      border-right: 1px solid #7d7d7d;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4px;
    }
    .logo-img {
      width: 100%;
      max-width: 30mm;
      height: auto;
      object-fit: contain;
    }
    .logo-fallback { text-align: center; }
    .logo-fallback .logo { font-size: 15pt; font-weight: bold; line-height: 1; }
    .logo-fallback .sub { font-size: 8pt; margin-top: 2px; }
    .header-center {
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 6px 8px;
    }
    .header-center .titulo1 { font-size: 10.5pt; font-weight: bold; letter-spacing: .3px; }
    .header-center .titulo2 { font-size: 8.5pt; margin-top: 3px; font-weight: 600; }
    .doc-box {
      border-left: 1px solid #7d7d7d;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      font-size: 8pt;
      text-align: center;
      font-weight: 600;
    }
    .doc-row {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .doc-row + .doc-row { border-top: 1px solid #7d7d7d; }
    .doc-title { text-align: center; margin: 14px 0 16px; }
    .doc-title h1 { font-size: 14pt; font-weight: bold; line-height: 1.5; }
    .body p { margin-bottom: 12px; text-align: justify; }
    .assinatura { margin-top: 24px; font-size: 10pt; line-height: 2; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-box">
      ${logoHtml}
    </div>
    <div class="header-center">
      <div class="titulo1">USO ${tipoPatrimonio} PAREX</div>
      <div class="titulo2">Gerenciamento de Recursos Humanos</div>
    </div>
    <div class="doc-box">
      <div class="doc-row">PMO</div>
      <div class="doc-row">FO-09-052</div>
      <div class="doc-row">REV.:00</div>
      <div class="doc-row">PAG: 1 de 1</div>
    </div>
  </div>

  <div class="doc-title">
    <h1>Termo de Responsabilidade - ${condicaoPorStatus}<br>Uso ${tipoPatrimonio} Parex - Funcionarios</h1>
  </div>

  <div class="body">
    <p>&emsp;&emsp;Por este instrumento a PAREX entrega a guarda ao Sr., ${nomeMatricula}, neste ato denominado USUARIO, inscrito no CPF no. ${cpfFormatado}, um computador Notebook marca ${marca}, modelo ${modelo}, contendo: 01 carregador de bateria, patrimoniado sob o Numero PAT ${patrimonio}, ficando o mesmo responsavel por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutencao deste equipamento, sob pena de ressarcimento a PAREX se algum destes fatos ocorrer e for constatada negligencia por parte do USUARIO. O usuario permanece responsavel tambem pelo equipamento quando da transferencia do mesmo a outros funcionarios / terceiros sem a previa autorizacao da Coordenacao de TI Corporativa.</p>

    <p>&emsp;&emsp;O USUARIO reconhece que a utilizacao do equipamento se dara somente no horario comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) as 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2a a 5a feiras e das 07h30min (Sete horas e trinta minutos) as 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) as 6a feiras e que o equipamento e para uso exclusivo no trabalho da empresa.</p>

    <p>&emsp;&emsp;${textoProgramas}</p>
    <br/>

    <div class="assinatura">
      <div>${localData}</div>
      <br/>
      <div style="margin-top: 20px;">_______________________________________</div>
      <div style="margin-top: 0px;">${nomeMatricula}</div>
      <div style="margin-top: 0px;">CPF - ${cpfFormatado}</div>
      <br/>
      <div style="margin-top: 14px;">_______________________________________</div>
      <div style="margin-top: 0px;">Responsavel setor TI</div>
    </div>
  </div>
</body>
</html>`;
}
