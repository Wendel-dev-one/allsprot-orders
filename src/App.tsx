import { Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Orders/Orders";
import MainLayout from "./components/layout/MainLayout";
import { Clients } from "./pages/Clients/Clients";
import { Products } from "./pages/Products/Products";
import { ClientPrices } from "./pages/ClientPrices/ClientPrices";
import { NewOrder } from "./pages/Orders/NewOrder";

function App() {
  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/novo-pedido" element={<NewOrder />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/precos-por-cliente" element={<ClientPrices />} />
        </Route>
      </Routes>
    </> 
  );
}

export default App;
