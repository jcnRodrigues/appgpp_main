import { NextRequest, NextResponse } from 'next/server';
import { buscarAlocacaoById } from '@/back-end/service/Cadastro.service/cadastro.service';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const alocacao = await buscarAlocacaoById(id);
        if (!alocacao) return NextResponse.json({ message: 'Alocação não encontrada' }, { status: 404 });

        // Gerar HTML com estilos inline (fiel ao visual)
        const patrimonio = alocacao.tbPatrimonio;
        const nome = alocacao.tbFuncionario?.nomeFun || 'NOME';
        const matricula = alocacao.tbFuncionario?.idMatFun || 'MATRICULA';
        const cpf = alocacao.tbFuncionario?.cpfFun || 'CPF';
        const marca = patrimonio?.descricaoPat ? patrimonio.descricaoPat.split(' ')[0] : 'MARCA';
        const modelo = patrimonio?.descricaoDetalhadaPat || 'MODELO';
        const idPat = patrimonio?.idPat || 'PATRIMONIO';
        const dataAloc = alocacao.dataCadPat ? new Date(alocacao.dataCadPat).toLocaleDateString('pt-BR') : '';

        const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Termo</title>
  <style>
    body{font-family: Arial, Helvetica, sans-serif; font-size:12px; color:#111; margin:20mm}
    .header-table{ width:100%; border-collapse:collapse; margin-bottom:12px; border-bottom:2px solid #000 }
    .header-table td{ padding:4px 8px; vertical-align:top }
    .logo{ text-align:left; width:15% }
    .title-cell{ text-align:center; flex:1 }
    .title-cell h2{ font-weight:700; font-size:14px; margin:0 }
    .title-cell p{ font-size:11px; margin:0 }
    .info-table{ border-collapse:collapse; text-align:right; width:auto }
    .info-table td{ border:1px solid #000; padding:4px 8px; font-size:11px }
    .content{ white-space:pre-wrap; line-height:1.5; margin-top:12px }
    .signs{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; margin-top:24px }
    .sign{ text-align:center }
    .sign .line{ border-bottom:1px solid #000; margin-bottom:8px; height:40px }
    .sign .label{ font-size:10px }
    @media print{ body{margin:20mm} }
  </style>
</head>
<body>
  {/* Cabeçalho com Logo, Título e Informações */}
  <table class="header-table">
    <tr>
      <td class="logo" style="width:15%">PAREX</td>
      <td class="title-cell" style="text-align:center; flex:1">
        <h2>USO NOTEBOOK PAREX</h2>
        <p>Gerenciamento de Recursos Humanos</p>
      </td>
      <td style="width:25%; text-align:right; vertical-align:top">
        <table class="info-table">
          <tr><td style="font-weight:bold">PMO</td></tr>
          <tr><td>FO-09-052</td></tr>
          <tr><td>REV.:00</td></tr>
          <tr><td>PÁG: 1 de 1</td></tr>
        </table>
      </td>
    </tr>
  </table>

  <div class="content">
Por este instrumento a PAREX entrega à guarda ao Sr., ${nome} – ${matricula} neste ato denominado USUÁRIO, inscrito no CPF nº ${cpf}, um computador Notebook marca ${marca}, modelo ${modelo}, contendo: 01 carregador de bateria, patrimoniado sob o Número ${idPat}, ficando o mesmo responsável por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutenção deste equipamento, sob pena de ressarcimento à PAREX se algum destes fatos ocorrer e for constatada negligência por parte do USUÁRIO.

O usuário permanece responsável também pelo equipamento quando da transferência do mesmo à outros funcionários / terceiros sem a prévia autorização da Coordenação de TI Corporativa.

O USUÁRIO reconhece que a utilização do equipamento se dará somente no horário comercial de trabalho, ou seja, de 07h30min às 17h30min, com intervalo de 01h00min, de 2ª a 5ª feiras e das 07h30min às 16h30min às 6ª feiras, e que o equipamento é para uso exclusivo no trabalho da empresa.

É proibida a instalação de softwares sem a autorização da coordenação da TI. Este equipamento está licenciado com o sistema operacional Windows e o pacote Office (Word – Excel – Outlook – Power Point).

PARAUAPEBAS PA, ${dataAloc}

Nome: ${nome}        CPF nº: ${cpf}
  </div>

  <div class="signs">
    <div class="sign"><div class="line"></div><div class="label">Assinatura do Recebedor</div></div>
    <div class="sign"><div class="line"></div><div class="label">Assinatura do Responsável / Setor</div></div>
    <div class="sign"><div class="line"></div><div class="label">Assinatura da Testemunha</div></div>
  </div>
</body>
</html>
`;

        // Launch puppeteer dynamically
        const puppeteer = await import('puppeteer');
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const pageP = await browser.newPage();
        await pageP.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await pageP.pdf({ format: 'A4', printBackground: true, margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' } });
        await browser.close();

        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=termo_puppeteer_${id}.pdf`
            }
        });
    } catch (error) {
        console.error('Erro gerando PDF com Puppeteer:', error);
        return NextResponse.json({ message: 'Erro ao gerar PDF' }, { status: 500 });
    }
}
