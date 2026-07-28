import { NextRequest, NextResponse } from 'next/server';
import prisma from '../../../../../../prisma/prisma';
import { getCentrosFiltro, hasActionPermissionForRequest, hasModuleAccessForRequest } from '@/lib/access';
import { getServerSession } from 'next-auth';
import { AuthOptions } from "@/lib/auth-options";

export const runtime = 'nodejs';

const prismaClient = prisma as any;

async function resolverTbUserIdDaSessao(session: any) {
    const sessaoId = String(session?.user?.id || '').trim();
    const sessaoEmail = String(session?.user?.email || '').trim();

    if (!sessaoId && !sessaoEmail) return null;

    const porIdDireto = sessaoId
        ? await prismaClient.tbUser.findFirst({
            where: { id: sessaoId },
            select: { id: true }
        })
        : null;
    if (porIdDireto?.id) return porIdDireto.id as string;

    const porIdUser = sessaoId
        ? await prismaClient.tbUser.findFirst({
            where: { idUser: sessaoId },
            select: { id: true }
        })
        : null;
    if (porIdUser?.id) return porIdUser.id as string;

    const porEmail = sessaoEmail
        ? await prismaClient.tbUser.findFirst({
            where: { emailUser: sessaoEmail },
            select: { id: true }
        })
        : null;
    if (porEmail?.id) return porEmail.id as string;

    return null;
}

function to2(n: number) {
    return String(n).padStart(2, '0');
}

function normalizarMesAno(mes: unknown, ano: unknown) {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();

    const m = Number(mes);
    const a = Number(ano);

    const mesFinal = Number.isInteger(m) && m >= 1 && m <= 12 ? m : mesAtual;
    const anoFinal = Number.isInteger(a) && a >= 2000 && a <= 2099 ? a : anoAtual;

    return { mes: mesFinal, ano: anoFinal };
}

function normalizarCodigoCentro(codigoCentroCusto?: string | null) {
    const digits = String(codigoCentroCusto || '').replace(/\D/g, '');
    if (!digits) return '0000';
    return digits.padStart(4, '0').slice(-4);
}

async function montarCodigoBm(idCCusto: string, codigoCentroCusto?: string | null, mes?: unknown, ano?: unknown) {
    const { mes: mesFinal, ano: anoFinal } = normalizarMesAno(mes, ano);
    const codigoCentro = normalizarCodigoCentro(codigoCentroCusto);
    const ano2 = String(anoFinal).slice(-2);

    const ultimo = await prismaClient.tbBmMedicao.findFirst({
        where: {
            idCCusto,
            mesBm: mesFinal,
            anoBm: anoFinal
        },
        orderBy: { contadorBm: 'desc' }
    });

    const proximoContador = (ultimo?.contadorBm || 0) + 1;
    const codigoBm = `BM${codigoCentro}${to2(mesFinal)}${ano2}-${to2(proximoContador)}`;

    return {
        codigoBm,
        contadorBm: proximoContador,
        mesBm: mesFinal,
        anoBm: anoFinal,
        codigoCentro
    };
}

function mapBm(item: any) {
    return {
        idBm: item.idBm,
        codigoBm: item.codigoBm,
        idCCusto: item.idCCusto,
        codigoCCusto: item.codigoCCusto,
        descricaoCCusto: item.descricaoCCusto,
        mesBm: item.mesBm,
        anoBm: item.anoBm,
        contadorBm: item.contadorBm,
        statusBm: item.statusBm,
        dataInicioMedicao: item.dataInicioMedicao,
        dataFimMedicao: item.dataFimMedicao,
        gerouRelatorioExcel: item.gerouRelatorioExcel,
        gerouRelatorioPdf: item.gerouRelatorioPdf,
        fechadoAt: item.fechadoAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        resumo: item.resumoJson,
        resultados: item.resultadosJson,
        naoInformados: item.naoInformadosJson
    };
}

