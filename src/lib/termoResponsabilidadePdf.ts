import { jsPDF } from 'jspdf';

export interface DadosTermoResponsabilidade {
    nomeFun: string;
    idMatFun: string;
    cpfFun: string | null;
    idPat: string;
    descricaoPat: string;
    /** Marca do notebook (opcional) */
    marca?: string;
    /** Modelo do notebook (opcional) */
    modelo?: string;
    /** Outros programas instalados além de Windows/Office (opcional) */
    outrosProgramas?: string[];
    /** Local e data para o rodapé de assinatura (ex: "PARAUAPEBAS PA, 20 de fevereiro de 2026"). Se não informado, usa placeholder. */
    localData?: string;
}

const MARGEM = 20;
const LARGURA_PAGINA = 210;
const LARGURA_UTIL = LARGURA_PAGINA - 2 * MARGEM;

function formatarCpf(cpf: string | null): string {
    if (!cpf || !cpf.trim()) return '_______________________';
    const n = cpf.replace(/\D/g, '');
    if (n.length === 11) {
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    }
    return cpf;
}

/**
 * Gera o PDF do Termo de Responsabilidade conforme FO-09-052 (Uso Notebooks Parex).
 * Texto e layout alinhados ao modelo oficial.
 */
export function gerarTermoResponsabilidadePdf(dados: DadosTermoResponsabilidade): void {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const fontSizeNormal = 10;
    const fontSizeTitulo = 14;
    const lineHeight = 5.5;
    let y = 18;

    // ---- Cabeçalho ----
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.3);
    doc.rect(MARGEM, y - 4, 28, 18);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('PAREX', MARGEM + 3, y + 3);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('ENGENHARIA', MARGEM + 3, y + 10);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`USO ${dados.descricaoPat} PAREX`, LARGURA_PAGINA / 2, y, { align: 'center' });
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Gerenciamento de Recursos Humanos', LARGURA_PAGINA / 2, y + 6, { align: 'center' });

    const boxW = 32;
    const boxX = LARGURA_PAGINA - MARGEM - boxW;
    doc.rect(boxX, y - 4, boxW, 18);
    doc.setFontSize(8);
    doc.text('PMO', boxX + 2, y + 2);
    doc.text('FO-09-052', boxX + 2, y + 6);
    doc.text('REV.:00', boxX + 2, y + 10);
    doc.text('PÁG: 1 de 1', boxX + 2, y + 14);

    y += 22;

    // ---- Título ----
    doc.setFontSize(fontSizeTitulo);
    doc.setFont('helvetica', 'bold');
    doc.text('Termo de Responsabilidade -', LARGURA_PAGINA / 2, y, { align: 'center' });
    y += 7;
    doc.text(`Uso ${dados.descricaoPat} PAREX – Funcionários`, LARGURA_PAGINA / 2, y, { align: 'center' });
    y += 12;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSizeNormal);
    doc.setTextColor(0, 0, 0);

    const nomeMatricula = `${dados.nomeFun} – ${dados.idMatFun}`;
    const cpfFormatado = formatarCpf(dados.cpfFun);
    const marca = dados.marca?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro';
    const modelo = dados.modelo?.trim() || dados.descricaoPat?.trim() || 'Conforme cadastro';

    // Parágrafo 1 – Texto oficial FO-09-052
    const p1 = `Por este instrumento a PAREX entrega à guarda ao Sr., ${nomeMatricula}, neste ato denominado USUÁRIO, inscrito no CPF nº. ${cpfFormatado}, um computador Notebook marca ${marca}, modelo ${modelo}, contendo: 01 carregador de bateria, patrimoniado sob o Número ${dados.idPat}, ficando o mesmo responsável por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutenção deste equipamento, sob pena de ressarcimento à PAREX se algum destes fatos ocorrer e for constatada negligência por parte do USUÁRIO. O usuário permanece responsável também pelo equipamento quando da transferência do mesmo à outros funcionários / terceiros sem a prévia autorização da Coordenação de TI Corporativa.`;
    const linhas1 = doc.splitTextToSize(p1, LARGURA_UTIL);
    doc.text(linhas1, MARGEM, y);
    y += linhas1.length * lineHeight + 6;

    // Parágrafo 2 – Horário de uso (texto oficial)
    const p2 = 'O USUÁRIO reconhece que a utilização do equipamento se dará somente no horário comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) às 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2ª a 5ª feiras e das 07h30min (Sete horas e trinta minutos) às 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) às 6ª feiras e que o equipamento é para uso exclusivo no trabalho da empresa.';
    const linhas2 = doc.splitTextToSize(p2, LARGURA_UTIL);
    doc.text(linhas2, MARGEM, y);
    y += linhas2.length * lineHeight + 6;

    // Parágrafo 3 – Programas (texto oficial)
    let p3 = 'É proibida a instalação de softwares sem a autorização da coordenação da TI. Este equipamento está licenciado com o sistema operacional Windows e o pacote Office (Word – Excel – Outlook – Power Point)';
    if (dados.outrosProgramas && dados.outrosProgramas.length > 0) {
        p3 += ` e ${dados.outrosProgramas.join(', ')}.`;
    } else {
        p3 += ' e OBS se necessário incluir outros programas instalado que não estão na lista.';
    }
    const linhas3 = doc.splitTextToSize(p3, LARGURA_UTIL);
    doc.text(linhas3, MARGEM, y);
    y += linhas3.length * lineHeight + 10;

    // Bloco de assinatura (conforme modelo)
    const localData = dados.localData?.trim() || 'PARAUAPEBAS PA, _____ de ______________ de 2026';
    doc.text(localData, MARGEM, y);
    y += 8;
    doc.text('_______________________________', MARGEM, y);
    y += 6;
    doc.text(`Nome ${dados.nomeFun}`, MARGEM, y);
    y += 4;
    doc.text(`CPF nº ${dados.cpfFun}`, MARGEM, y);
    y += 8;
    doc.text('________________________', MARGEM, y);

    const nomeArquivo = `Termo-Responsabilidade-${dados.idMatFun}-${dados.idPat}.pdf`;
    doc.save(nomeArquivo);
}
