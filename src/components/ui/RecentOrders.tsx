import { Link } from "react-router";

const orders = [
  {
    id: "#001",
    client: "Cliente A",
    date: "17/11/2026",
    total: "R$ 1.470,00",
    status: "Concluído",
  },
  {
    id: "#002",
    client: "Cliente B",
    date: "16/11/2026",
    total: "R$ 850,00",
    status: "Concluído",
  },
  {
    id: "#003",
    client: "Cliente C",
    date: "15/11/2026",
    total: "R$ 2.100,00",
    status: "Pendente",
  },
];

function RecentOrders() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
        <div>
          <h3 className="font-semibold text-slate-800">Pedidos recentes</h3>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe os últimos pedidos registrados.
          </p>
        </div>

        <Link
          to="/pedidos"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          Ver todos
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4 font-medium">Pedido</th>
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium">Data</th>
              <th className="px-6 py-4 font-medium">Valor</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-medium text-slate-700">
                  {order.id}
                </td>
                <td className="px-6 py-4 text-slate-600">{order.client}</td>
                <td className="px-6 py-4 text-slate-600">{order.date}</td>
                <td className="px-6 py-4 font-medium text-slate-700">
                  {order.total}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === "Concluído"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentOrders;
