import type { Client } from "../types/client";
import { getStorageData, setStorageData } from "./storage/localStorage";

const CLIENTS_STORAGE_KEY = "allsprot_clients";

export function getClients(): Client[] {
  return getStorageData<Client[]>(CLIENTS_STORAGE_KEY) ?? [];
}

export function createClient(clientData: Omit<Client, "id">): Client {
  const clients = getClients();

  const newClient: Client = {
    id: crypto.randomUUID(),
    ...clientData,
  };

  const updatedClients = [...clients, newClient];

  setStorageData(CLIENTS_STORAGE_KEY, updatedClients);

  return newClient;
}

export function updateClient(
  id: string,
  clientData: Omit<Client, "id">,
): Client | null {
  const clients = getClients();
  let updatedClient: Client | null = null;

  const updatedClients = clients.map((client) => {
    if (client.id !== id) {
      return client;
    }

    updatedClient = { ...clientData, id: client.id };
    return updatedClient;
  });

  if (updatedClient) {
    setStorageData(CLIENTS_STORAGE_KEY, updatedClients);
  }

  return updatedClient;
}

export function deleteClient(id: string): boolean {
  // Recupera a lista atual de clientes.
  const clients = getClients();

  // Mantém todos os clientes, exceto aquele com o ID informado.
  const updatedClients = clients.filter((client) => client.id !== id);

  // Retorna false se nenhum cliente foi removido.
  if (updatedClients.length === clients.length) {
    return false;
  }

  try {
    // Salva a nova lista e confirma o sucesso da exclusão.
    setStorageData(CLIENTS_STORAGE_KEY, updatedClients);
    return true;
  } catch (error) {
    // Registra a falha ao salvar e informa que a exclusão não foi concluída.
    console.error("Erro ao excluir cliente do localStorage:", error);
    return false;
  }
}
