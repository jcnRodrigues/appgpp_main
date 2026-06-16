"use client";

import { notify as showNotify } from "@/lib/notify";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Undo2 } from "lucide-react";
import FormActions from "@/components/FormActions/FormActions";
import { useEnterToNext } from "@/hooks/useEnterToNext";
import PageHeader from "@/components/PageHeader/PageHeader";

type AtivoRedeResumo = {
  idAtivoRedePk: string;
  codigoAtivoRede: string;
  nomeAtivoRede: string;
  statusAtivoRede?: string | null;
  localInstalacaoAtivoRede?: string | null;
  centroResponsavelAtivoRede?: string | null;
};

export default function AtivoRedeDevolucaoForm({ ativoRedeId }: { ativoRedeId: string }) {
  const router = useRouter();
  const handleEnterToNext = useEnterToNext();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [ativo, setAtivo] = useState<AtivoRedeResumo | null>(null);
  const [form, setForm] = useState({
    dataInicioDevolucao: new Date().toISOString().split("T")[0],
    motivoDevolucao: "",
    destinoDevolucao: "",
    notaFiscalDevolucao: "",
    observacao: ""
  });

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
          destinoDevolucao: data.localInstalacaoAtivoRede || data.centroResponsavelAtivoRede || ""
        }));
      } finally {
        setLoadingData(false);
      }
    };

    carregar();
  }, [ativoRedeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/ativos-rede/${ativoRedeId}/devoluções`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao registrar devolução");
      }

      showNotify("sucesso", "Devolução registrada com sucesso.");
      router.push(`/ativos-rede/${ativoRedeId}`);
    } catch (error) {
      console.error(error);
      showNotify("erro", error instanceof Error ? error.message : "Erro ao registrar devolução");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <PageHeader
          icon={Undo2}
          title="Devolução de Ativo"
          backHref={`/ativos-rede/${ativoRedeId}`}
          description={ativo ? `${ativo.codigoAtivoRede} - ${ativo.nomeAtivoRede}` : undefined}
        />

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleEnterToNext}
          className="bg-white rounded-lg shadow-lg p-5 sm:p-8 space-y-6"
        >
          {loadingData ? (
            <p className="text-sm text-gray-500">Carregando dados do ativo...</p>
          ) : (
            <>
              <div className="border-b pb-6">
                  <div className="flex items-center gap-3 mb-4">
                  <Undo2 className="h-5 w-5 text-amber-600" />
                  <h2 className="text-h4 font-bold">Registrar Devolução</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data da devolução *</label>
                    <input
                      type="date"
                      name="dataInicioDevolucao"
                      value={form.dataInicioDevolucao}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Destino da devolução</label>
                    <input
                      type="text"
                      name="destinoDevolucao"
                      value={form.destinoDevolucao}
                      onChange={handleChange}
                      placeholder="Ex: ALMOXARIFADO / FORNECEDOR"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="mt-2 text-xs text-amber-700">
                      O centro de custo principal será vinculado automaticamente à Filial Paraupebas.
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">NF da devolução</label>
                    <input
                      type="text"
                      name="notaFiscalDevolucao"
                      value={form.notaFiscalDevolucao}
                      onChange={handleChange}
                      placeholder="Ex: NF-DEV-123"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Motivo da devolução</label>
                  <textarea
                    name="motivoDevolucao"
                    value={form.motivoDevolucao}
                    onChange={handleChange}
                    placeholder="Informe o motivo da devolução"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-2">Observação</label>
                  <textarea
                    name="observacao"
                    value={form.observacao}
                    onChange={handleChange}
                    placeholder="Informações complementares"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                  />
                </div>
              </div>

              <FormActions
                cancelHref={`/ativos-rede/${ativoRedeId}`}
                submitLabel="Registrar Devolução"
                loadingLabel="Registrando..."
                loading={loading}
                className="flex gap-4 justify-end pt-2"
                cancelClassName="border-slate-300 bg-slate-950 text-slate-100 hover:bg-slate-900 hover:text-white shadow-sm"
                submitClassName="bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}

