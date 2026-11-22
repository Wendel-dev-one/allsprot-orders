import type { Client } from "../../types/client";
import { useState, type FormEvent } from "react";

interface ClientFormProps {
  initialData?: Client | null;
  onSubmit: (clientData: Omit<Client, "id">) => void | Promise<void>;
  onCancel: () => void;
}

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
}: ClientFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const getName = formData.get("name") as string;
    const getContact = formData.get("contact") as string;
    const getResponsible = formData.get("responsible") as string;
    const getAddress = formData.get("address") as string;

    const clientData: Omit<Client, "id"> = {
      name: getName,
      contact: getContact,
      responsible: getResponsible,
      address: getAddress,
    };

    setIsSaving(true);
    try {
      await onSubmit(clientData);
      form.reset();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          {initialData ? "Editar Cliente" : "Novo Cliente"}
        </h2>
        <p className="text-sm text-slate-500">
          Preencha as informações abaixo para registrar ou atualizar o cadastro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Campo: Nome */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-slate-700">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Nome da empresa ou cliente"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.name}
          />
        </div>

        {/* Campo: Contato */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact"
            className="text-sm font-medium text-slate-700"
          >
            Contato
          </label>
          <input
            id="contact"
            name="contact"
            type="text"
            placeholder="(00) 00000-0000 ou e-mail"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.contact}
          />
        </div>

        {/* Campo: Responsável */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="responsible"
            className="text-sm font-medium text-slate-700"
          >
            Responsável
          </label>
          <input
            id="responsible"
            name="responsible"
            type="text"
            placeholder="Nome do responsável"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.responsible}
          />
        </div>

        {/* Campo: Endereço */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="address"
            className="text-sm font-medium text-slate-700"
          >
            Endereço
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Rua, número, bairro, cidade"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.address}
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors cursor-pointer"
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Salvando..."
            : initialData
              ? "Salvar alterações"
              : "Cadastrar cliente"}
        </button>
      </div>
    </form>
  );
}
