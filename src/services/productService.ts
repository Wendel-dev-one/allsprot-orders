import type { Product } from "../types/product";
import { getStorageData, setStorageData } from "./storage/localStorage";
import { deleteClientPricesByProductId } from "./clientPriceService";
import { productHasOrders } from "./orderQueries";

const PRODUCTS_STORAGE_KEY = "allsprot_products";

export function getProducts(): Product[] {
  return getStorageData<Product[]>(PRODUCTS_STORAGE_KEY) ?? [];
}

export function createProduct(productData: Omit<Product, "id">): Product {
  const products = getProducts();

  const newProduct: Product = {
    id: crypto.randomUUID(),
    ...productData,
  };

  const updatedProducts = [...products, newProduct];

  setStorageData(PRODUCTS_STORAGE_KEY, updatedProducts);

  return newProduct;
}

export function updateProduct(
  id: string,
  productData: Omit<Product, "id">,
): Product | null {
  const products = getProducts();
  let updatedProduct: Product | null = null;

  const updatedProducts = products.map((product) => {
    if (product.id !== id) {
      return product;
    }

    updatedProduct = { ...productData, id: product.id };
    return updatedProduct;
  });

  if (updatedProduct) {
    setStorageData(PRODUCTS_STORAGE_KEY, updatedProducts);
  }

  return updatedProduct;
}

export function deleteProduct(id: string): boolean {
  if (productHasOrders(id)) {
    return false;
  }

  const products = getProducts();

  const updatedProducts = products.filter((product) => product.id !== id);

  if (updatedProducts.length === products.length) {
    return false;
  }

  try {
    setStorageData(PRODUCTS_STORAGE_KEY, updatedProducts);
    if (!deleteClientPricesByProductId(id)) {
      setStorageData(PRODUCTS_STORAGE_KEY, products);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erro ao excluir produto do localStorage:", error);
    return false;
  }
}
