"use client";

import { notify as showNotify } from "@/lib/notify";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft } from "lucide-react";
import FormActions from "@/components/FormActions/FormActions";
import { useEnterToNext } from "@/hooks/useEnterToNext";
import PageHeader from "@/components/PageHeader/PageHeader";

type AtivoRedeResumo = {
  idAtivoRedePk: string;
  codigoAtivoRede: string;
  nomeAtivoRede: string;
  localInstalacaoAtivoRede?: string | null;
  centroResponsavelAtivoRede?: string | null;
  idCCustoAtivoRede?: string | null;
  tbCCusto?: {
    idCCusto: string;
    codigoCCusto?: string | null;
    descricaoCCusto?: string | null;
  } | null;
};

type CentroCusto = {
  idCCusto: string;
  codigoCCusto?: string | null;
  descricaoCCusto?: string | null;
};

type StatusAtivoRede = {
  descricaoStatusAtivoRede: string;
};

export default function AtivoRedeTransferenciaForm({ ativoRedeId }: { ativoRedeId: string }) {
  const router = useRouter();
  const handleEnterToNext = useEnterToNext();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingOpcoes, setLoadingOpcoes] = useState(true);
  const [ativo, setAtivo] = useState<AtivoRedeResumo | null>(null);
  const [centros, setCentros] = useState<CentroCusto[]>([]);
  const [statusTransferencia, setStatusTransferencia] = useState<StatusAtivoRede[]>([]);
  const [form, setForm] = useState({
    localDestinoAtivoRede: "",
    idCCustoDestinoAtivoRede: "",
    statusNovoAtivoRede: "TRANSFERIDO",
    observacao: ""
  });

  const getCentroLabel = (centro?: CentroCusto | null) => {
    if (!centro) return "";
    return [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(" - ") || "";
  };

  useEffect(() => {
    const carregarOpcoes = async () => {
      setLoadingOpcoes(true);
      try {
        const response = await fetch("/api/ativos-rede/opcoes");
        if (!response.ok) return;
        const data = await response.json();
        setCentros(Array.isArray(data.centros) ? data.centros : []);
        setStatusTransferencia(Array.isArray(data.status) ? data.status : []);
      } finally {
        setLoadingOpcoes(false);
      }
    };

    carregarOpcoes();
  }, []);

  useEffect(() => {
    const carregar = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(`/api/ativos-rede/${ativoRedeId}`);
        if (!response.ok) return;
        const data = await response.json();
        setAtivo(data);
        setForm((prev) => ({
          ...prev,
          localDestinoAtivoRede: data.localInstalacaoAtivoRede || "",
          idCCustoDestinoAtivoRede: data.idCCustoAtivoRede || data.tbCCusto?.idCCusto || "",
        }));
      } finally {
        setLoadingData(false);
      }
    };

    carregar();
  }, [ativoRedeId]);

  const statusOptions = useMemo(
    () => statusTransferencia.map((item) => item.descricaoStatusAtivoRede),
    [statusTransferencia]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/ativos-rede/${ativoRedeId}/transferências`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao transferir ativo de rede");
      }

      showNotify("sucesso", "Transferência registrada com sucesso.");
      router.push(`/ativos-rede/${ativoRedeId}`);
    } catch (error) {
      console.error(error);
      showNotify("erro", error instanceof Error ? error.message : "Erro ao transferir ativo de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageHeader
          icon={ArrowRightLeft}
          title="Transferência de Ativo"
          backHref={`/ativos-rede/${ativoRedeId}`}
          description={ativo ? `${ativo.codigoAtivoRede} - ${ativo.nomeAtivoRede}` : undefined}
        />

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleEnterToNext}
          className="bg-white rounded-lg shadow-lg p-5 sm:p-8 space-y-6"
        >
          {loadingData || loadingOpcoes ? (
            <p className="text-sm text-gray-500">Carregando dados do ativo...</p>
          ) : (
            <>
              <div className="border-b pb-6">
                <div className="flex items-center gap-3 mb-4">
                  <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                  <h2 className="text-h4 font-bold">Nova Transferência</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Local de Destino</label>
                    <input
                      type="text"
                      name="localDestinoAtivoRede"
                      value={form.localDestinoAtivoRede}
                      onChange={handleChange}
                      placeholder="Ex: RACK 03 - MATRIZ"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Centro de Custo Destino</label>
                    <select
                      name="idCCustoDestinoAtivoRede"
                      value={form.idCCustoDestinoAtivoRede}
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        setForm((prev) => ({ ...prev, idCCustoDestinoAtivoRede: selectedId }));
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">--- Selecione um centro ---</option>
                      {centros.map((centro) => (
                        <option key={centro.idCCusto} value={centro.idCCusto}>
                          {getCentroLabel(centro)}
                        </option>
                      ))}
                    </select>
                    {ativo?.tbCCusto && (
                      <p className="mt-2 text-xs text-gray-500">
                        Atual: {getCentroLabel(ativo.tbCCusto)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Status após transferência</label>
                    <select
                      name="statusNovoAtivoRede"
                      value={form.statusNovoAtivoRede}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {statusOptions.includes("TRANSFERIDO") ? null : <option value="TRANSFERIDO">TRANSFERIDO</option>}
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Observação</label>
                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={handleChange}
                    placeholder="Informe o motivo ou detalhes da transferência"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                  />
                </div>
              </div>

              <FormActions
                cancelHref={`/ativos-rede/${ativoRedeId}`}
                submitLabel="Registrar Transferência"
                loadingLabel="Transferindo..."
                loading={loading}
                className="flex gap-4 justify-end pt-2"
                cancelClassName="border-slate-300 bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-white shadow-sm"
                submitClassName="bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}

