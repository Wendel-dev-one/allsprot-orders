import type { ClientPrice } from "../../types/client-price";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";
import { Pencil, Plus, Trash2 } from "lucide-react";

export type ClientPriceListProps = {
  productsWithPrices: {
    product: Product;
    clientPrice: ClientPrice | undefined;
  }[];
  onCreate: (productId: string) => void;
  onEdit: (clientPrice: ClientPrice) => void;
  onDelete: (clientPrice: ClientPrice) => void;
  clientName: string;
};

export function ClientPriceList({
  productsWithPrices,
  onCreate,
  onEdit,
  onDelete,
  clientName,
}: ClientPriceListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Preços de {clientName}
        </h2>
        <p className="text-sm text-slate-500">
          Consulte e atualize os preços dos produtos para este cliente.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-160 text-left text-sm">
          <caption className="sr-only">
            Preços dos produtos para {clientName}
          </caption>
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-5 py-4 sm:px-6">
                Código
              </th>
              <th scope="col" className="px-5 py-4 sm:px-6">
                Produto
              </th>
              <th scope="col" className="px-5 py-4 sm:px-6">
                Preço unitário
              </th>
              <th scope="col" className="px-5 py-4 text-right sm:px-6">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productsWithPrices.map(({ product, clientPrice }) => (
              <tr
                key={product.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800 sm:px-6">
                  {product.code}
                </td>
                <td className="min-w-48 px-5 py-4 text-slate-600 sm:px-6">
                  {product.description}
                </td>
                <td className="whitespace-nowrap px-5 py-4 sm:px-6">
                  {clientPrice ? (
                    <span className="font-medium text-slate-800">
                      {formatCurrency(clientPrice.unitPriceInCents)}
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      Não definido
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 sm:px-6">
                  <div className="flex justify-end">
                    {clientPrice ? (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(clientPrice)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 cursor-pointer"
                        >
                          <Pencil size={16} aria-hidden="true" />
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(clientPrice)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 cursor-pointer"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                          Excluir
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onCreate(product.id)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                      >
                        <Plus size={16} aria-hidden="true" />
                        Cadastrar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}