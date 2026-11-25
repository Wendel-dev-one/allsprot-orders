import type { ClientPrice } from "../../types/client-price";
import { useState, type FormEvent } from "react";
import { parseCurrency } from "../../utils/parseCurrency";

type ClientPriceFormProps = {
  initialData: ClientPrice | null;
  clientId: string;
  productId: string;
  onSubmit: (priceData: Omit<ClientPrice, "id">) => void | Promise<void>;
  onCancel: () => void;
};

export function ClientPriceForm({
  initialData,
  clientId,
  productId,
  onSubmit,
  onCancel,
}: ClientPriceFormProps) {
  const [unitPrice, setUnitPrice] = useState(
    initialData ? (initialData.unitPriceInCents / 100).toFixed(2) : "",
  );
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const unitPriceInCents = parseCurrency(unitPrice);

    if (unitPriceInCents === null || unitPriceInCents <= 0) {
      alert("Informe um preço maior que zero.");
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({ clientId, productId, unitPriceInCents });
    } catch (error) {
      console.error("Erro ao salvar preço do cliente:", error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          {initialData ? "Editar preço" : "Cadastrar preço"}
        </h2>
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <label
          htmlFor="unitPrice"
          className="text-sm font-medium text-slate-700"
        >
          Preço unitário (R$)
        </label>
        <input
          id="unitPrice"
          name="unitPrice"
          type="text"
          inputMode="decimal"
          required
          value={unitPrice}
          onChange={(event) => setUnitPrice(event.target.value)}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          onClick={onCancel}
          type="button"
          className="w-full cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 sm:w-auto"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="w-full cursor-pointer rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {isSaving
            ? "Salvando..."
            : initialData
              ? "Salvar alterações"
              : "Cadastrar preço"}
        </button>
      </div>
    </form>
  );
}