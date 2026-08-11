'use client'

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEnterToNext } from '@/hooks/useEnterToNext';
import { useFormDraft } from '@/hooks/useFormDraft';
import AtivoRedeFormView from './AtivoRedeFormView';
import { notify as showNotify } from '@/lib/notify';
import { useSession } from 'next-auth/react';
import { hasModuleActionPermission } from '@/lib/permissions';

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

type Fornecedor = {
    idFornecedor: string;
    razaoSocialFornecedor: string;
    nomeFantasiaFornecedor?: string | null;
    cnpjFornecedor?: string | null;
};

type OpcoesAtivoRede = {
    tipos: TipoAtivoRede[];
    status: StatusAtivoRede[];
    centros: CentroCusto[];
    fornecedores: Fornecedor[];
};

type FormState = {
    idAtivoRede: string;
    nomeAtivoRede: string;
    idTipoAtivoRede: string;
    tipoAtivoRede: string;
    idFornecedorAtivoRede: string;
    fornecedorAtivoRede: string;
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

const initialState: FormState = {
    idAtivoRede: '',
    nomeAtivoRede: '',
    idTipoAtivoRede: '',
    tipoAtivoRede: '',
    idFornecedorAtivoRede: '',
    fornecedorAtivoRede: '',
    fabricanteAtivoRede: '',
    modeloAtivoRede: '',
    serialAtivoRede: '',
    macAtivoRede: '',
    ipGerenciamentoAtivoRede: '',
    hostnameAtivoRede: '',
    localInstalacaoAtivoRede: '',
    rackAtivoRede: '',
    portaSwitchAtivoRede: '',
    fotoAtivoRede: '',
    dataEntradaAtivoRede: new Date().toISOString().split('T')[0],
    dataInstalacaoAtivoRede: '',
    idStatusAtivoRede: '',
    statusAtivoRede: '',
    idCCustoAtivoRede: '',
    centroResponsavelAtivoRede: '',
    observacaoAtivoRede: '',
};

export default function AtivoRedeForm({ ativoRedeId }: { ativoRedeId?: string }) {
    const router = useRouter();
    const { data: session } = useSession();
    const handleEnterToNext = useEnterToNext();
    const [loading, setLoading] = useState(false);
    const [loadingOpcoes, setLoadingOpcoes] = useState(true);
    const [salvandoOpcao, setSalvandoOpcao] = useState(false);
    const [historicoTransferencias, setHistoricoTransferencias] = useState<any[]>([]);
    const [historicoDevolucoes, setHistoricoDevolucoes] = useState<any[]>([]);
    const [opções, setOpcoes] = useState<OpcoesAtivoRede>({ tipos: [], status: [], centros: [], fornecedores: [] });
    const [modalOpcaoAberto, setModalOpcaoAberto] = useState(false);
    const [formOpcao, setFormOpcao] = useState({
        kind: 'TIPO',
        descricao: ''
    });
    const {
        state: form,
        setState: setForm,
        clearDraft
    } = useFormDraft<FormState>('ativo-rede-form-create', initialState, { enabled: !ativoRedeId });

    const isEditing = !!ativoRedeId;
    const formularios = ((session?.user as any)?.formularios || []) as string[];
    const canManageOptions = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'OPTIONS');
    const canManageTransfer = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'TRANSFER');
    const canManageReturn = hasModuleActionPermission(formularios, 'ATIVOS_REDE', 'RETURN');

    const opçõesTipo = useMemo(() => opções.tipos, [opções.tipos]);
    const opçõesStatus = useMemo(() => opções.status, [opções.status]);
    const opçõesCentros = useMemo(() => opções.centros, [opções.centros]);
    const opçõesFornecedores = useMemo(() => opções.fornecedores, [opções.fornecedores]);

    const formatarMac = (valor: string) => {
        const hex = valor.replace(/[^0-9a-fA-F]/g, '').toUpperCase().slice(0, 12);
        const pares = hex.match(/.{1,2}/g);
        return pares ? pares.join(':') : '';
    };

    const fieldsToUppercase = [
        'idAtivoRede',
        'nomeAtivoRede',
        'fabricanteAtivoRede',
        'modeloAtivoRede',
        'serialAtivoRede',
        'hostnameAtivoRede',
        'localInstalacaoAtivoRede',
        'rackAtivoRede',
        'portaSwitchAtivoRede',
        'centroResponsavelAtivoRede',
        'observacaoAtivoRede',
    ];

    const notify = useCallback((type: 'sucesso' | 'erro' | 'aviso', message: string) => {
        showNotify(type, message);
    }, []);

    const formatarCentro = (centro?: CentroCusto | null) => {
        if (!centro) return '';
        return [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(' - ') || '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'macAtivoRede'
            ? formatarMac(value)
            : fieldsToUppercase.includes(name)
                ? value.toUpperCase()
                : value;
        setForm((prev) => ({ ...prev, [name]: newValue }));
    };

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const limiteBytes = 5 * 1024 * 1024;
        if (file.size > limiteBytes) {
            notify('aviso', 'A foto precisa ter no máximo 5 MB.');
            e.target.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            notify('aviso', 'Selecione uma imagem válida.');
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setForm((prev) => ({
                ...prev,
                fotoAtivoRede: typeof reader.result === 'string' ? reader.result : ''
            }));
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handleFotoRemove = () => {
        setForm((prev) => ({
            ...prev,
            fotoAtivoRede: ''
        }));
    };

    const carregarOpcoes = useCallback(async () => {
        setLoadingOpcoes(true);
        try {
            const response = await fetch('/api/ativos-rede/opcoes');
            if (!response.ok) throw new Error('Erro ao carregar opções de ativo de rede');
            const data = await response.json();
            setOpcoes({
                tipos: Array.isArray(data.tipos) ? data.tipos : [],
                status: Array.isArray(data.status) ? data.status : [],
                centros: Array.isArray(data.centros) ? data.centros : [],
                fornecedores: Array.isArray(data.fornecedores) ? data.fornecedores : []
            });
        } catch (error) {
            console.error('Erro ao carregar opções:', error);
            notify('erro', 'Não foi possível carregar tipos, status e centros de custo.');
        } finally {
            setLoadingOpcoes(false);
        }
    }, [notify]);

    useEffect(() => {
        carregarOpcoes();
    }, [carregarOpcoes]);

    useEffect(() => {
        const carregarAtivo = async () => {
            if (!ativoRedeId) return;

            try {
                const response = await fetch(`/api/ativos-rede/${ativoRedeId}`);
                if (!response.ok) return;
                const data = await response.json();
                const tipoRelacionado = data.tbTipoAtivoRede?.descricaoTipoAtivoRede || data.tipoAtivoRede || '';
                const statusRelacionado = data.tbStatusAtivoRede?.descricaoStatusAtivoRede || data.statusAtivoRede || '';
                const centroRelacionado = formatarCentro(data.tbCCusto) || data.centroResponsavelAtivoRede || '';
                const fornecedorRelacionado = data.tbFornecedor?.razaoSocialFornecedor || data.fornecedorAtivoRede || '';
                setForm({
                    idAtivoRede: data.codigoAtivoRede || '',
                    nomeAtivoRede: data.nomeAtivoRede || '',
                    idTipoAtivoRede: data.idTipoAtivoRede || data.tbTipoAtivoRede?.idTipoAtivoRede || '',
                    tipoAtivoRede: tipoRelacionado,
                    idFornecedorAtivoRede: data.idFornecedorAtivoRede || data.tbFornecedor?.idFornecedor || '',
                    fornecedorAtivoRede: fornecedorRelacionado,
                    fabricanteAtivoRede: data.fabricanteAtivoRede || '',
                    modeloAtivoRede: data.modeloAtivoRede || '',
                    serialAtivoRede: data.serialAtivoRede || '',
                    macAtivoRede: formatarMac(data.macAtivoRede || ''),
                    ipGerenciamentoAtivoRede: data.ipGerenciamentoAtivoRede || '',
                    hostnameAtivoRede: data.hostnameAtivoRede || '',
                    localInstalacaoAtivoRede: data.localInstalacaoAtivoRede || '',
                    rackAtivoRede: data.rackAtivoRede || '',
                    portaSwitchAtivoRede: data.portaSwitchAtivoRede || '',
                    fotoAtivoRede: data.fotoAtivoRede || '',
                    dataEntradaAtivoRede: data.dataEntradaAtivoRede ? new Date(data.dataEntradaAtivoRede).toISOString().split('T')[0] : '',
                    dataInstalacaoAtivoRede: data.dataInstalacaoAtivoRede ? new Date(data.dataInstalacaoAtivoRede).toISOString().split('T')[0] : '',
                    idStatusAtivoRede: data.idStatusAtivoRede || data.tbStatusAtivoRede?.idStatusAtivoRede || '',
                    statusAtivoRede: statusRelacionado,
                    idCCustoAtivoRede: data.idCCustoAtivoRede || data.tbCCusto?.idCCusto || '',
                    centroResponsavelAtivoRede: centroRelacionado,
                    observacaoAtivoRede: data.observacaoAtivoRede || '',
                });
                setHistoricoTransferencias(Array.isArray(data.tbTransferenciaAtivoRede) ? data.tbTransferenciaAtivoRede : []);
                setHistoricoDevolucoes(Array.isArray(data.tbDevolucaoAtivoRede) ? data.tbDevolucaoAtivoRede : []);
            } catch (error) {
                console.error('Erro ao carregar ativo de rede:', error);
            }
        };

        carregarAtivo();
    }, [ativoRedeId, setForm]);

    const handleCreateOption = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formOpcao.descricao.trim()) {
            notify('aviso', 'Informe a descrição para cadastrar.');
            return;
        }

        setSalvandoOpcao(true);
        try {
            const response = await fetch('/api/ativos-rede/opcoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    kind: formOpcao.kind,
                    descricao: formOpcao.descricao
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Erro ao cadastrar opção');
            }

            const created = await response.json();
            await carregarOpcoes();

            if (formOpcao.kind === 'TIPO') {
                setForm((prev) => ({
                    ...prev,
                    idTipoAtivoRede: created.idTipoAtivoRede || prev.idTipoAtivoRede,
                    tipoAtivoRede: created.descricaoTipoAtivoRede || prev.tipoAtivoRede
                }));
            } else {
                setForm((prev) => ({
                    ...prev,
                    idStatusAtivoRede: created.idStatusAtivoRede || prev.idStatusAtivoRede,
                    statusAtivoRede: created.descricaoStatusAtivoRede || prev.statusAtivoRede
                }));
            }

            notify('sucesso', 'Opção cadastrada com sucesso.');
            setFormOpcao({ kind: 'TIPO', descricao: '' });
            setModalOpcaoAberto(false);
        } catch (error) {
            console.error('Erro ao cadastrar opção:', error);
            notify('erro', error instanceof Error ? error.message : 'Erro ao cadastrar opção.');
        } finally {
            setSalvandoOpcao(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!form.idAtivoRede || !form.nomeAtivoRede || !form.idTipoAtivoRede || !form.idStatusAtivoRede || !form.idCCustoAtivoRede) {
            notify('aviso', 'Preencha ID, nome, tipo, status e centro de custo do ativo de rede.');
            setLoading(false);
            return;
        }

        if (form.dataInstalacaoAtivoRede && form.dataInstalacaoAtivoRede < form.dataEntradaAtivoRede) {
            notify('aviso', 'A data de instalacao nao pode ser menor que a data de entrada.');
            setLoading(false);
            return;
        }

        const ipValido = !form.ipGerenciamentoAtivoRede || /^(?:\d{1,3}\.){3}\d{1,3}$/.test(form.ipGerenciamentoAtivoRede.trim());
        if (!ipValido) {
            notify('aviso', 'Informe um IP de gerenciamento valido.');
            setLoading(false);
            return;
        }

        const tipoSelecionado = opçõesTipo.find((item) => item.idTipoAtivoRede === form.idTipoAtivoRede);
        const statusSelecionado = opçõesStatus.find((item) => item.idStatusAtivoRede === form.idStatusAtivoRede);
        const centroSelecionado = opçõesCentros.find((item) => item.idCCusto === form.idCCustoAtivoRede);

        try {
            const payload = {
                codigoAtivoRede: form.idAtivoRede.trim().toUpperCase(),
                nomeAtivoRede: form.nomeAtivoRede,
                idTipoAtivoRede: form.idTipoAtivoRede,
                tipoAtivoRede: tipoSelecionado?.descricaoTipoAtivoRede || form.tipoAtivoRede || null,
                idFornecedorAtivoRede: form.idFornecedorAtivoRede || null,
                fabricanteAtivoRede: form.fabricanteAtivoRede || null,
                modeloAtivoRede: form.modeloAtivoRede || null,
                serialAtivoRede: form.serialAtivoRede || null,
                macAtivoRede: form.macAtivoRede ? formatarMac(form.macAtivoRede) : null,
                ipGerenciamentoAtivoRede: form.ipGerenciamentoAtivoRede || null,
                hostnameAtivoRede: form.hostnameAtivoRede || null,
                localInstalacaoAtivoRede: form.localInstalacaoAtivoRede || null,
                rackAtivoRede: form.rackAtivoRede || null,
                portaSwitchAtivoRede: form.portaSwitchAtivoRede || null,
                fotoAtivoRede: form.fotoAtivoRede || null,
                dataEntradaAtivoRede: form.dataEntradaAtivoRede,
                dataInstalacaoAtivoRede: form.dataInstalacaoAtivoRede || null,
                idStatusAtivoRede: form.idStatusAtivoRede,
                statusAtivoRede: statusSelecionado?.descricaoStatusAtivoRede || form.statusAtivoRede || null,
                idCCustoAtivoRede: form.idCCustoAtivoRede,
                centroResponsavelAtivoRede: centroSelecionado ? formatarCentro(centroSelecionado) : form.centroResponsavelAtivoRede || null,
                observacaoAtivoRede: form.observacaoAtivoRede || null,
            };

            const response = await fetch(isEditing ? `/api/ativos-rede/${ativoRedeId}` : '/api/ativos-rede', {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.message || 'Erro ao salvar ativo de rede');
            }

            notify('sucesso', isEditing ? 'Ativo de rede atualizado com sucesso.' : 'Ativo de rede criado com sucesso.');
            if (!isEditing) clearDraft();
            router.push('/ativos-rede');
        } catch (error) {
            console.error('Erro ao preparar ativo de rede:', error);
            notify('erro', error instanceof Error ? error.message : 'Erro ao preparar ativo de rede.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AtivoRedeFormView
            ativoRedeId={ativoRedeId}
            isEditing={isEditing}
            canManageOptions={canManageOptions}
            canManageTransfer={canManageTransfer}
            canManageReturn={canManageReturn}
            loading={loading}
            loadingOpcoes={loadingOpcoes}
            salvandoOpcao={salvandoOpcao}
            historicoTransferencias={historicoTransferencias}
            historicoDevolucoes={historicoDevolucoes}
            opçõesTipo={opçõesTipo}
            opçõesStatus={opçõesStatus}
            opçõesCentros={opçõesCentros}
            opçõesFornecedores={opçõesFornecedores}
            form={form}
            formOpcao={formOpcao}
            modalOpcaoAberto={modalOpcaoAberto}
            handleEnterToNext={handleEnterToNext}
            handleChange={handleChange}
            handleFotoChange={handleFotoChange}
            handleFotoRemove={handleFotoRemove}
            handleSubmit={handleSubmit}
            handleCreateOption={handleCreateOption}
            setModalOpcaoAberto={setModalOpcaoAberto}
            setFormOpcao={setFormOpcao}
            onSelectTipo={(id) => {
                const selected = opçõesTipo.find((item) => item.idTipoAtivoRede === id);
                setForm((prev) => ({
                    ...prev,
                    idTipoAtivoRede: id,
                    tipoAtivoRede: selected?.descricaoTipoAtivoRede || ''
                }));
            }}
            onSelectFornecedor={(id) => {
                const selected = opçõesFornecedores.find((item) => item.idFornecedor === id);
                setForm((prev) => ({
                    ...prev,
                    idFornecedorAtivoRede: id,
                    fornecedorAtivoRede: selected
                        ? [selected.razaoSocialFornecedor, selected.nomeFantasiaFornecedor].filter(Boolean).join(' - ')
                        : ''
                }));
            }}
            onSelectStatus={(id) => {
                const selected = opçõesStatus.find((item) => item.idStatusAtivoRede === id);
                setForm((prev) => ({
                    ...prev,
                    idStatusAtivoRede: id,
                    statusAtivoRede: selected?.descricaoStatusAtivoRede || ''
                }));
            }}
            onSelectCentro={(id) => {
                const selected = opçõesCentros.find((item) => item.idCCusto === id);
                setForm((prev) => ({
                    ...prev,
                    idCCustoAtivoRede: id,
                    centroResponsavelAtivoRede: formatarCentro(selected)
                }));
            }}
            onCancel={() => {}}
        />
    );
}


