import type { OrderItem } from "./order-item";

export type OrderStatus =
  | "pending"
  | "processing"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  clientId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: string;
  totalInCents: number;
};