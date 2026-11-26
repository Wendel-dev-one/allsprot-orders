import { useEffect, useState } from "react";
import { getClientPrices } from "../../services/clientPriceService";
import { getClients } from "../../services/clientService";
import { getProducts } from "../../services/productService";
import type { ClientPrice } from "../../types/client-price";
import type { Client } from "../../types/client";
import type { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";
import { createOrder } from "../../services/orderService";
import { useNavigate } from "react-router";
import { AlertTriangleIcon } from "lucide-react";

export function NewOrder() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientPrices, setClientPrices] = useState<ClientPrice[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [items, setItems] = useState<{ productId: string; quantity: number }[]>(
    [],
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantityInput, setQuantityInput] = useState<string>("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setClients(getClients());
    setProducts(getProducts());
    setClientPrices(getClientPrices());
  }, []);

  const activeProducts = products.filter((product) => product.active);

  const selectedClientPrices = clientPrices.filter(
    (clientPrice) => clientPrice.clientId === selectedClientId,
  );

  const availableProducts = activeProducts.filter(
    (product) =>
      selectedClientPrices.some(
        (clientPrice) => clientPrice.productId === product.id,
      ) &&
      (!items.some((item) => item.productId === product.id) ||
        editingProductId === product.id),
  );

  const selectedProduct = availableProducts.find(
    (product) => product.id === selectedProductId,
  );
  const selectedProductPrice = selectedClientPrices.find(
    (price) => price.productId === selectedProductId,
  );

  const orderItems = items.map((item) => {
    const product = products.find(
      (candidate) => candidate.id === item.productId,
    )!;
    const clientPrice = selectedClientPrices.find(
      (price) => price.productId === item.productId,
    )!;
    const unitPriceInCents = clientPrice.unitPriceInCents;

    return {
      ...item,
      product,
      clientPrice,
      packages: item.quantity / product.unitsPerPackage,
      unitPriceInCents,
      totalInCents: item.quantity * unitPriceInCents,
    };
  });

  const quantity = Number(quantityInput);
  const isQuantityValid =
    Number.isInteger(quantity) &&
    quantity > 0 &&
    selectedProduct !== undefined &&
    quantity % selectedProduct.unitsPerPackage === 0;
  const itemTotalInCents =
    selectedProductPrice !== undefined && isQuantityValid
      ? quantity * selectedProductPrice.unitPriceInCents
      : 0;
  const itemPackages =
    selectedProduct !== undefined && isQuantityValid
      ? quantity / selectedProduct.unitsPerPackage
      : 0;

  const totalUnits = items.reduce((total, item) => total + item.quantity, 0);
  const totalPackages = orderItems.reduce(
    (total, item) => total + item.packages,
    0,
  );
  const totalInCents = orderItems.reduce(
    (total, item) => total + item.totalInCents,
    0,
  );

  const handleAddItem = () => {
    if (
      !selectedClientId ||
      !selectedProduct ||
      !selectedProductPrice ||
      !isQuantityValid
    ) {
      return;
    }

    if (editingProductId) {
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === editingProductId ? { ...item, quantity } : item,
        ),
      );
      setEditingProductId(null);
      setSelectedProductId("");
      setQuantityInput("");
      return;
    }

    setItems((currentItems) => {
      if (currentItems.some((item) => item.productId === selectedProductId)) {
        return currentItems;
      }

      return [
        ...currentItems,
        {
          productId: selectedProductId,
          quantity,
        },
      ];
    });
    setSelectedProductId("");
    setQuantityInput("");
  };

  const handleRemoveItem = (productId: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  };

  const handleEditItem = (productId: string) => {
    const item = items.find((item) => item.productId === productId);

    if (!item) {
      return;
    }

    setEditingProductId(productId);
    setSelectedProductId(item.productId);
    setQuantityInput(String(item.quantity));
  };

  const handleSaveOrder = () => {
    if (isSaving) {
      return;
    }

    if (!selectedClientId) {
      setSaveError("Selecione um cliente antes de salvar o pedido.");
      return;
    }

    if (items.length === 0) {
      setSaveError("Adicione pelo menos um item ao pedido.");
      return;
    }

    const orderData = {
      clientId: selectedClientId,
      status: "pending" as const,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    setSaveError("");
    setIsSaving(true);

    try {
      createOrder(orderData);
      navigate("/pedidos");
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao salvar o pedido.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
          Novo pedido
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Registre um pedido e associe produtos a um cliente.
        </p>
      </header>

      <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Dados do pedido
        </h2>
        <div className="mt-6 flex flex-col gap-1.5">
          <label
            htmlFor="client"
            className="text-sm font-medium text-slate-700"
          >
            Cliente
          </label>
          <select
            id="client"
            value={selectedClientId}
            onChange={(event) => {
              setSelectedClientId(event.target.value);
              setItems([]);
              setSelectedProductId("");
              setQuantityInput("");
              setEditingProductId(null);
              setSaveError("");
            }}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Itens da entrega
        </h2>

        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="product"
              className="text-sm font-medium text-slate-700"
            >
              Produto
            </label>
            <select
              id="product"
              value={selectedProductId}
              onChange={(event) => {
                setSelectedProductId(event.target.value);
                setQuantityInput("");
              }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Selecione um produto</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.description}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="quantity"
              className="text-sm font-medium text-slate-700"
            >
              Quantidade (unidades)
            </label>
            <input
              id="quantity"
              type="number"
              value={quantityInput}
              onChange={(event) => setQuantityInput(event.target.value)}
              min={1}
              step={1}
              placeholder="Ex.: 500"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="mt-5 rounded-md bg-slate-50 p-4">
          <p className="text-sm font-medium text-slate-700">Prévia do item</p>
          {selectedProduct && selectedProductPrice && isQuantityValid ? (
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between gap-4">
                <dt>Produto</dt>
                <dd className="text-right font-medium text-slate-800">
                  {selectedProduct.description}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Quantidade</dt>
                <dd className="font-medium text-slate-800">
                  {quantity} unidades
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Pacotes</dt>
                <dd className="font-medium text-slate-800">{itemPackages}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Preço unitário</dt>
                <dd className="font-medium text-slate-800">
                  {formatCurrency(selectedProductPrice.unitPriceInCents)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-slate-200 pt-2">
                <dt className="font-medium text-slate-700">Subtotal</dt>
                <dd className="font-semibold text-slate-800">
                  {formatCurrency(itemTotalInCents)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="mt-1 text-sm text-slate-600">
              Selecione um produto e informe uma quantidade válida para ver a
              prévia.
            </p>
          )}
        </div>

        {orderItems.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">
            Nenhum item foi adicionado.
          </p>
        )}

        {orderItems.length > 0 && (
          <div className="mt-4 space-y-3">
            {orderItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="font-medium text-slate-800">
                    {item.product.description}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.quantity} unidades · {item.packages} pacotes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Subtotal</p>
                  <p className="font-semibold text-slate-800">
                    {formatCurrency(item.totalInCents)}
                  </p>
                  <div className="mt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => handleEditItem(item.productId)}
                      className="cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.productId)}
                      className="cursor-pointer text-sm font-medium text-slate-500 transition-colors hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddItem}
          className="mt-5 w-full rounded-md border border-emerald-500 px-4 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {editingProductId ? "↺ Atualizar item" : "+ Adicionar item"}
        </button>
      </section>

      <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Resumo do pedido
        </h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">Total de unidades</dt>
            <dd className="font-semibold text-slate-800">{totalUnits}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-600">Total de pacotes</dt>
            <dd className="font-semibold text-slate-800">{totalPackages}</dd>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <dt className="font-semibold text-slate-800">Valor total</dt>
            <dd className="mt-1 font-semibold text-slate-800">
              {formatCurrency(totalInCents)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {saveError && (
          <div
            className="mb-4 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-3"
            role="alert"
          >
            <span className="mt-0.5 text-rose-600">
              <AlertTriangleIcon size={16} />
            </span>

            <p className="text-sm font-medium text-rose-700">{saveError}</p>
          </div>
        )}
        <button
          type="button"
          onClick={handleSaveOrder}
          disabled={isSaving}
          className="w-full rounded-md bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Salvando..." : "Salvar pedido"}
        </button>
      </section>
    </div>
  );
}
