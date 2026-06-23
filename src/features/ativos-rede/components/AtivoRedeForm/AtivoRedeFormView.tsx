/* eslint-disable @next/next/no-img-element */
'use client'

import Link from 'next/link';
import { Inbox, Router, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FormActions from '@/components/FormActions/FormActions';
import PageHeader from '@/components/PageHeader/PageHeader';
import TableState from '@/components/TableState/TableState';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';

type TipoAtivoRede = {
    idTipoAtivoRede: string;
    descricaoTipoAtivoRede: string;
};

type StatusAtivoRede = {
    idStatusAtivoRede: string;
    descricaoStatusAtivoRede: string;
};

type CentroCusto = {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
};

type FormState = {
    idAtivoRede: string;
    nomeAtivoRede: string;
    idTipoAtivoRede: string;
    tipoAtivoRede: string;
    fabricanteAtivoRede: string;
    modeloAtivoRede: string;
    serialAtivoRede: string;
    macAtivoRede: string;
    ipGerenciamentoAtivoRede: string;
    hostnameAtivoRede: string;
    localInstalacaoAtivoRede: string;
    rackAtivoRede: string;
    portaSwitchAtivoRede: string;
    fotoAtivoRede: string;
    dataEntradaAtivoRede: string;
    dataInstalacaoAtivoRede: string;
    idStatusAtivoRede: string;
    statusAtivoRede: string;
    idCCustoAtivoRede: string;
    centroResponsavelAtivoRede: string;
    observacaoAtivoRede: string;
};

type Props = {
    ativoRedeId?: string;
    isEditing: boolean;
    canManageOptions: boolean;
    canManageTransfer: boolean;
    canManageReturn: boolean;
    loading: boolean;
    loadingOpcoes: boolean;
    salvandoOpcao: boolean;
    historicoTransferencias: any[];
    historicoDevolucoes: any[];
    opçõesTipo: TipoAtivoRede[];
    opçõesStatus: StatusAtivoRede[];
    opçõesCentros: CentroCusto[];
    form: FormState;
    formOpcao: { kind: string; descricao: string };
    modalOpcaoAberto: boolean;
    handleEnterToNext: (event: React.KeyboardEvent<HTMLFormElement>) => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    handleFotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFotoRemove: () => void;
    handleSubmit: (event: React.FormEvent) => void;
    handleCreateOption: (event: React.FormEvent) => void;
    setModalOpcaoAberto: (value: boolean) => void;
    setFormOpcao: React.Dispatch<React.SetStateAction<{ kind: string; descricao: string }>>;
    onSelectTipo: (id: string) => void;
    onSelectStatus: (id: string) => void;
    onSelectCentro: (id: string) => void;
    onCancel: () => void;
};

function formatarCentro(centro?: CentroCusto | null) {
    if (!centro) return '';
    return [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(' - ') || '';
}

export default function AtivoRedeFormView(props: Props) {
    const {
        ativoRedeId,
        isEditing,
        canManageOptions,
        canManageTransfer,
        canManageReturn,
        loading,
        loadingOpcoes,
        salvandoOpcao,
        historicoTransferencias,
        historicoDevolucoes,
        opçõesTipo,
        opçõesStatus,
        opçõesCentros,
        form,
        formOpcao,
        modalOpcaoAberto,
        handleEnterToNext,
        handleChange,
        handleFotoChange,
        handleFotoRemove,
        handleSubmit,
        handleCreateOption,
        setModalOpcaoAberto,
        setFormOpcao,
        onSelectTipo,
        onSelectStatus,
        onSelectCentro,
        onCancel
    } = props;

    return (
        <div className="bg-background min-h-screen py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <PageHeader
                    icon={Router}
                    title={isEditing ? 'Editar Ativo de Rede' : 'Cadastrar Novo Ativo de Rede'}
                    backHref="/ativos-rede"
                    actions={
                        isEditing && (canManageTransfer || canManageReturn) ? (
                            <>
                                {canManageTransfer ? (
                                    <Button asChild type="button" variant="ghost" className="bg-blue-600 text-white shadow-sm hover:bg-blue-700">
                                        <Link href={`/ativos-rede/${ativoRedeId}/transferencia`}>
                                            Transferência
                                        </Link>
                                    </Button>
                                ) : null}
                                {canManageReturn ? (
                                    <Button asChild type="button" variant="ghost" className="bg-red-600 text-white shadow-sm hover:bg-red-700">
                                        <Link href={`/ativos-rede/${ativoRedeId}/devolucao`}>
                                            Devolução
                                        </Link>
                                    </Button>
                                ) : null}
                            </>
                        ) : null
                    }
                />

                <form
                    onSubmit={handleSubmit}
                    onKeyDown={handleEnterToNext}
                    className="bg-white rounded-lg shadow-lg p-5 sm:p-7 space-y-5"
                >
                    <section className="border-b pb-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div className="max-w-xl">
                                <h2 className="text-h4 font-bold mb-2">Informações Básicas</h2>
                                <p className="text-sm text-gray-600">Cadastro no mesmo padrão visual do formulário de patrimônio.</p>
                            </div>
                            <div className="flex flex-col gap-3 lg:items-end">
                                {canManageOptions ? (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setModalOpcaoAberto(true)}
                                        className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        Cadastrar tipo/status
                                    </Button>
                                ) : null}
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1.05fr]">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">ID Ativo de Rede *</label>
                                        <input
                                            type="text"
                                            name="idAtivoRede"
                                            value={form.idAtivoRede}
                                            onChange={handleChange}
                                            disabled={isEditing}
                                            placeholder="Ex: NET001"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Tipo *</label>
                                        <select
                                            value={form.idTipoAtivoRede}
                                            onChange={(e) => onSelectTipo(e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!form.idTipoAtivoRede ? 'border-red-300 bg-red-50' : ''}`}
                                            required
                                            disabled={loadingOpcoes}
                                        >
                                            <option value="">{loadingOpcoes ? 'Carregando...' : '--- Selecione um tipo ---'}</option>
                                            {opçõesTipo.map((tipo) => (
                                                <option key={tipo.idTipoAtivoRede} value={tipo.idTipoAtivoRede}>
                                                    {tipo.descricaoTipoAtivoRede}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status *</label>
                                        <select
                                            value={form.idStatusAtivoRede}
                                            onChange={(e) => onSelectStatus(e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!form.idStatusAtivoRede ? 'border-red-300 bg-red-50' : ''}`}
                                            required
                                            disabled={loadingOpcoes}
                                        >
                                            <option value="">{loadingOpcoes ? 'Carregando...' : '--- Selecione um status ---'}</option>
                                            {opçõesStatus.map((status) => (
                                                <option key={status.idStatusAtivoRede} value={status.idStatusAtivoRede}>
                                                    {status.descricaoStatusAtivoRede}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nome / Identificacao *</label>
                                    <input
                                        type="text"
                                        name="nomeAtivoRede"
                                        value={form.nomeAtivoRede}
                                        onChange={handleChange}
                                        placeholder="Ex: Switch principal do andar 2"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        required
                                    />
                                </div>


                                <h2 className="text-h4 font-bold mb-3 gap-4">Especificações Técnicas</h2>
                                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Fabricante</label>
                                        <input
                                            type="text"
                                            name="fabricanteAtivoRede"
                                            value={form.fabricanteAtivoRede}
                                            onChange={handleChange}
                                            placeholder="Ex: UBIQUITI"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Modelo</label>
                                        <input
                                            type="text"
                                            name="modeloAtivoRede"
                                            value={form.modeloAtivoRede}
                                            onChange={handleChange}
                                            placeholder="Ex: USW-24"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Serial</label>
                                        <input
                                            type="text"
                                            name="serialAtivoRede"
                                            value={form.serialAtivoRede}
                                            onChange={handleChange}
                                            placeholder="Ex: 4C:... ou SN123"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">MAC</label>
                                        <input
                                            type="text"
                                            name="macAtivoRede"
                                            value={form.macAtivoRede}
                                            onChange={handleChange}
                                            placeholder="Ex: AA:BB:CC:DD:EE:FF"
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={`rounded-2xl border p-4 text-white shadow-md transition-all 
                            ${form.fotoAtivoRede
                                    ? 'border-emerald-300/50 bg-gradient-to-br from-slate-950 to-emerald-700 shadow-emerald-950/20'
                                    : 'border-slate-200 bg-gradient-to-br from-slate-950 to-emerald-700'
                                }`}>
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.18em] text-emerald-200">
                                            Foto do equipamento
                                        </p>
                                        <p className="mt-1 text-sm text-slate-200">
                                            Anexe a imagem logo no cadastro.
                                        </p>
                                    </div>
                                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white transition-colors 
                                    ${form.fotoAtivoRede ? 'bg-emerald-500/30' : 'bg-white/10'
                                        }`}>
                                        <Router className="h-7 w-7" />
                                    </div>
                                </div>

                                <div className={`mt-3 overflow-hidden rounded-2xl border bg-black/25 transition-all 
                                ${form.fotoAtivoRede ? 'border-emerald-200/50 shadow-[0_0_0_1px_rgba(16,185,129,0.18)]'
                                        : 'border-white/15'
                                    }`}>
                                    {form.fotoAtivoRede ? (
                                        <button
                                            type="button"
                                            onClick={handleFotoRemove}
                                            className="block w-full cursor-pointer"
                                            title="Clique para remover a foto"
                                        >
                                            <img src={form.fotoAtivoRede}
                                                alt="Foto do equipamento"
                                                className="h-40 w-full object-contain bg-slate-950/30"
                                            />
                                        </button>
                                    ) : (
                                        <div className="flex h-40 items-center justify-center text-sm text-emerald-100/80">
                                            Nenhuma foto adicionada
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4 rounded-2xl bg-white/10 p-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFotoChange}
                                        className="block w-full text-sm text-slate-100 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-slate-900 hover:file:bg-slate-100"
                                    />
                                    <p className="mt-2 text-xs text-emerald-100">JPG, PNG, WEBP. Máximo sugerido: 5 MB.</p>
                                    <div className="mt-3 flex gap-2">
                                        <Button
                                            type="button"
                                            onClick={handleFotoRemove}
                                            variant="ghost"
                                            className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
                                        >
                                            Remover foto
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="border-b pb-5">
                        <h2 className="text-h4 font-bold mb-3">Rede e Localização</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2">IP de Gerenciamento</label>
                                <input
                                    type="text"
                                    name="ipGerenciamentoAtivoRede"
                                    value={form.ipGerenciamentoAtivoRede}
                                    onChange={handleChange}
                                    placeholder="Ex: 192.168.1.10"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Hostname</label>
                                <input
                                    type="text"
                                    name="hostnameAtivoRede"
                                    value={form.hostnameAtivoRede}
                                    onChange={handleChange}
                                    placeholder="Ex: sw-it-01"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Local de Instalação</label>
                                <input
                                    type="text"
                                    name="localInstalacaoAtivoRede"
                                    value={form.localInstalacaoAtivoRede}
                                    onChange={handleChange}
                                    placeholder="Ex: Bloco A - Sala TI"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Rack / Sala</label>
                                <input
                                    type="text"
                                    name="rackAtivoRede"
                                    value={form.rackAtivoRede}
                                    onChange={handleChange}
                                    placeholder="Ex: Rack 02"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Porta no Switch</label>
                                <input
                                    type="text"
                                    name="portaSwitchAtivoRede"
                                    value={form.portaSwitchAtivoRede}
                                    onChange={handleChange}
                                    placeholder="Ex: Gi0/24"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                        </div>
                    </section>

                    <section className="border-b pb-5">
                        <h2 className="text-h4 font-bold mb-3">Controle e Datas</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Entrada *</label>
                                <input
                                    type="date"
                                    name="dataEntradaAtivoRede"
                                    value={form.dataEntradaAtivoRede}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Data de Instalação</label>
                                <input
                                    type="date"
                                    name="dataInstalacaoAtivoRede"
                                    value={form.dataInstalacaoAtivoRede}
                                    onChange={handleChange}
                                    min={form.dataEntradaAtivoRede}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Centro de Custo *</label>
                                <select
                                    value={form.idCCustoAtivoRede}
                                    onChange={(e) => onSelectCentro(e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${!form.idCCustoAtivoRede ? 'border-red-300 bg-red-50' : ''}`}
                                    required
                                    disabled={loadingOpcoes}
                                >
                                    <option value="">{loadingOpcoes ? 'Carregando...' : '--- Selecione um centro ---'}</option>
                                    {opçõesCentros.map((centro) => (
                                        <option key={centro.idCCusto} value={centro.idCCusto}>
                                            {formatarCentro(centro)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-2">Observações</label>
                            <textarea
                                name="observacaoAtivoRede"
                                value={form.observacaoAtivoRede}
                                onChange={handleChange}
                                placeholder="Informações adicionais, garantia, projeto, manutenções, etc."
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                            />
                        </div>
                    </section>

                    {isEditing && (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4">
                                <h2 className="text-h4 font-bold mb-3">Histórico de Transferências</h2>
                                {historicoTransferencias.length === 0 ? (
                                    <TableState icon={Inbox} title="Nenhuma transferência registrada" compact />
                                ) : (
                                    <div className="space-y-3">
                                        {historicoTransferencias.map((item) => (
                                            <div key={item.idTransferenciaAtivoRede} className="border-b last:border-b-0 pb-2 text-sm">
                                                <p className="font-medium">
                                                    {item.localOrigemAtivoRede || 'Sem local anterior'} {' → '} {item.localDestinoAtivoRede || 'Sem local destino'}
                                                </p>
                                                <p className="text-gray-600">
                                                    {item.centroOrigemAtivoRede || 'Sem centro anterior'} {' → '} {item.centroDestinoAtivoRede || 'Sem centro destino'}
                                                </p>
                                                <p className="text-gray-600">
                                                    {new Date(item.dataTransferencia).toLocaleString('pt-BR')}
                                                </p>
                                                {item.observacao && <p className="text-gray-500">{item.observacao}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="border rounded-lg p-4">
                                <h2 className="text-h4 font-bold mb-3">Histórico de Devoluções</h2>
                                {historicoDevolucoes.length === 0 ? (
                                    <TableState icon={Inbox} title="Nenhuma devolução registrada" compact />
                                ) : (
                                    <div className="space-y-3">
                                        {historicoDevolucoes.map((item) => (
                                            <div key={item.idDevolucaoAtivoRede} className="border-b last:border-b-0 pb-2 text-sm">
                                                <p className="font-medium">{new Date(item.dataInicioDevolucao).toLocaleDateString('pt-BR')}</p>
                                                <p className="text-gray-600">{item.destinoDevolucao || 'Sem destino'}</p>
                                                {item.motivoDevolucao && <p className="text-gray-500">{item.motivoDevolucao}</p>}
                                                {item.notaFiscalDevolucao && <p className="text-gray-500">NF: {item.notaFiscalDevolucao}</p>}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <FormActions
                        cancelHref="/ativos-rede"
                        submitLabel={isEditing ? 'Atualizar' : 'Criar'}
                        loading={loading}
                        onCancel={onCancel}
                    />
                </form>
            </div>

            <AlertDialog open={modalOpcaoAberto} onOpenChange={setModalOpcaoAberto}>
                <AlertDialogContent className="max-w-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Cadastrar tipo ou status</AlertDialogTitle>
                        <AlertDialogDescription>Crie uma nova opção para usar no cadastro do ativo de rede.</AlertDialogDescription>
                    </AlertDialogHeader>

                    <form onSubmit={handleCreateOption} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tipo de cadastro</label>
                            <select
                                value={formOpcao.kind}
                                onChange={(e) => setFormOpcao((prev) => ({ ...prev, kind: e.target.value }))}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="TIPO">Tipo</option>
                                <option value="STATUS">Status</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Descrição</label>
                            <input
                                type="text"
                                value={formOpcao.descricao}
                                onChange={(e) => setFormOpcao((prev) => ({ ...prev, descricao: e.target.value.toUpperCase() }))}
                                placeholder="Ex: ROTEADOR"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <FormActions
                            cancelLabel="Cancelar"
                            submitLabel="Salvar"
                            loading={salvandoOpcao}
                            className="flex justify-end gap-3 pt-2"
                            onCancel={() => setModalOpcaoAberto(false)}
                            cancelClassName="border-slate-300 bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-white shadow-sm"
                            submitClassName="bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                        />
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


