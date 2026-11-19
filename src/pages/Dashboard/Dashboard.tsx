import { ClipboardList, Users, Package, CalendarDays } from "lucide-react";

import StatCard from "../../components/ui/StatCard";
import RecentOrders from '../../components/ui/RecentOrders'

function Dashboard() {
  return (
    <div className="min-w-0 space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Visão geral</h2>
        <p className="mt-1 text-sm text-slate-500">
          Acompanhe as principais informações do sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total de pedidos"
          value="128"
          description="Pedidos registrados"
          icon={ClipboardList}
        />

        <StatCard
          title="Clientes"
          value="03"
          description="Clientes cadastrados"
          icon={Users}
        />

        <StatCard
          title="Produtos"
          value="03"
          description="Produtos cadastrados"
          icon={Package}
        />

        <StatCard
          title="Pedidos recentes"
          value="12"
          description="Neste mês"
          icon={CalendarDays}
        />
      </div>
      <RecentOrders />
    </div>
  );
}

export default Dashboard;
