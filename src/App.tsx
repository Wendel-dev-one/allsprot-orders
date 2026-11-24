import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Orders/Orders";
import MainLayout from "./components/layout/MainLayout";
import { Clients } from "./pages/Clients/Clients";
import { Products } from "./pages/Products/Products";

function ComingSoon({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-slate-500">Página em desenvolvimento.</p>
    </div>
  );
}

function App() {

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route
            path="/novo-pedido"
            element={<ComingSoon title="Novo pedido" />}
          />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/pedidos" element={<Orders />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
