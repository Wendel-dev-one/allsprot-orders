import { useState, type FormEvent } from "react";
import type { Product } from "../../types/product";
import { getProducts } from "../../services/productService";

interface ProductFormProps {
  initialData?: Product | null;
  onSubmit: (productData: Omit<Product, "id">) => void | Promise<void>;
  onCancel: () => void;
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(event.currentTarget);
    const getCode = formData.get("code");
    const code = Number(getCode);
    const getDescription = (formData.get("description") as string).trim();
    const getUnitsPerPackage = formData.get("unitsPerPackage");
    const unitsPerPackage = Number(getUnitsPerPackage);
    const getStatus = formData.get("status");
    const active = getStatus === "true";

    const products = getProducts();

    const codeAlreadyExists = products.some(
      (product) => product.code === code && product.id !== initialData?.id,
    );

    if (
      !Number.isInteger(code) ||
      code < 1 ||
      !Number.isInteger(unitsPerPackage) ||
      unitsPerPackage < 1 ||
      !getDescription
    ) {
      alert("Verifique os campos. Informe valores válidos.");
      return;
    }

    if (codeAlreadyExists) {
      alert("Já existe um produto cadastrado com esse código.");
      return;
    }

    const productData: Omit<Product, "id"> = {
      code,
      description: getDescription,
      unitsPerPackage,
      active,
    };

    setIsSaving(true);
    try {
      await onSubmit(productData);
      form.reset();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">{initialData ? "Editar Produto" : "Novo Produto"}</h2>
        <p className="text-sm text-slate-500">
          {initialData ? "Preencha as informações abaixo para atualizar um produto." : "Preencha as informações abaixo para cadastrar um novo produto."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-sm font-medium text-slate-700">
            Código
          </label>
          <input
            id="code"
            name="code"
            type="number"
            min={1}
            step={1}
            required
            placeholder="Código do produto"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.code}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Descrição
          </label>
          <input
            id="description"
            name="description"
            type="text"
            required
            maxLength={150}
            placeholder="Descrição do produto"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.description}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="unitsPerPackage"
            className="text-sm font-medium text-slate-700"
          >
            Unidades por pacote
          </label>
          <input
            id="unitsPerPackage"
            name="unitsPerPackage"
            type="number"
            required
            step={1}
            min={1}
            placeholder="Quantidade de unidades"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={initialData?.unitsPerPackage}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="status"
            className="text-sm font-medium text-slate-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            className="px-3 py-2 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            defaultValue={String(initialData?.active ?? true)}
          >
            <option value="true">Ativo</option>
            <option value="false">Inativo</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          onClick={onCancel}
          type="button"
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
          disabled={isSaving}
        >
          {isSaving
            ? "Salvando..."
            : initialData
              ? "Salvar alterações"
              : "Cadastrar produto"}
        </button>
      </div>
    </form>
  );
}
