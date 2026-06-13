'use client';

function normalizarCodigoCentro(codigoCentroCusto?: string | null) {
    const digits = String(codigoCentroCusto || '').replace(/\D/g, '');
    if (!digits) return '0000';
    return digits.padStart(4, '0').slice(-4);
}

function obterMesAnoAgora() {
    const agora = new Date();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const ano = String(agora.getFullYear()).slice(-2);
    return { mes, ano };
}

function normalizarMesAno(mes?: string | number | null, ano?: string | number | null) {
    const atual = obterMesAnoAgora();
    const mesDigits = String(mes ?? '').replace(/\D/g, '');
    const anoDigits = String(ano ?? '').replace(/\D/g, '');

    let mesFinal = mesDigits.padStart(2, '0').slice(-2);
    if (!mesFinal || Number(mesFinal) < 1 || Number(mesFinal) > 12) {
        mesFinal = atual.mes;
    }

    let anoFinal = anoDigits.slice(-2);
    if (!anoFinal || anoFinal.length !== 2) {
        anoFinal = atual.ano;
    }

    return { mes: mesFinal, ano: anoFinal };
}

export function gerarNomeArquivoBM(
    codigoCentroCusto: string | null | undefined,
    extensao: 'csv' | 'pdf',
    mesBm?: string | number | null,
    anoBm?: string | number | null
) {
    const codigo = normalizarCodigoCentro(codigoCentroCusto);
    const { mes, ano } = normalizarMesAno(mesBm, anoBm);
    const chaveContador = `bm_counter_${codigo}_${mes}${ano}`;

    let contadorAtual = 0;
    try {
        const salvo = window.localStorage.getItem(chaveContador);
        contadorAtual = Number.parseInt(salvo || '0', 10);
        if (Number.isNaN(contadorAtual) || contadorAtual < 0) contadorAtual = 0;
    } catch {
        contadorAtual = 0;
    }

    const proximo = contadorAtual + 1;
    try {
        window.localStorage.setItem(chaveContador, String(proximo));
    } catch {
        // Sem persistência local: segue com contador em memória do momento.
    }

    const contador = String(proximo).padStart(2, '0');
    return `BM${codigo}${mes}${ano}-${contador}.${extensao}`;
}