export async function GET(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'MEDICAO_CCUSTO');
    if (!canAccess) return NextResponse.json({ message: 'Sem permissão para acessar BM de medição' }, { status: 403 });
    try {
        const { searchParams } = new URL(request.url);
        const idBm = searchParams.get('idBm');
        const idCCusto = searchParams.get('idCCusto');
        const status = (searchParams.get('status') || 'ABERTO').toUpperCase();

        const { centros, allowAll } = await getCentrosFiltro(request);

        if (idBm) {
            const bm = await prismaClient.tbBmMedicao.findUnique({ where: { idBm } });
            if (!bm) return NextResponse.json({ message: 'BM não encontrado.' }, { status: 404 });
            if (!allowAll && centros.length > 0 && !centros.includes(bm.idCCusto)) {
                return NextResponse.json({ message: 'Centro de custo não permitido.' }, { status: 403 });
            }
            return NextResponse.json({ data: mapBm(bm) });
        }

        const where: any = {};
        if (idCCusto) where.idCCusto = idCCusto;
        if (status === 'ABERTO' || status === 'FECHADO') where.statusBm = status;
        if (!allowAll && centros.length > 0) {
            where.idCCusto = where.idCCusto
                ? where.idCCusto
                : { in: centros };
        }

        const lista = await prismaClient.tbBmMedicao.findMany({
            where,
            orderBy: [{ updatedAt: 'desc' }],
            take: 100
        });

        return NextResponse.json({ data: lista.map(mapBm) });
    } catch (error) {
        console.error('Erro ao listar BM:', error);
        return NextResponse.json({ message: 'Erro ao listar BM.' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'MEDICAO_CCUSTO');
    const canCreate = await hasActionPermissionForRequest(request, 'CREATE');
    if (!canAccess || !canCreate) return NextResponse.json({ message: 'Sem permissão para registrar BM' }, { status: 403 });
    try {
        const body = await request.json();
        const {
            idBm,
            idCCusto,
            codigoCCusto,
            descricaoCCusto,
            mesBm,
            anoBm,
            dataInicioMedicao,
            dataFimMedicao,
            resumo,
            resultados,
            naoInformados,
            formatoRelatorio
        } = body || {};

        if (!idCCusto || typeof idCCusto !== 'string') {
            return NextResponse.json({ message: 'Centro de custo inválido.' }, { status: 400 });
        }

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0 && !centros.includes(idCCusto)) {
            return NextResponse.json({ message: 'Centro de custo não permitido.' }, { status: 403 });
        }

        const ini = new Date(dataInicioMedicao);
        const fim = new Date(dataFimMedicao);
        if (Number.isNaN(ini.getTime()) || Number.isNaN(fim.getTime())) {
            return NextResponse.json({ message: 'Período de medição inválido.' }, { status: 400 });
        }

        const session = await getServerSession(AuthOptions);
        const userId = await resolverTbUserIdDaSessao(session);

        let bm: any = null;
        if (idBm) {
            bm = await prismaClient.tbBmMedicao.findUnique({ where: { idBm } });
            if (!bm) return NextResponse.json({ message: 'BM não encontrado.' }, { status: 404 });
            if (bm.statusBm !== 'ABERTO') {
                return NextResponse.json({ message: 'Somente BM em aberto pode ser atualizado.' }, { status: 400 });
            }

            bm = await prismaClient.tbBmMedicao.update({
                where: { idBm },
                data: {
                    dataInicioMedicao: ini,
                    dataFimMedicao: fim,
                    resumoJson: resumo ?? bm.resumoJson,
                    resultadosJson: resultados ?? bm.resultadosJson,
                    naoInformadosJson: naoInformados ?? bm.naoInformadosJson,
                    gerouRelatorioExcel: formatoRelatorio === 'excel' ? true : bm.gerouRelatorioExcel,
                    gerouRelatorioPdf: formatoRelatorio === 'pdf' ? true : bm.gerouRelatorioPdf,
                    idUserGeracao: userId || bm.idUserGeracao
                }
            });

            return NextResponse.json({ data: mapBm(bm) });
        }

        const codigo = await montarCodigoBm(idCCusto, codigoCCusto, mesBm, anoBm);
        bm = await prismaClient.tbBmMedicao.create({
            data: {
                codigoBm: codigo.codigoBm,
                idCCusto,
                codigoCCusto: codigo.codigoCentro,
                descricaoCCusto: descricaoCCusto || null,
                mesBm: codigo.mesBm,
                anoBm: codigo.anoBm,
                contadorBm: codigo.contadorBm,
                dataInicioMedicao: ini,
                dataFimMedicao: fim,
                resumoJson: resumo ?? null,
                resultadosJson: resultados ?? null,
                naoInformadosJson: naoInformados ?? null,
                gerouRelatorioExcel: formatoRelatorio === 'excel',
                gerouRelatorioPdf: formatoRelatorio === 'pdf',
                idUserGeracao: userId
            }
        });

        return NextResponse.json({ data: mapBm(bm) }, { status: 201 });
    } catch (error) {
        console.error('Erro ao registrar BM:', error);
        return NextResponse.json({ message: 'Erro ao registrar BM.' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    const canAccess = await hasModuleAccessForRequest(request, 'MEDICAO_CCUSTO');
    const canUpdate = await hasActionPermissionForRequest(request, 'UPDATE');
    if (!canAccess || !canUpdate) return NextResponse.json({ message: 'Sem permissão para atualizar BM' }, { status: 403 });
    try {
        const body = await request.json();
        const { idBm, statusBm, dataInicioMedicao, dataFimMedicao, resumo, resultados, naoInformados } = body || {};

        if (!idBm || typeof idBm !== 'string') {
            return NextResponse.json({ message: 'ID do BM inválido.' }, { status: 400 });
        }

        const existente = await prismaClient.tbBmMedicao.findUnique({ where: { idBm } });
        if (!existente) return NextResponse.json({ message: 'BM não encontrado.' }, { status: 404 });

        const { centros, allowAll } = await getCentrosFiltro(request);
        if (!allowAll && centros.length > 0 && !centros.includes(existente.idCCusto)) {
            return NextResponse.json({ message: 'Centro de custo não permitido.' }, { status: 403 });
        }

        if (existente.statusBm !== 'ABERTO' && statusBm !== 'ABERTO') {
            return NextResponse.json({ message: 'BM fechado não pode ser editado.' }, { status: 400 });
        }

        const data: any = {};
        if (typeof statusBm === 'string') {
            const status = statusBm.toUpperCase();
            if (status !== 'ABERTO' && status !== 'FECHADO') {
                return NextResponse.json({ message: 'Status inválido.' }, { status: 400 });
            }
            data.statusBm = status;
            data.fechadoAt = status === 'FECHADO' ? new Date() : null;
        }

        if (dataInicioMedicao) {
            const ini = new Date(dataInicioMedicao);
            if (Number.isNaN(ini.getTime())) {
                return NextResponse.json({ message: 'Data de início inválida.' }, { status: 400 });
            }
            data.dataInicioMedicao = ini;
        }

        if (dataFimMedicao) {
            const fim = new Date(dataFimMedicao);
            if (Number.isNaN(fim.getTime())) {
                return NextResponse.json({ message: 'Data de fim inválida.' }, { status: 400 });
            }
            data.dataFimMedicao = fim;
        }

        if (resumo !== undefined) data.resumoJson = resumo;
        if (resultados !== undefined) data.resultadosJson = resultados;
        if (naoInformados !== undefined) data.naoInformadosJson = naoInformados;

        const atualizado = await prismaClient.tbBmMedicao.update({
            where: { idBm },
            data
        });

        return NextResponse.json({ data: mapBm(atualizado) });
    } catch (error) {
        console.error('Erro ao atualizar BM:', error);
        return NextResponse.json({ message: 'Erro ao atualizar BM.' }, { status: 500 });
    }
}


