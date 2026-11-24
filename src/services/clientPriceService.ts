import type { ClientPrice } from "../types/client-price";
import { getStorageData, setStorageData } from "./storage/localStorage";

const CLIENTS_PRICES_STORAGE_KEY = "allsprot_client_prices";

export function getClientPrices(): ClientPrice[] {
  return getStorageData<ClientPrice[]>(CLIENTS_PRICES_STORAGE_KEY) ?? [];
}

export function createClientPrice(
  clientPriceData: Omit<ClientPrice, "id">,
): ClientPrice | null {
  if (clientPriceExists(clientPriceData.clientId, clientPriceData.productId)) {
    return null;
  }

  const clientPrices = getClientPrices();

  const newClientPrice: ClientPrice = {
    id: crypto.randomUUID(),
    ...clientPriceData,
  };

  const updatedClientPrices = [...clientPrices, newClientPrice];

  setStorageData(CLIENTS_PRICES_STORAGE_KEY, updatedClientPrices);

  return newClientPrice;
}

export function updateClientPrice(
  id: string,
  clientPriceData: Omit<ClientPrice, "id">,
): ClientPrice | null {
  const clientPrices = getClientPrices();
  let updatedClientPrice: ClientPrice | null = null;

  if (
    clientPriceExists(
      clientPriceData.clientId,
      clientPriceData.productId,
      id,
    )
  ) {
    return null;
  }

  const updatedClientPrices = clientPrices.map((clientPrice) => {
    if (clientPrice.id !== id) {
      return clientPrice;
    }

    updatedClientPrice = { ...clientPriceData, id: clientPrice.id };
    return updatedClientPrice;
  });

  if (updatedClientPrice) {
    setStorageData(CLIENTS_PRICES_STORAGE_KEY, updatedClientPrices);
  }

  return updatedClientPrice;
}

export function deleteClientPrice(id: string): boolean {
  const clientPrices = getClientPrices();

  const updatedClientPrices = clientPrices.filter(
    (clientPrice) => clientPrice.id !== id,
  );

  if (updatedClientPrices.length === clientPrices.length) {
    return false;
  }

  try {
    setStorageData(CLIENTS_PRICES_STORAGE_KEY, updatedClientPrices);
    return true;
  } catch (error) {
    console.error("Erro ao excluir preço do localStorage:", error);
    return false;
  }
}

export function deleteClientPricesByClientId(clientId: string): boolean {
  const clientPrices = getClientPrices();
  const updatedClientPrices = clientPrices.filter(
    (clientPrice) => clientPrice.clientId !== clientId,
  );

  if (updatedClientPrices.length === clientPrices.length) {
    return true;
  }

  try {
    setStorageData(CLIENTS_PRICES_STORAGE_KEY, updatedClientPrices);
    return true;
  } catch (error) {
    console.error("Erro ao excluir preços do cliente do localStorage:", error);
    return false;
  }
}

export function deleteClientPricesByProductId(productId: string): boolean {
  const clientPrices = getClientPrices();
  const updatedClientPrices = clientPrices.filter(
    (clientPrice) => clientPrice.productId !== productId,
  );

  if (updatedClientPrices.length === clientPrices.length) {
    return true;
  }

  try {
    setStorageData(CLIENTS_PRICES_STORAGE_KEY, updatedClientPrices);
    return true;
  } catch (error) {
    console.error("Erro ao excluir preços do produto do localStorage:", error);
    return false;
  }
}

export function clientPriceExists(
  clientId: string,
  productId: string,
  excludeId?: string,
): boolean {
  const clientPrices = getClientPrices();

  const clientIdProductIdExists = clientPrices.some(
    (clientPrice) =>
      clientPrice.clientId === clientId &&
      clientPrice.productId === productId &&
      clientPrice.id !== excludeId,
  );

  return clientIdProductIdExists;
}
