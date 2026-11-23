import { Package, Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../types/product";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Package size={21} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Produtos cadastrados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie os produtos registrados no sistema.
            </p>
          </div>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {products.length} {products.length === 1 ? "produto" : "produtos"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <caption className="sr-only">Lista de produtos cadastrados</caption>
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">
                Código
              </th>
              <th scope="col" className="px-6 py-4">
                Descrição
              </th>
              <th scope="col" className="px-6 py-4">
                Unidades/pacote
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {product.code}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {product.description}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {product.unitsPerPackage}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        product.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {product.active ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => onEdit(product)}
                        type="button"
                        aria-label={`Editar ${product.description}`}
                        title="Editar produto"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 cursor-pointer"
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        type="button"
                        aria-label={`Excluir ${product.description}`}
                        title="Excluir produto"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-2 text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 cursor-pointer"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-sm text-slate-500"
                >
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
