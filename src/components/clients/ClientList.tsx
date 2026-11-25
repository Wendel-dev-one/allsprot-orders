import { Pencil, Trash2, UsersRound } from "lucide-react";
import type { Client } from "../../types/client";

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
}

export function ClientList({ clients, onEdit, onDelete }: ClientListProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <UsersRound size={21} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Clientes cadastrados
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Gerencie os clientes registrados no sistema.
            </p>
          </div>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {clients.length} {clients.length === 1 ? "cliente" : "clientes"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          {/* <caption className="sr-only py-3">Lista de clientes cadastrados</caption> */}
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">
                Nome
              </th>
              <th scope="col" className="px-6 py-4">
                Contato
              </th>
              <th scope="col" className="px-6 py-4">
                Responsável
              </th>
              <th scope="col" className="px-6 py-4">
                Endereço
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Ações
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {clients.length > 0 ? (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full p-2 bg-emerald-50 text-sm font-semibold text-emerald-700">
                        {client.name.trim().charAt(0).toUpperCase() || "?"}
                      </span>
                      <span>{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{client.contact}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {client.responsible}
                  </td>
                  <td className="max-w-64 px-6 py-4 text-slate-600">
                    {client.address}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => onEdit(client)}
                        aria-label={`Editar ${client.name}`}
                        title="Editar cliente"
                        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 cursor-pointer"
                      >
                        <Pencil size={16} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(client.id)}
                        aria-label={`Excluir ${client.name}`}
                        title="Excluir cliente"
                        className="inline-flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 cursor-pointer"
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
                  className="p-6 text-center text-sm text-slate-500"
                >
                  Nenhum cliente cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
