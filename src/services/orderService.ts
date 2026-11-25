import type { Order, OrderStatus } from "../types/order";
import type { OrderItem } from "../types/order-item";
import { getClientPrices } from "./clientPriceService";
import { getClients } from "./clientService";
import { getProducts } from "./productService";
import { getStorageData, setStorageData } from "./storage/localStorage";

const ORDERS_STORAGE_KEY = "allsprot_orders";

type CreateOrderItemData = {
  productId: string;
  quantity: number;
};

type CreateOrderData = {
  clientId: string;
  status: OrderStatus;
  items: CreateOrderItemData[];
};

export function getOrders(): Order[] {
  return getStorageData<Order[]>(ORDERS_STORAGE_KEY) ?? [];
}

export function getOrderById(id: string): Order | null {
  return getOrders().find((order) => order.id === id) ?? null;
}

export function createOrder(orderData: CreateOrderData): Order {
  const clients = getClients();
  const products = getProducts();
  const clientPrices = getClientPrices();

  if (!clients.some((client) => client.id === orderData.clientId)) {
    throw new Error(`Cliente não encontrado: ${orderData.clientId}`);
  }

  if (orderData.items.length === 0) {
    throw new Error("O pedido deve possuir pelo menos um item.");
  }

  const productIds = new Set(
    orderData.items.map((item) => item.productId),
  );
  if (productIds.size !== orderData.items.length) {
    throw new Error("Não é permitido repetir o mesmo produto no pedido.");
  }

  const items: OrderItem[] = orderData.items.map((itemData) => {
    const product = products.find(
      (candidate) => candidate.id === itemData.productId,
    );
    if (!product) {
      throw new Error(`Produto não encontrado: ${itemData.productId}`);
    }

    if (!product.active) {
      throw new Error(`Produto inativo: ${itemData.productId}`);
    }

    if (!Number.isInteger(itemData.quantity)) {
      throw new Error("A quantidade deve ser um número inteiro.");
    }

    if (itemData.quantity <= 0) {
      throw new Error("A quantidade deve ser maior que zero.");
    }

    if (
      !Number.isInteger(product.unitsPerPackage) ||
      product.unitsPerPackage <= 0
    ) {
      throw new Error(
        "A quantidade de unidades por pacote deve ser um inteiro positivo.",
      );
    }

    if (itemData.quantity % product.unitsPerPackage !== 0) {
      throw new Error(
        `A quantidade deve ser múltipla de ${product.unitsPerPackage}.`,
      );
    }

    const clientPrice = clientPrices.find(
      (candidate) =>
        candidate.clientId === orderData.clientId &&
        candidate.productId === itemData.productId,
    );
    if (!clientPrice) {
      throw new Error(
        `Preço não encontrado para o produto ${itemData.productId} e cliente ${orderData.clientId}`,
      );
    }

    if (!Number.isInteger(clientPrice.unitPriceInCents)) {
      throw new Error("O preço deve ser um número inteiro.");
    }

    if (clientPrice.unitPriceInCents <= 0) {
      throw new Error("O preço deve ser maior que zero.");
    }

    return {
      id: crypto.randomUUID(),
      productId: product.id,
      productDescription: product.description,
      quantity: itemData.quantity,
      unitPriceInCents: clientPrice.unitPriceInCents,
      unitsPerPackage: product.unitsPerPackage,
      totalInCents: itemData.quantity * clientPrice.unitPriceInCents,
    };
  });

  const newOrder: Order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    clientId: orderData.clientId,
    status: orderData.status,
    items,
    totalInCents: items.reduce((total, item) => total + item.totalInCents, 0),
  };

  const orders = getOrders();
  const updatedOrders = [...orders, newOrder];
  setStorageData(ORDERS_STORAGE_KEY, updatedOrders);

  return newOrder;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Order | null {
  const orders = getOrders();
  let updatedOrder: Order | null = null;

  const updatedOrders = orders.map((order) => {
    if (order.id !== id) {
      return order;
    }

    updatedOrder = { ...order, status };
    return updatedOrder;
  });

  if (updatedOrder) {
    setStorageData(ORDERS_STORAGE_KEY, updatedOrders);
  }

  return updatedOrder;
}
