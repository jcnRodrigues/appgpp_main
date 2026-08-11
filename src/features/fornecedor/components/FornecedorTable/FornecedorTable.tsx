"use client";

import { useCallback, useEffect, useState, type MouseEvent } from "react";
import { Edit, Inbox, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import DeleteGuardButton from "@/components/DeleteGuardButton/DeleteGuardButton";
import { hasModuleActionPermission } from "@/lib/permissions";
import TableState from "@/components/TableState/TableState";
import { notify as showNotify } from "@/lib/notify";

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
  ehPrincipal?: boolean | null;
  idCCusto: string;
  tbCCusto?: CentroCustoResumo | null;
};

type Fornecedor = {
  idFornecedor: string;
  razaoSocialFornecedor: string;
  nomeFantasiaFornecedor?: string | null;
  cnpjFornecedor?: string | null;
  createdAt?: string | Date;
  tbFornecedorCCusto?: FornecedorCentro[];
};

function formatarCentro(centro?: CentroCustoResumo | null) {
  if (!centro) return "-";
  const empresa = centro.tbEmpresa?.fantasiaEmpresa || centro.tbEmpresa?.razaoEmpresa || "";
  const centroLabel = [centro.codigoCCusto, centro.descricaoCCusto].filter(Boolean).join(" - ");
  return [centroLabel, empresa ? `(${empresa})` : ""].filter(Boolean).join(" ");
}

type Props = {
  centroId?: string;
};

