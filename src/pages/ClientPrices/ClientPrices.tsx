import { useEffect, useState } from "react";
import { getClients } from "../../services/clientService";
import { getProducts } from "../../services/productService";
import {
  createClientPrice,
  deleteClientPrice,
  getClientPrices,
  updateClientPrice,
} from "../../services/clientPriceService";
import type { Client } from "../../types/client";
import type { Product } from "../../types/product";
import type { ClientPrice } from "../../types/client-price";
import { ClientPriceForm } from "../../components/client-prices/ClientPriceForm";
import { ClientPriceList } from "../../components/client-prices/ClientPriceList";

export function ClientPrices() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [clientPrices, setClientPrices] = useState<ClientPrice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<ClientPrice | null>(null);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    setClients(getClients());
    setProducts(getProducts());
    setClientPrices(getClientPrices());
  }, []);

  const activeProducts = products.filter((product) => product.active);

  const selectedClient = clients.find(
    (client) => client.id === selectedClientId,
  );

  const selectedClientPrices = clientPrices.filter(
    (clientPrice) => clientPrice.clientId === selectedClientId,
  );

  const productsWithPrices = activeProducts.map((product) => ({
    product,
    clientPrice: selectedClientPrices.find(
      (clientPrice) => clientPrice.productId === product.id,
    ),
  }));

  const handleCreatePrice = (productId: string) => {
    setSelectedPrice(null);
    setIsFormOpen(true);
    setSelectedProductId(productId);
  };

  const handleEditPrice = (clientPrice: ClientPrice) => {
    setSelectedPrice(clientPrice);
    setSelectedProductId(clientPrice.productId);
    setIsFormOpen(true);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setSelectedPrice(null);
    setSelectedProductId("");
  };

  function handleDeletePrice(clientPrice: ClientPrice) {
    const confirmed = window.confirm(
      "Tem certeza de que deseja excluir este preço?",
    );

    if (!confirmed) {
      return;
    }

    const deleted = deleteClientPrice(clientPrice.id);

    if (!deleted) {
      alert("Não foi possível excluir o preço.");
      return;
    }

    setClientPrices((currentPrices) =>
      currentPrices.filter((price) => price.id !== clientPrice.id),
    );
  }

  function handleChangeClient(clientId: string) {
    setSelectedClientId(clientId);
    handleCancelForm();
  }
  async function handleSavePrice(priceData: Omit<ClientPrice, "id">) {
    let savedPrice: ClientPrice | null = null;

    if (selectedPrice) {
      savedPrice = updateClientPrice(selectedPrice.id, priceData);
    } else {
      savedPrice = createClientPrice(priceData);
    }

    if (savedPrice === null) {
      alert(
        "Não foi possível salvar o preço. Verifique se já existe um cadastro para este produto e cliente.",
      );
      return;
    }

    const priceToSave = savedPrice;

    if (selectedPrice) {
      setClientPrices((currentPrices) =>
        currentPrices.map((clientPrice) =>
          clientPrice.id === selectedPrice.id ? priceToSave : clientPrice,
        ),
      );
    } else {
      setClientPrices((currentPrices) => [...currentPrices, priceToSave]);
    }

    handleCancelForm();
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Preços por cliente
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Gerencie os preços individuais dos produtos para cada cliente.
        </p>
      </header>

      <section >
        {/* <div className="max-w-xl">
          <label
            htmlFor="client-select"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Cliente
          </label>
          <select
            id="client-select"
            value={selectedClientId}
            onChange={(event) => setSelectedClientId(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {!selectedClientId && (
            <p className="mt-2 text-sm text-slate-500">
              Selecione um cliente para visualizar os preços.
            </p>
          )}
        </div> */}
        {clients.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Nenhum cliente cadastrado. Cadastre um cliente primeiro para
            configurar os preços dos produtos.
          </p>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <label
              htmlFor="client"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Selecione o cliente
            </label>

            <select
              id="client"
              value={selectedClientId}
              onChange={(event) => handleChangeClient(event.target.value)}
              className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecione um cliente</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {selectedClient &&
        (productsWithPrices.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Nenhum produto ativo disponível. Ative ou cadastre um produto para
            configurar os preços deste cliente.
          </p>
        ) : (
          <ClientPriceList
            productsWithPrices={productsWithPrices}
            onCreate={handleCreatePrice}
            onEdit={handleEditPrice}
            onDelete={handleDeletePrice}
            clientName={selectedClient.name}
          />
        ))}

      {isFormOpen && selectedClient && (
        <div className="w-full">
          <ClientPriceForm
            key={selectedPrice?.id ?? selectedProductId}
            initialData={selectedPrice}
            clientId={selectedClientId}
            productId={selectedProductId}
            onSubmit={handleSavePrice}
            onCancel={handleCancelForm}
          />
        </div>
      )}
    </div>
  );
}
