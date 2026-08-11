"use client";

import { notify as showNotify } from "@/lib/notify";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Building2, CheckSquare, Pencil, Plus } from "lucide-react";
import FormActions from "@/components/FormActions/FormActions";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useEnterToNext } from "@/hooks/useEnterToNext";

type CentroCustoResumo = {
  idCCusto: string;
  codigoCCusto?: string | null;
  descricaoCCusto?: string | null;
  tbEmpresa?: {
    fantasiaEmpresa?: string | null;
    razaoEmpresa?: string | null;
  } | null;
};

type FornecedorCentro = {
  idFornecedorCCusto: string;
  idCCusto: string;
  ehPrincipal?: boolean | null;
  tbCCusto?: CentroCustoResumo | null;
};

type FornecedorResumo = {
  idFornecedor: string;
  razaoSocialFornecedor: string;
  nomeFantasiaFornecedor?: string | null;
  cnpjFornecedor?: string | null;
  tbFornecedorCCusto?: FornecedorCentro[];
};

type Props = {
  fornecedorId?: string;
};

export default function FornecedorForm({ fornecedorId }: Props) {
  const router = useRouter();
  const handleEnterToNext = useEnterToNext();
  const isEditing = Boolean(fornecedorId);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [centros, setCentros] = useState<CentroCustoResumo[]>([]);
  const [fornecedor, setFornecedor] = useState<FornecedorResumo | null>(null);
  const [centrosSelecionados, setCentrosSelecionados] = useState<string[]>([]);
  const [centroPrincipalId, setCentroPrincipalId] = useState("");

  const initialForm = useMemo(() => ({
    razaoSocialFornecedor: "",
    nomeFantasiaFornecedor: "",
    cnpjFornecedor: ""
  }), []);

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    const carregar = async () => {
      setLoadingData(true);
      try {
        const [opcoesResponse, fornecedorResponse] = await Promise.all([
          fetch("/api/fornecedores/opcoes"),
          isEditing ? fetch(`/api/fornecedores/${fornecedorId}`) : Promise.resolve(null)
        ]);

        if (opcoesResponse.ok) {
          const opcoes = await opcoesResponse.json();
          setCentros(Array.isArray(opcoes?.centros) ? opcoes.centros : []);
        }

        if (fornecedorResponse && fornecedorResponse.ok) {
          const data = await fornecedorResponse.json();
          setFornecedor(data);
          setForm({
            razaoSocialFornecedor: data.razaoSocialFornecedor || "",
            nomeFantasiaFornecedor: data.nomeFantasiaFornecedor || "",
            cnpjFornecedor: data.cnpjFornecedor || ""
          });
          const vinculados = Array.isArray(data.tbFornecedorCCusto) ? data.tbFornecedorCCusto : [];
          const selecionados = vinculados.map((item: FornecedorCentro) => item.idCCusto);
          setCentrosSelecionados(selecionados);
          setCentroPrincipalId(vinculados.find((item: FornecedorCentro) => item.ehPrincipal)?.idCCusto || selecionados[0] || "");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingData(false);
      }
    };

    carregar();
  }, [fornecedorId, isEditing]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nextValue = name === "cnpjFornecedor" ? value.replace(/\D/g, "").slice(0, 14) : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleToggleCentro = (idCCusto: string) => {
    setCentrosSelecionados((prev) => {
      const exists = prev.includes(idCCusto);
      if (exists) {
        const next = prev.filter((item) => item !== idCCusto);
        setCentroPrincipalId((current) => (current === idCCusto ? (next[0] || "") : current));
        return next;
      }

      const next = [...prev, idCCusto];
      setCentroPrincipalId((current) => current || idCCusto);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        razaoSocialFornecedor: form.razaoSocialFornecedor,
        nomeFantasiaFornecedor: form.nomeFantasiaFornecedor,
        cnpjFornecedor: form.cnpjFornecedor,
        centros: centrosSelecionados.map((idCCusto) => ({
          idCCusto,
          ehPrincipal: idCCusto === centroPrincipalId
        }))
      };

      const response = await fetch(isEditing ? `/api/fornecedores/${fornecedorId}` : "/api/fornecedores", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Erro ao salvar fornecedor");
      }

      showNotify("sucesso", `Fornecedor ${isEditing ? "atualizado" : "criado"} com sucesso.`);
      router.push("/fornecedores");
    } catch (error) {
      console.error(error);
      showNotify("erro", error instanceof Error ? error.message : "Erro ao salvar fornecedor");
    } finally {
      setLoading(false);
    }
  };

  const formatarCentro = (centro: CentroCustoResumo) => {
    const empresa = centro.tbEmpresa?.fantasiaEmpresa || centro.tbEmpresa?.razaoEmpresa || "";
    const centroLabel = [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(" - ");
    return [centroLabel, empresa ? `(${empresa})` : ""].filter(Boolean).join(" ");
  };

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <PageHeader
          icon={isEditing ? Pencil : Plus}
          title={isEditing ? "Editar Fornecedor" : "Cadastrar Fornecedor"}
          description="Cadastre fornecedores e vincule um ou mais centros de custo."
          backHref="/fornecedores"
          iconClassName="from-slate-950 via-slate-800 to-emerald-700"
        />

        <form onSubmit={handleSubmit} onKeyDown={handleEnterToNext} className="form-surface space-y-6 p-4 sm:p-6 lg:p-8">
          {loadingData ? (
            <p className="text-sm text-muted-foreground">Carregando dados do fornecedor...</p>
          ) : (
            <>
              <section className="border-b border-border/60 pb-6">
                <div className="mb-4 flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-h4 font-bold">Dados do Fornecedor</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">Razão social *</label>
                    <input
                      type="text"
                      name="razaoSocialFornecedor"
                      value={form.razaoSocialFornecedor}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Nome fantasia</label>
                    <input
                      type="text"
                      name="nomeFantasiaFornecedor"
                      value={form.nomeFantasiaFornecedor}
                      onChange={handleChange}
                      className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">CNPJ</label>
                    <input
                      type="text"
                      name="cnpjFornecedor"
                      value={form.cnpjFornecedor}
                      onChange={handleChange}
                      placeholder="Somente números"
                      maxLength={14}
                      className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <CheckSquare className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-h4 font-bold">Vínculo com Centro de Custo</h2>
                </div>

                {centros.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum centro de custo disponível para vínculo.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {centros.map((centro) => {
                      const checked = centrosSelecionados.includes(centro.idCCusto);
                      const principal = centroPrincipalId === centro.idCCusto;

                      return (
                        <label
                          key={centro.idCCusto}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                            checked ? "border-emerald-400 bg-emerald-50/60" : "border-border/60 bg-background"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => handleToggleCentro(centro.idCCusto)}
                            className="mt-1 h-4 w-4 rounded border-border"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{formatarCentro(centro) || centro.idCCusto}</span>
                              {principal ? (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                                  Principal
                                </span>
                              ) : null}
                            </div>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <input
                                type="radio"
                                name="centroPrincipal"
                                checked={principal}
                                onChange={() => {
                                  if (!checked) {
                                    setCentrosSelecionados((prev) => [...prev, centro.idCCusto]);
                                  }
                                  setCentroPrincipalId(centro.idCCusto);
                                }}
                              />
                              <span>Marcar como principal</span>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>

              {fornecedor?.tbFornecedorCCusto?.length ? (
                <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
                  <h2 className="mb-3 text-h4 font-bold">Vínculos atuais</h2>
                  <div className="space-y-2">
                    {fornecedor.tbFornecedorCCusto.map((link) => (
                      <div key={link.idFornecedorCCusto} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2 text-sm">
                        <span>{formatarCentro(link.tbCCusto || { idCCusto: link.idCCusto })}</span>
                        {link.ehPrincipal ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                            Principal
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}

              <FormActions
                cancelHref="/fornecedores"
                submitLabel={isEditing ? "Atualizar" : "Criar"}
                loadingLabel="Salvando..."
                loading={loading}
              />
            </>
          )}
        </form>
      </div>
    </div>
  );
}