export default function FornecedorTable({ centroId = "" }: Props) {
  const { data: session } = useSession();
  const formularios = ((session?.user as any)?.formularios || []) as string[];
  const canUpdate = hasModuleActionPermission(formularios, "FORNECEDORES", "UPDATE");
  const showNoPermissionAlert = (acao: string) => showNotify("aviso", `Você não tem permissão para ${acao}.`);

  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [totalItens, setTotalItens] = useState(0);

  const carregarFornecedores = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("skip", String((paginaAtual - 1) * itensPorPagina));
      params.append("take", String(itensPorPagina));
      if (centroId) params.append("centroId", centroId);

      const response = await fetch(`/api/fornecedores?${params.toString()}`);
      if (!response.ok) return;
      const data = await response.json();
      setFornecedores(Array.isArray(data?.data) ? data.data : []);
      setTotalItens(typeof data?.total === "number" ? data.total : (Array.isArray(data?.data) ? data.data.length : 0));
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error);
    } finally {
      setLoading(false);
    }
  }, [centroId, itensPorPagina, paginaAtual]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarFornecedores();
  }, [carregarFornecedores]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPaginaAtual(1);
  }, [itensPorPagina, centroId]);

  const handleEditClick = (e: MouseEvent) => {
    if (canUpdate) return;
    e.preventDefault();
    showNoPermissionAlert("alterar registros");
  };

  const handleDelete = async (id: string, descricao: string) => {
    const confirmou = window.confirm(`Deletar "${descricao}"?`);
    if (!confirmou) return;

    try {
      const response = await fetch(`/api/fornecedores/${id}`, { method: "DELETE" });
      if (response.ok) {
        await carregarFornecedores();
      } else {
        showNotify("erro", "Erro ao deletar fornecedor");
      }
    } catch {
      showNotify("erro", "Erro ao deletar fornecedor");
    }
  };

  const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const paginasVisiveis = totalPaginas <= 7
    ? Array.from({ length: totalPaginas }, (_, index) => index + 1)
    : Array.from(new Set([1, totalPaginas, paginaAtual, paginaAtual - 1, paginaAtual + 1, paginaAtual - 2, paginaAtual + 2]))
        .filter((p) => p >= 1 && p <= totalPaginas)
        .sort((a, b) => a - b);

  const irParaPagina = (pagina: number) => {
    const paginaValida = Math.min(Math.max(pagina, 1), totalPaginas);
    setPaginaAtual(paginaValida);
  };

  return (
    <div className="table-surface space-y-4">
      <div className="md:hidden space-y-3">
        {loading ? (
          <TableState icon={Inbox} title="Carregando fornecedores" compact />
        ) : fornecedores.length === 0 ? (
          <TableState icon={Inbox} title="Nenhum fornecedor cadastrado" description="Adicione o primeiro fornecedor para vincular centros de custo." compact />
        ) : (
          fornecedores.map((fornecedor) => (
            <div key={fornecedor.idFornecedor} className="space-y-3 rounded-2xl border border-border/60 bg-[#10191b] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)]">
              <div>
                <div className="text-sm font-semibold text-slate-100">{fornecedor.razaoSocialFornecedor}</div>
                <div className="text-xs text-slate-300">{fornecedor.nomeFantasiaFornecedor || "-"}</div>
                <div className="mt-1 text-xs text-slate-400">CNPJ: {fornecedor.cnpjFornecedor || "-"}</div>
              </div>
              <div className="space-y-2 text-sm">
                {fornecedor.tbFornecedorCCusto?.length ? (
                  fornecedor.tbFornecedorCCusto.map((link) => (
                    <div key={link.idFornecedorCCusto} className="rounded-lg border border-border/60 bg-black/10 p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span>{formatarCentro(link.tbCCusto)}</span>
                        {link.ehPrincipal ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">Principal</span>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-300">Sem vínculo com centro de custo.</p>
                )}
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <Button asChild variant="ghost" size="icon" className="rounded-lg p-2 text-blue-400 transition hover:bg-blue-100 hover:text-blue-600">
                  <Link href={`/fornecedores/${fornecedor.idFornecedor}`} title="Editar" onClick={handleEditClick}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteGuardButton
                  resource="fornecedor"
                  module="FORNECEDORES"
                  recordId={fornecedor.idFornecedor}
                  onAuthorizedDelete={() => handleDelete(fornecedor.idFornecedor, fornecedor.razaoSocialFornecedor)}
                  className="rounded-lg p-2 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                  title="Excluir"
                  unauthorizedBehavior="alert"
                >
                  <Trash2 className="h-4 w-4" />
                </DeleteGuardButton>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border/60 bg-[#10191b] shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="border-b border-border/60 bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Razão Social</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nome Fantasia</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">CNPJ</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Centros vinculados</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4">
                    <TableState icon={Inbox} title="Carregando fornecedores" compact />
                  </td>
                </tr>
              ) : fornecedores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4">
                    <TableState icon={Inbox} title="Nenhum fornecedor cadastrado" description="Cadastre um fornecedor para iniciar os vínculos." compact />
                  </td>
                </tr>
              ) : (
                fornecedores.map((fornecedor) => (
                  <tr key={fornecedor.idFornecedor} className="border-b border-border/60 hover:bg-white/5">
                    <td className="px-6 py-4 text-sm text-slate-100">{fornecedor.razaoSocialFornecedor}</td>
                    <td className="px-6 py-4 text-sm text-slate-100">{fornecedor.nomeFantasiaFornecedor || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-100">{fornecedor.cnpjFornecedor || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-100">
                      <div className="flex flex-col gap-1">
                        {fornecedor.tbFornecedorCCusto?.length ? fornecedor.tbFornecedorCCusto.map((link) => (
                          <span key={link.idFornecedorCCusto} className="inline-flex items-center gap-2">
                            <span>{formatarCentro(link.tbCCusto)}</span>
                            {link.ehPrincipal ? (
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">Principal</span>
                            ) : null}
                          </span>
                        )) : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <Button asChild variant="ghost" size="icon" className="rounded-lg p-2 text-blue-400 transition hover:bg-blue-100 hover:text-blue-600">
                          <Link href={`/fornecedores/${fornecedor.idFornecedor}`} title="Editar" onClick={handleEditClick}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <DeleteGuardButton
                          resource="fornecedor"
                          module="FORNECEDORES"
                          recordId={fornecedor.idFornecedor}
                          onAuthorizedDelete={() => handleDelete(fornecedor.idFornecedor, fornecedor.razaoSocialFornecedor)}
                          className="rounded-lg p-2 text-red-400 transition hover:bg-red-100 hover:text-red-600"
                          title="Excluir"
                          unauthorizedBehavior="alert"
                        >
                          <Trash2 className="h-4 w-4" />
                        </DeleteGuardButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <label htmlFor="itensPorPagina" className="text-xs text-muted-foreground">Itens por página:</label>
          <select
            id="itensPorPagina"
            value={itensPorPagina}
            onChange={(e) => setItensPorPagina(Number(e.target.value))}
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <Button type="button" variant="outline" size="sm" onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1 || totalItens === 0}>
            Anterior
          </Button>
          {paginasVisiveis.map((pagina) => (
            <button
              key={pagina}
              type="button"
              onClick={() => irParaPagina(pagina)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                pagina === paginaAtual
                  ? "border border-emerald-400 bg-emerald-100 text-emerald-700"
                  : "border border-border bg-card text-foreground hover:bg-secondary"
              }`}
            >
              {pagina}
            </button>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={() => irParaPagina(paginaAtual + 1)} disabled={paginaAtual === totalPaginas || totalItens === 0}>
            Próxima
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Exibindo {totalItens === 0 ? 0 : inicio + 1} - {Math.min(inicio + fornecedores.length, totalItens)} de {totalItens}
        </div>
      </div>
    </div>
  );
}
