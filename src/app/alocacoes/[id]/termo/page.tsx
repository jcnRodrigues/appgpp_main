import Header from '@/back-end/components/Header/Header';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { buscarAlocacaoById } from '@/back-end/service/Cadastro.service/cadastro.service';
import PrintButton from './PrintButton';
import Image from 'next/image';
import { getTipoPatId } from '@/back-end/service/TipoPatrimonio.service/tipoPatrimonio.service';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';
import { UndoIcon } from 'lucide-react';
import fs from 'node:fs';
import path from 'node:path';

type Props = { params: { id: string } };

export default async function TermoPage({ params }: Props) {
    const session = await getServerSession(AuthOptions);

    if (!session?.user) {
        return (
            <div className="bg-background min-h-screen py-6">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h1 className="text-2xl font-bold mb-4">Termo de Responsabilidade</h1>
                    <div className="bg-white p-8 rounded-lg shadow-sm">
                        <p className="text-lg mb-6">Faca login para visualizar o termo</p>
                    </div>
                </div>
            </div>
        );
    }

    const { id } = await params;
    const alocacao = await buscarAlocacaoById(id);

    if (!alocacao) {
        return (
            <>
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-xl font-semibold">Alocacao nao encontrada</h2>
                </div>
            </>
        );
    }

    const centrosPerfil = Array.isArray((session.user as any).centros) ? ((session.user as any).centros as string[]) : [];
    const allowAll = centrosPerfil.includes('*');
    const centroFun = alocacao.tbFuncionario?.idCustoFun || '';
    const centroPat = alocacao.tbPatrimonio?.idPat_CustoPat || '';

    if (!allowAll && (!centrosPerfil.includes(centroFun) || !centrosPerfil.includes(centroPat))) {
        return (
            <>
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                    <h2 className="text-xl font-semibold">Acesso negado para este termo</h2>
                </div>
            </>
        );
    }

    const patrimonio = alocacao.tbPatrimonio;
    const tipoPatrimonio = await getTipoPatId(patrimonio?.idPat_TipoPat || '');
    const tipoPatrimonioTitulo = (tipoPatrimonio?.descricaoTipPat || 'PATRIMONIO').split(/\s+/).filter(Boolean)[0] || 'PATRIMONIO';
    const statusAlocacaoNormalizado = (alocacao.tbStatusPat?.descricaoStatPat || '').trim().toUpperCase();
    const condicaoPorStatus =
        statusAlocacaoNormalizado.includes('DEVOL')
            ? 'Condicao da alocacao: equipamento devolvido. O usuario declara que realizou a devolucao do patrimonio e encerra, nesta data, a responsabilidade de guarda.'
            : statusAlocacaoNormalizado.includes('TRANSFER')
                ? 'Condicao da alocacao: equipamento transferido. O usuario declara ciencia da transferencia e da baixa da responsabilidade sobre o patrimonio nesta data.'
                : statusAlocacaoNormalizado.includes('ATIVO')
                    ? 'Condicao da alocacao: equipamento ativo. O usuario permanece integralmente responsavel pela guarda, uso adequado e conservacao do patrimonio.'
                    : 'Condicao da alocacao: o usuario declara ciencia do status atual do patrimonio e de suas responsabilidades conforme as normas internas.';

    const logoCandidates = [
        '/iconPX.png',
        '/Imagens/iconPX.png',
        '/Imagens/parex.png',
        '/Imagens/parex_logo.png'
    ];

    const logoPath = logoCandidates.find((candidate) =>
        fs.existsSync(path.join(process.cwd(), 'public', candidate.replace(/^\//, '')))
    );

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-lg shadow ">
                <div className="grid grid-cols-[160px_1fr_130px] border border-black mb-6 min-h-[88px]">
                    <div className="border-r border-black flex items-center justify-center p-2">
                        {logoPath ? (
                            <Image
                                src={logoPath}
                                alt="Logo Parex"
                                width={130}
                                height={58}
                                className="h-auto w-auto max-h-[56px] object-contain"
                            />
                        ) : (
                            <div className="text-center leading-tight">
                                <div className="text-xl font-bold">PAREX</div>
                                <div className="text-[10px] tracking-[1px]">ENGENHARIA</div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center px-3 text-center">
                        <h2 className="text-[32px] font-bold leading-none">USO {tipoPatrimonioTitulo} PAREX</h2>
                        <p className="text-[16px] font-semibold leading-tight mt-1">Gerenciamento de Recursos Humanos</p>
                    </div>
                    <div className="border-l border-black grid grid-rows-4 text-xs font-semibold text-center">
                        <div className="border-b border-black flex items-center justify-center">PMO</div>
                        <div className="border-b border-black flex items-center justify-center">FO-09-052</div>
                        <div className="border-b border-black flex items-center justify-center">REV.:00</div>
                        <div className="flex items-center justify-center">PAG: 1 de 1</div>
                    </div>
                </div>

                <div className="text-sm text-gray-800 whitespace-pre-wrap m-4 text-justify">
                    <h2 className='text-center'>Termo de Responsabilidade</h2>
                    <h4 className='text-center'>Uso {tipoPatrimonio?.descricaoTipPat || 'TIPO PATRIMONIO'} Parex - Funcionarios</h4>

                    {`
\t Por este instrumento a PAREX entrega a guarda ao Sr., ${alocacao.tbFuncionario?.nomeFun || 'NOME'} - ${alocacao.tbFuncionario?.idMatFun || 'MATRICULA'} neste ato denominado USUARIO, inscrito no CPF no ${alocacao.tbFuncionario?.cpfFun || 'CPF'}, um computador marca ${patrimonio?.descricaoPat ? patrimonio.descricaoPat.split(' ')[0] : 'MARCA'}, modelo ${patrimonio?.descricaoDetalhadaPat || 'MODELO'}, contendo: 01 carregador de bateria, patrimoniado sob o Numero PAT${patrimonio?.idPat || 'PATRIMONIO'}, ficando o mesmo responsavel por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutencao deste equipamento, sob pena de ressarcimento a PAREX se algum destes fatos ocorrer e for constatada negligencia por parte do USUARIO.

\t O usuario permanece responsavel tambem pelo equipamento quando da transferencia do mesmo a outros funcionarios / terceiros sem a previa autorizacao da Coordenacao de TI Corporativa.

\t O USUARIO reconhece que a utilizacao do equipamento se dara somente no horario comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) as 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2a a 5a feiras e das 07h30min (Sete horas e trinta minutos) as 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) as 6a feiras e que o equipamento e para uso exclusivo no trabalho da empresa.

\t E proibida a instalacao de softwares sem a autorizacao da coordenacao da TI. Este equipamento esta licenciado com o sistema operacional Windows e o pacote Office (Word - Excel - Outlook - Power Point) e OBS se necessario incluir outros programas instalado que nao estao na lista.

\t ${condicaoPorStatus}

\t PARAUAPEBAS PA, ${alocacao.tbPatrimonio?.dataEntPat ? new Date(alocacao.tbPatrimonio.dataEntPat).toLocaleDateString('pt-BR') : ''}

Matricula: ${alocacao.tbFuncionario?.idMatFun}
Nome: ${alocacao.tbFuncionario?.nomeFun}
CPF no: ${alocacao.tbFuncionario?.cpfFun}


`}
                </div>
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="w-80 border-b-2" style={{ height: '1px' }} />
                        <div className="text-sm">{alocacao.tbFuncionario?.nomeFun}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-80 border-b-2" style={{ height: '1px' }} />
                        <div className="text-sm">Assinatura do Responsavel / Setor TI</div>
                    </div>
                </div>
                <div className="mt-10 grid md:grid-cols-2">
                    <div className="flex items-center justify-center">
                        <PrintButton />
                    </div>
                    <div className="flex items-center justify-center">
                        <Link href="/alocacoes">
                            <Button className="bg-primary hover:bg-primary/90">
                                <UndoIcon />
                                Voltar
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
