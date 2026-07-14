"use client";

import { notify as showNotify } from "@/lib/notify";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, ChevronLeft, Undo2 } from "lucide-react";
import FormActions from "@/components/FormActions/FormActions";

type ModoAtalho = "transferencia" | "devolucao";

type Props = {
  modo: ModoAtalho;
};

export default function AtivoRedeAtalhoForm({ modo }: Props) {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);

  const titulo = modo === "transferencia" ? "Transferir Ativo de Rede" : "Registrar Devolução de Ativo de Rede";
  const descricao = modo === "transferencia"
    ? "Digite o código do ativo para abrir a tela de transferência."
    : "Digite o código do ativo para abrir a tela de devolução.";
  const Icone = modo === "transferencia" ? ArrowRightLeft : Undo2;
  const rotaDestino = modo === "transferencia" ? "transferencia" : "devolucao";

  const buscarAtivo = async (event: FormEvent) => {
    event.preventDefault();
    const codigoLimpo = codigo.trim().toUpperCase();
    if (!codigoLimpo) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/ativos-rede?codigo=${encodeURIComponent(codigoLimpo)}&take=1`);
      if (!response.ok) {
        throw new Error("Não foi possível localizar o ativo de rede");
      }

      const data = await response.json();
      const ativo = Array.isArray(data?.data) ? data.data[0] : null;
      if (!ativo?.idAtivoRedePk) {
        showNotify("aviso", "Nenhum ativo encontrado com esse código.");
        return;
      }

      router.push(`/ativos-rede/${ativo.idAtivoRedePk}/${rotaDestino}`);
    } catch (error) {
      showNotify("erro", error instanceof Error ? error.message : "Erro ao localizar ativo de rede");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="form-title-sticky flex items-center gap-4 mb-6 rounded-2xl border border-border/60 bg-[#10191b] px-4 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.22)] sm:px-5">
          <Link href="/ativos-rede">
            <ChevronLeft className="h-5 w-5 text-slate-100" />
          </Link>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md ${
                modo === "transferencia" ? "bg-blue-600" : "bg-amber-600"
              }`}
            >
              <Icone className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-h2 font-bold">{titulo}</h1>
              <p className="text-sm text-gray-600 mt-1">{descricao}</p>
            </div>
          </div>
        </div>

        <form onSubmit={buscarAtivo} className="form-surface space-y-6 p-4 sm:p-6 lg:p-8">
          <div>
            <label className="block text-sm font-medium mb-2">Código do ativo</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: 39018"
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <p className="mt-2 text-xs text-gray-500">
              Digite o código e pressione Enter ou clique em continuar.
            </p>
          </div>

          <FormActions
            cancelHref="/ativos-rede"
            submitLabel="Continuar"
            loadingLabel="Localizando..."
            loading={loading}
            className="flex justify-end gap-3"
            cancelClassName="border-red-500 bg-red-600 text-white hover:bg-red-500 shadow-sm"
            submitClassName={modo === "transferencia" ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : "bg-amber-600 text-white hover:bg-amber-700 shadow-sm"}
          />
        </form>
      </div>
    </div>
  );
}
