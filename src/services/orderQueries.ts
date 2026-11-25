import type { Order } from "../types/order";
import { getStorageData } from "./storage/localStorage";

const ORDERS_STORAGE_KEY = "allsprot_orders";

function getStoredOrders(): Order[] {
  return getStorageData<Order[]>(ORDERS_STORAGE_KEY) ?? [];
}

export function clientHasOrders(clientId: string): boolean {
  const orders = getStoredOrders();

  return orders.some((order) => order.clientId === clientId);
}

export function productHasOrders(productId: string): boolean {
  const orders = getStoredOrders();

  return orders.some((order) =>
    order.items.some((item) => item.productId === productId),
  );
}