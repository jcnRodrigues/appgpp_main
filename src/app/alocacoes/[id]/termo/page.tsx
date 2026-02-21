import Header from '@/back-end/components/Header/Header';
import { getServerSession } from 'next-auth';
import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { buscarAlocacaoById } from '@/back-end/service/Cadastro.service/cadastro.service';
import PrintButton from './PrintButton';
import Image from 'next/image';
import { getTipoPatId } from '@/back-end/service/TipoPatrimonio.service/tipoPatrimonio.service';
import Link from 'next/link';
import { Button } from '@/back-end/components/ui/button';
import { Plus, UndoIcon } from 'lucide-react';

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
                        <p className="text-lg mb-6">Faça login para visualizar o termo</p>
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
                    <h2 className="text-xl font-semibold">Alocação não encontrada</h2>
                </div>
            </>
        );
    }

    const patrimonio = alocacao.tbPatrimonio;
    const tipoPatrimonio = await getTipoPatId(patrimonio?.idPat_TipoPat || '');

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-lg shadow ">
                {/* Cabeçalho com Logo, Título e Informações */}
                <div className="flex justify-center mb-6  pb-1 border-black">
                    {/* Logo PAREX */}
                    <div className="flex-shrink-0 border-2 border-black p-2">
                        <Image src="/iconPX.png" alt="" width={100} height={50} className="object-center" />
                    </div>
                    {/* Título Centralizado */}
                    <div className="flex-1 border-2 border-black px-2 py-1 text-center">
                        <h2 className="text-base font-bold">USO {tipoPatrimonio?.descricaoTipPat || 'TIPO PATRIMÔNIO'} PAREX</h2>
                        <p className="text-sm">Gerenciamento de Recursos Humanos</p>
                    </div>
                    {/* Informações à Direita */}
                    <div className="flex-shrink-0 text-right">
                        <table className="border-collapse border border-black text-xs">
                            <tbody>
                                <tr><td className="border-2 border-black px-2 py-1 font-semibold text-center">PMO</td></tr>
                                <tr><td className="border-2 border-black px-2 py-1 text-center">FO-09-052</td></tr>
                                <tr><td className="border-2 border-black px-2 py-1 text-center">REV.:00</td></tr>
                                <tr><td className="border-2 border-black px-2 py-1 text-center">PÁG: 1 de 1</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap m-4 text-justify">
                    <h2 className='text-center'>Termo de Responsabilidade</h2>
                    <h4 className='text-center'>Uso {tipoPatrimonio?.descricaoTipPat || 'TIPO PATRIMÔNIO'} Parex – Funcionários</h4>

                    {`
\t Por este instrumento a PAREX entrega à guarda ao Sr., ${alocacao.tbFuncionario?.nomeFun || 'NOME'} – ${alocacao.tbFuncionario?.idMatFun || 'MATRICULA'} neste ato denominado USUÁRIO, inscrito no CPF nº ${alocacao.tbFuncionario?.cpfFun || 'CPF'}, um computador marca ${patrimonio?.descricaoPat ? patrimonio.descricaoPat.split(' ')[0] : 'MARCA'}, modelo ${patrimonio?.descricaoDetalhadaPat || 'MODELO'}, contendo: 01 carregador de bateria, patrimoniado sob o Número PAT${patrimonio?.idPat || 'PATRIMONIO'}, ficando o mesmo responsável por qualquer dano, perda ou furto, e da mesma forma, pelo zelo e manutenção deste equipamento, sob pena de ressarcimento à PAREX se algum destes fatos ocorrer e for constatada negligência por parte do USUÁRIO.

\t O usuário permanece responsável também pelo equipamento quando da transferência do mesmo à outros funcionários / terceiros sem a prévia autorização da Coordenação de TI Corporativa.

\t O USUÁRIO reconhece que a utilização do equipamento se dará somente no horário comercial de trabalho, ou seja, de 07h30min (Sete horas e trinta minutos) às 17h30min (dezessete horas e trinta minutos), com intervalo de 01h00min (Uma hora), de 2ª a 5ª feiras e das 07h30min (Sete horas e trinta minutos) às 16h30min (dezesseis horas e trinta minutos), com intervalo de 01h00min (Uma hora) às 6ª feiras e que o equipamento é para uso exclusivo no trabalho da empresa.

\t É proibida a instalação de softwares sem a autorização da coordenação da TI. Este equipamento está licenciado com o sistema operacional Windows e o pacote Office (Word – Excel – Outlook – Power Point) e OBS se necessário incluir outros programas instalado que não estão na lista.

\t PARAUAPEBAS PA, ${alocacao.tbPatrimonio?.dataEntPat ? new Date(alocacao.tbPatrimonio.dataEntPat).toLocaleDateString('pt-BR') : ''} 

Matrícula: ${alocacao.tbFuncionario?.idMatFun}
Nome: ${alocacao.tbFuncionario?.nomeFun}         
CPF nº: ${alocacao.tbFuncionario?.cpfFun} 


`}
                </div>
                <div className="mt-8 grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <div className="w-80 border-b-2" style={{ height: '1px' }} />
                        <div className="text-sm">{alocacao.tbFuncionario?.nomeFun}</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="w-80 border-b-2" style={{ height: '1px' }} />
                        <div className="text-sm">Assinatura do Responsável / Setor TI</div>
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
