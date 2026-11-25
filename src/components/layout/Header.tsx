import { useLocation } from "react-router";
import { Bell, UserCircle } from "lucide-react";

function Header() {
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/novo-pedido": "Novo pedido",
    "/pedidos": "Pedidos",
    "/clientes": "Clientes",
    "/produtos": "Produtos",
    "/precos-por-cliente": "Preços por cliente",
  };

  const currentTitle = pageTitles[location.pathname] || "Página";

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 md:px-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-800">{currentTitle}</h1>
        <p className="text-sm text-slate-500">
          Sistema de gerenciamento de recibos
        </p>
      </div>

      <div className="flex items-center gap-5">
        <button className="text-slate-500 transition-colors hover:text-slate-800">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-5">
          <UserCircle size={30} className="text-slate-500" />

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-700">Administrador</p>
            <p className="text-xs text-slate-400">Painel administrativo</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
