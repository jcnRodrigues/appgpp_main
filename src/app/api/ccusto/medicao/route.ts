import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx/xlsx.mjs';
import { listarPatrimoniosPorCentroCusto } from '@/back-end/service/Patrimonio.services/patrimonio.service';

export const runtime = 'nodejs';

type LinhaMedicao = {
    linha: number;
    idPat: string;
    valorInformado: number | null;
    valorSistema: number | null;
    status: 'OK' | 'VALOR_DIVERGENTE' | 'NAO_ENCONTRADO' | 'INVALIDO';
    mensagem: string;
};

function normalizarHeader(value: unknown) {
    return String(value || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function parseValor(value: unknown): number | null {
    if (value === null || value === undefined || value === '') return null;
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    const texto = String(value)
        .trim()
        .replace(/r\$/gi, '')
        .replace(/\s+/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^0-9.-]/g, '');
    if (!texto) return null;
    const numero = Number(texto);
    return Number.isFinite(numero) ? numero : null;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const idCCusto = formData.get('idCCusto');

        if (!idCCusto || typeof idCCusto !== 'string') {
            return NextResponse.json({ message: 'Centro de custo inválido.' }, { status: 400 });
        }

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ message: 'Arquivo Excel não informado.' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];

        if (!sheetName) {
            return NextResponse.json({ message: 'Planilha não encontrada no arquivo.' }, { status: 400 });
        }

        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' }) as unknown[][];

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Planilha vazia.' }, { status: 400 });
        }

        const header = rows[0] ?? [];
        const headerIndex = header.map(normalizarHeader);
        const idIndex = headerIndex.findIndex((h) => ['idpat', 'patrimonio', 'id'].includes(h));
        const valorIndex = headerIndex.findIndex((h) => ['valor', 'valorpat', 'valorpatrimonio'].includes(h));

        if (idIndex === -1 || valorIndex === -1) {
            return NextResponse.json(
                { message: 'Cabeçalho inválido. Use colunas "idPat" e "valor".' },
                { status: 400 }
            );
        }

        const patrimoniosCentro = await listarPatrimoniosPorCentroCusto(idCCusto);
        const mapaPatrimonios = new Map(
            patrimoniosCentro.map((p) => [String(p.idPat).toUpperCase(), p])
        );

        const resultados: LinhaMedicao[] = [];
        const idsArquivo = new Set<string>();

        for (let i = 1; i < rows.length; i += 1) {
            const row = rows[i] ?? [];
            const idPatRaw = row[idIndex];
            const valorRaw = row[valorIndex];

            const idPat = String(idPatRaw || '').trim().toUpperCase();
            const valorInformado = parseValor(valorRaw);

            if (!idPat) {
                resultados.push({
                    linha: i + 1,
                    idPat: '',
                    valorInformado,
                    valorSistema: null,
                    status: 'INVALIDO',
                    mensagem: 'ID do patrimônio vazio.'
                });
                continue;
            }

            idsArquivo.add(idPat);
            const patrimonio = mapaPatrimonios.get(idPat);

            if (!patrimonio) {
                resultados.push({
                    linha: i + 1,
                    idPat,
                    valorInformado,
                    valorSistema: null,
                    status: 'NAO_ENCONTRADO',
                    mensagem: 'Patrimônio não está atribuído ao centro de custo.'
                });
                continue;
            }

            const valorSistema = patrimonio.valorPat ?? null;
            const tolerancia = 0.01;
            const valorOk =
                valorInformado !== null &&
                valorSistema !== null &&
                Math.abs(valorInformado - valorSistema) <= tolerancia;

            resultados.push({
                linha: i + 1,
                idPat,
                valorInformado,
                valorSistema,
                status: valorOk ? 'OK' : 'VALOR_DIVERGENTE',
                mensagem: valorOk ? 'Valor confere.' : 'Valor divergente.'
            });
        }

        const naoInformados = patrimoniosCentro
            .filter((p) => !idsArquivo.has(String(p.idPat).toUpperCase()))
            .map((p) => ({
                idPat: p.idPat,
                descricaoPat: p.descricaoPat,
                valorSistema: p.valorPat ?? null
            }));

        const resumo = {
            totalLinhas: resultados.length,
            ok: resultados.filter((r) => r.status === 'OK').length,
            divergentes: resultados.filter((r) => r.status === 'VALOR_DIVERGENTE').length,
            naoEncontrados: resultados.filter((r) => r.status === 'NAO_ENCONTRADO').length,
            invalidos: resultados.filter((r) => r.status === 'INVALIDO').length
        };

        return NextResponse.json({
            resumo,
            resultados,
            naoInformados
        });
    } catch (error) {
        console.error('Erro ao processar medição:', error);
        return NextResponse.json(
            { message: 'Erro ao processar a medição.' },
            { status: 500 }
        );
    }
}
