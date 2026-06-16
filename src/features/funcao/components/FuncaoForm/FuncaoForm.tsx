"use client";

import { notify as showNotify } from "@/lib/notify";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useEnterToNext } from "@/hooks/useEnterToNext";
import FormActions from "@/components/FormActions/FormActions";
import { useFormDraft } from "@/hooks/useFormDraft";
import PageHeader from "@/components/PageHeader/PageHeader";
import { UserSearch } from "lucide-react";

export default function FuncaoForm({ funcaoId }: { funcaoId?: string }) {
  const router = useRouter();
  const handleEnterToNext = useEnterToNext();
  const [loading, setLoading] = useState(false);
  const initialFuncao = useMemo(() => ({ nomeFuncao: "" }), []);
  const {
    state: função,
    setState: setFuncao,
    clearDraft: clearFuncaoDraft
  } = useFormDraft("função-form-create", initialFuncao, { enabled: !funcaoId });

  useEffect(() => {
    if (funcaoId) {
      const carregar = async () => {
        try {
          const r = await fetch(`/api/funcao/${funcaoId}`);
          if (r.ok) {
            const data = await r.json();
            setFuncao({
              nomeFuncao: data.nomeFuncao || ""
            });
          }
        } catch (e) {
          console.error(e);
        }
      };
      carregar();
    }
  }, [funcaoId, setFuncao]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    const fieldsToUppercase = ["nomeFuncao"];
    const newValue = fieldsToUppercase.includes(name) ? value.toUpperCase() : value;

    setFuncao((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nomeFuncao: função.nomeFuncao
      };

      let res;
      if (funcaoId) {
        res = await fetch(`/api/funcao/${funcaoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch("/api/funcao", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        const mensagemSucesso = funcaoId
          ? "Função atualizada com sucesso"
          : "Função criada com sucesso";
        showNotify("sucesso", mensagemSucesso);
        if (!funcaoId) clearFuncaoDraft();
        router.push("/funcoes");
      } else {
        const err = await res.json();
        showNotify("erro", err.message || "Erro");
      }
    } catch (error) {
      console.error(error);
      showNotify("erro", "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen py-6">
      <div className="max-w-2xl mx-auto px-4">
        <PageHeader
          icon={UserSearch}
          title={funcaoId ? "Editar Função" : "Cadastrar Função"}
          backHref="/funcoes"
        />

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleEnterToNext}
          className="bg-white rounded-lg shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Nome da Função *
            </label>
            <input
              type="text"
              name="nomeFuncao"
              value={função.nomeFuncao}
              onChange={handleChange}
              required
              placeholder="Ex: Gerente, Desenvolvedor, Analista..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <FormActions
            cancelHref="/funcoes"
            submitLabel={funcaoId ? "Atualizar" : "Criar"}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
}


