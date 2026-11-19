import { NavLink } from "react-router";
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Users,
  Package,
} from "lucide-react";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Novo pedido", path: "/novo-pedido", icon: ShoppingCart },
    { name: "Pedidos", path: "/pedidos", icon: ClipboardList },
    { name: "Clientes", path: "/clientes", icon: Users },
    { name: "Produtos", path: "/produtos", icon: Package },
  ];

  return (
    <aside className="flex min-h-screen w-16 shrink-0 flex-col bg-slate-900 text-white md:w-64">
      <div className="border-b border-slate-700 px-6 py-6">
        <h1 className="text-xl font-bold tracking-wide">
          <span className="md:hidden">A</span>
          <span className="hidden md:inline">ALLSPROT</span>
        </h1>
        <p className="hidden text-xs tracking-widest text-slate-400 md:block">
          ORDERS
        </p>
      </div>

      <nav className="flex-1 space-y-2 px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span className="hidden md:inline">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden border-t border-slate-700 px-6 py-4 md:block">
        <p className="text-xs text-slate-500">Sistema de recibos</p>
        <p className="text-xs text-slate-400">MVP - Versão 1.0</p>
      </div>
    </aside>
  );
}

export default Sidebar;
