import { NextRequest, NextResponse } from 'next/server';
import { renderPdf } from '@/lib/renderPdf';
import { generatePdf } from '@/lib/generatePdf';
import type { DadosTermoResponsabilidade } from '@/lib/termoResponsabilidadePdf';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            nomeFun,
            idMatFun,
            cpfFun,
            idPat,
            descricaoPat,
            marca,
            modelo,
            outrosProgramas,
            localData,
        } = body as DadosTermoResponsabilidade;

        if (!nomeFun || !idMatFun || !idPat || descricaoPat === undefined) {
            return NextResponse.json(
                {
                    message:
                        'Dados obrigatórios: nomeFun, idMatFun, idPat, descricaoPat',
                },
                { status: 400 }
            );
        }

        const documentData: DadosTermoResponsabilidade = {
            nomeFun,
            idMatFun,
            cpfFun: cpfFun ?? null,
            idPat,
            descricaoPat: descricaoPat ?? '',
            ...(marca != null && { marca }),
            ...(modelo != null && { modelo }),
            ...(outrosProgramas != null && { outrosProgramas }),
            ...(localData != null && { localData }),
        };

        const documentId = `${idMatFun}-${idPat}`;
        const htmlContent = await renderPdf(documentData);
        const pdfBuffer = await generatePdf(htmlContent, documentId, true);

        if (!pdfBuffer) {
            return NextResponse.json(
                { message: 'Falha ao gerar o PDF' },
                { status: 500 }
            );
        }

        const filename = `Termo-Responsabilidade-${documentId}.pdf`;

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': String(pdfBuffer.length),
            },
        });
    } catch (error) {
        console.error('Erro ao gerar PDF do termo:', error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error ? error.message : 'Erro ao gerar PDF',
            },
            { status: 500 }
        );
    }
}
