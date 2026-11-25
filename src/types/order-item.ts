export type OrderItem = {
  id: string;
  productId: string;
  productDescription: string;
  quantity: number;
  unitPriceInCents: number;
  unitsPerPackage: number;
  totalInCents: number;
};
