import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { buscarAlocacaoById } from '@/back-end/service/Cadastro.service/cadastro.service';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const alocacao = await buscarAlocacaoById(id);

        if (!alocacao) {
            return NextResponse.json({ message: 'Alocação não encontrada' }, { status: 404 });
        }

        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([595, 842]); // A4
        let { width, height } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // Margens e posições
        const left = 36;
        const right = 36;
        let y = height - 30;

        // Cabeçalho com Informações (PMO, FO-09-052, REV.:00, PÁG: 1 de 1)
        const headerX = left;
        const headerY = y;
        
        // Logo/Label
        page.drawText('PAREX', { x: headerX, y: headerY, size: 11, font: fontBold });
        
        // Título Centralizado
        page.drawText('USO NO PAREX', { x: headerX + 120, y: headerY, size: 12, font: fontBold });
        page.drawText('Gerenciamento de Recursos Humanos', { x: headerX + 120, y: headerY - 14, size: 10, font });
        
        // Informações à direita
        const infoX = width - right - 90;
        page.drawText('PMO', { x: infoX, y: headerY, size: 9, font: fontBold, color: rgb(0, 0, 0) });
        page.drawText('FO-09-052', { x: infoX, y: headerY - 12, size: 9, font });
        page.drawText('REV.:00', { x: infoX, y: headerY - 24, size: 9, font });
        page.drawText('PÁG: 1 de 1', { x: infoX, y: headerY - 36, size: 9, font });
        
        // Linha divisória
        page.drawLine({
            start: { x: left, y: headerY - 46 },
            end: { x: width - right, y: headerY - 46 },
            thickness: 1,
            color: rgb(0, 0, 0)
        });

        y = headerY - 60;

        // Texto do termo (mantendo o modelo fornecido)
        const termo = `Termo de Responsabilidade - Uso Notebooks Parex – Funcionários
        \n      Por este instrumento a PAREX entrega à guarda ao Sr., ${alocacao.tbFuncionario?.nomeFun || 'NOME'} – ${alocacao.tbFuncionario?.idMatFun || 'MATRICULA'} neste ato denominado USUÁRIO, inscrito no CPF nº ${alocacao.tbFuncionario?.cpfFun || 'CPF'}, um computador Notebook marca ${alocacao.tbPatrimonio?.descricaoPat ? alocacao.tbPatrimonio.descricaoPat.split(' ')[0] : 'MARCA'}, modelo ${alocacao.tbPatrimonio?.descricaoDetalhadaPat || 'MODELO'}, contendo: 01 carregador de bateria, patrimoniado sob o Número ${alocacao.tbPatrimonio?.idPat || 'PATRIMONIO'}, ficando o mesmo responsável por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutenção deste equipamento, sob pena de ressarcimento à PAREX se algum destes fatos ocorrer e for constatada negligência por parte do USUÁRIO.\n\nO usuário permanece responsável também pelo equipamento quando da transferência do mesmo à outros funcionários / terceiros sem a prévia autorização da Coordenação de TI Corporativa.\n\nO USUÁRIO reconhece que a utilização do equipamento se dará somente no horário comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) às 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2ª a 5ª feiras e das 07h30min (Sete horas e trinta minutos) às 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) às 6ª feiras e que o equipamento é para uso exclusivo no trabalho da empresa.\n\nÉ proibida a instalação de softwares sem a autorização da coordenação da TI. Este equipamento está licenciado com o sistema operacional Windows e o pacote Office (Word – Excel – Outlook – Power Point) e OBS se necessário incluir outros programas instalado que não estão na lista.\n\nPARAUAPEBAS PA, _____ de ______________ de 2026\n\nNome __________________________           CPF nº ____________________`;

        // Função utilitária: quebra texto em linhas respeitando largura máxima
        function wrapText(text: string, maxWidth: number, fontToUse: any, size = 10) {
            const words = text.split(/\s+/);
            const lines: string[] = [];
            let line = '';
            for (const word of words) {
                const test = line ? `${line} ${word}` : word;
                const width = fontToUse.widthOfTextAtSize(test, size);
                if (width <= maxWidth) {
                    line = test;
                } else {
                    if (line) lines.push(line);
                    // word might be longer than maxWidth
                    if (fontToUse.widthOfTextAtSize(word, size) > maxWidth) {
                        // split the long word
                        let sub = '';
                        for (const ch of word) {
                            const t = sub + ch;
                            if (fontToUse.widthOfTextAtSize(t, size) <= maxWidth) {
                                sub = t;
                            } else {
                                lines.push(sub);
                                sub = ch;
                            }
                        }
                        if (sub) line = sub; else line = '';
                    } else {
                        line = word;
                    }
                }
            }
            if (line) lines.push(line);
            return lines;
        }

        let pageMaxWidth = width - left - right;

        function needNewPage(minSpace = 180) {
            return y < minSpace;
        }

        function addNewPage() {
            page = pdfDoc.addPage([595, 842]);
            const size = page.getSize();
            width = size.width;
            height = size.height;
            pageMaxWidth = width - left - right;
            y = height - 60;
        }
        // Desenhar o termo com formatação: título em negrito, corpo em regular
        const partes = termo.split('\n\n'); // parágrafos
        for (const [pIndex, paragrafo] of partes.entries()) {
            const linhasPar = paragrafo.split('\n');
            for (const linhaRaw of linhasPar) {
                if (!linhaRaw.trim()) {
                    y -= 10; // espaço entre linhas vazias
                    continue;
                }

                // Cabeçalhos (primeira linha do documento) ficam em negrito se forem curtas
                if (pIndex === 0 && linhaRaw.length < 120) {
                    const wrapped = wrapText(linhaRaw, pageMaxWidth, fontBold, 14);
                    for (const wl of wrapped) {
                        if (needNewPage(140)) addNewPage();
                        page.drawText(wl, { x: left, y, size: 14, font: fontBold });
                        y -= 18;
                    }
                } else if (pIndex === 1 && linhaRaw.toLowerCase().includes('termo de responsabilidade')) {
                    const wrapped = wrapText(linhaRaw, pageMaxWidth, fontBold, 12);
                    for (const wl of wrapped) {
                        if (needNewPage(140)) addNewPage();
                        page.drawText(wl, { x: left, y, size: 12, font: fontBold });
                        y -= 16;
                    }
                } else {
                    const wrapped = wrapText(linhaRaw, pageMaxWidth, font, 11);
                    for (const wl of wrapped) {
                        if (needNewPage(140)) addNewPage();
                        page.drawText(wl, { x: left, y, size: 11, font });
                        y -= 16;
                    }
                }
            }
            y -= 8; // espaço entre parágrafos
        }

        // Assinaturas (linhas finais) - posicionar com 3 colunas
        if (needNewPage(140)) addNewPage();
        y -= 18;
        const sigWidth = Math.min(140, pageMaxWidth * 0.28);
        const leftSigX = left;
        const midSigX = left + (pageMaxWidth - sigWidth) / 2;
        const rightSigX = left + pageMaxWidth - sigWidth;
        const sigY = y;

        // linhas de assinatura
        page.drawLine({ start: { x: leftSigX, y: sigY }, end: { x: leftSigX + sigWidth, y: sigY }, thickness: 1 });
        page.drawLine({ start: { x: midSigX, y: sigY }, end: { x: midSigX + sigWidth, y: sigY }, thickness: 1 });
        page.drawLine({ start: { x: rightSigX, y: sigY }, end: { x: rightSigX + sigWidth, y: sigY }, thickness: 1 });

        // rótulos centralizados abaixo das linhas
        const labelSize = 10;
        const label1 = 'Assinatura do Recebedor';
        const label2 = 'Assinatura do Responsável/Setor';
        const label3 = 'Assinatura da Testemunha';
        const label1Width = font.widthOfTextAtSize(label1, labelSize);
        const label2Width = font.widthOfTextAtSize(label2, labelSize);
        const label3Width = font.widthOfTextAtSize(label3, labelSize);

        const label1X = leftSigX + (sigWidth - label1Width) / 2;
        const label2X = midSigX + (sigWidth - label2Width) / 2;
        const label3X = rightSigX + (sigWidth - label3Width) / 2;

        page.drawText(label1, { x: label1X, y: sigY - 16, size: labelSize, font });
        page.drawText(label2, { x: label2X, y: sigY - 16, size: labelSize, font });
        page.drawText(label3, { x: label3X, y: sigY - 16, size: labelSize, font });

        const pdfBytes = await pdfDoc.save();

        return new NextResponse(Buffer.from(pdfBytes), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=termo_${alocacao.tbFuncionario?.nomeFun}.pdf`
            }
        });
    } catch (error) {
        console.error('Erro gerando PDF do termo:', error);
        return NextResponse.json({ message: 'Erro ao gerar PDF' }, { status: 500 });
    }
}
