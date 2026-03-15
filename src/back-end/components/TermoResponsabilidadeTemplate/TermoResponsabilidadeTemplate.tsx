import React from 'react';
import type { DadosTermoResponsabilidade } from '@/lib/termoResponsabilidadePdf';

function formatarCpf(cpf: string | null): string {
    if (!cpf || !cpf.trim()) return '_______________________';
    const n = cpf.replace(/\D/g, '');
    if (n.length === 11) {
        return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}-${n.slice(9)}`;
    }
    return cpf;
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 18,
    },
    logoBox: {
        width: '28mm',
        minHeight: '18mm',
        border: '1px solid #b4b4b4',
        padding: '4px 6px',
    },
    logo: { fontSize: 16, fontWeight: 'bold' as const },
    sub: { fontSize: 8, marginTop: 2 },
    headerCenter: { textAlign: 'center' as const, flex: 1 },
    titulo1: { fontSize: 11, fontWeight: 'bold' as const },
    titulo2: { fontSize: 9, marginTop: 4 },
    docBox: {
        width: '32mm',
        minHeight: '18mm',
        border: '1px solid #b4b4b4',
        padding: '4px 6px',
        fontSize: 8,
        lineHeight: 1.5,
    },
    docTitle: { textAlign: 'center' as const, margin: '14px 0 16px' },
    docTitleH1: { fontSize: 14, fontWeight: 'bold' as const, lineHeight: 1.5 },
    body: { marginBottom: 12, textAlign: 'justify' as const },
    assinatura: { marginTop: 24, fontSize: 10, lineHeight: 2 },
} as const;

interface TermoResponsabilidadeTemplateProps {
    documentData: DadosTermoResponsabilidade;
}

/**
 * Template do Termo de Responsabilidade FO-09-052 para renderização SSR (renderToString).
 * Usado pelo Puppeteer para gerar o PDF.
 */
export default function TermoResponsabilidadeTemplate({
    documentData,
}: TermoResponsabilidadeTemplateProps) {
    const nomeMatricula = `${documentData.nomeFun} – ${documentData.idMatFun}`;
    const cpfFormatado = formatarCpf(documentData.cpfFun);
    const marca =
        documentData.marca?.trim() ||
        documentData.descricaoPat?.trim() ||
        'Conforme cadastro';
    const modelo =
        documentData.modelo?.trim() ||
        documentData.descricaoPat?.trim() ||
        'Conforme cadastro';
    const localData =
        documentData.localData?.trim() ||
        'PARAUAPEBAS PA, _____ de ______________ de 2026';

    let textoProgramas =
        'É proibida a instalação de softwares sem a autorização da coordenação da TI. Este equipamento está licenciado com o sistema operacional Windows e o pacote Office (Word – Excel – Outlook – Power Point)';
    if (
        documentData.outrosProgramas &&
        documentData.outrosProgramas.length > 0
    ) {
        textoProgramas += ` e ${documentData.outrosProgramas.join(', ')}.`;
    } else {
        textoProgramas +=
            ' e OBS se necessário incluir outros programas instalado que não estão na lista.';
    }

    return (
        <div id="termo-fo-09-052">
            <div style={styles.header}>
                <div style={styles.logoBox}>
                    <div style={styles.logo}>PAREX</div>
                    <div style={styles.sub}>ENGENHARIA</div>
                </div>
                <div style={styles.headerCenter}>
                    <div style={styles.titulo1}>USO NOTEBOOK PAREX</div>
                    <div style={styles.titulo2}>
                        Gerenciamento de Recursos Humanos
                    </div>
                </div>
                <div style={styles.docBox}>
                    PMO<br />
                    FO-09-052<br />
                    REV.:00<br />
                    PÁG: 1 de 1
                </div>
            </div>

            <div style={styles.docTitle}>
                <h1 style={styles.docTitleH1}>
                    Termo de Responsabilidade -<br />
                    Uso Notebooks Parex – Funcionários
                </h1>
            </div>

            <p style={styles.body}>
                \t Por este instrumento a PAREX entrega à guarda ao Sr.,{' '}
                {nomeMatricula}, neste ato denominado USUÁRIO, inscrito no CPF nº.{' '}
                {cpfFormatado}, um computador Notebook marca {marca}, modelo{' '}
                {modelo}, contendo: 01 carregador de bateria, patrimoniado sob o
                Número {documentData.idPat}, ficando o mesmo responsável por
                qualquer dano, perda ou furto, e da mesma forma, pelo zelo e
                manutenção deste equipamento, sob pena de ressarcimento à PAREX
                se algum destes fatos ocorrer e for constatada negligência por
                parte do USUÁRIO. O usuário permanece responsável também pelo
                equipamento quando da transferência do mesmo à outros
                funcionários / terceiros sem a prévia autorização da Coordenação
                de TI Corporativa.
            </p>

            <p style={styles.body}>
                \t O USUÁRIO reconhece que a utilização do equipamento se dará
                somente no horário comercial de trabalho, ou seja, de 07h30min
                (Sete horas e trinta minutos) às 17h30min (dezessete horas e
                trinta minutos), com intervalo de 01h00min (Uma hora), de 2ª a
                5ª feiras e das 07h30min (Sete horas e trinta minutos) às
                16h30min (dezesseis horas e trinta minutos), com intervalo de
                01h00min (Uma hora) às 6ª feiras e que o equipamento é para uso
                exclusivo no trabalho da empresa.
            </p>

            <p style={styles.body}>{textoProgramas}</p>

            <div style={styles.assinatura}>
                <div>{localData}</div>
                <div style={{ marginTop: 12 }}>Nome __________________________</div>
                <div style={{ marginTop: 8 }}></div>
                <div style={{ marginTop: 8 }}>________________________</div>
            </div>
        </div>
    );
}
