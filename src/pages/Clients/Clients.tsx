import { useState } from "react";
import {
  createClient,
  getClients,
  deleteClient,
  updateClient,
} from "../../services/clientService";
import type { Client } from "../../types/client";
import { ClientForm } from "../../components/clients/ClientForm";
import { ClientList } from "../../components/clients/ClientList";

export function Clients() {
  const [clients, setClients] = useState<Client[]>(getClients());
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  function handleCreateClient(clientData: Omit<Client, "id">) {
    const createdClient = createClient(clientData);
    setClients((clients) => [...clients, createdClient]);
    handleCancelForm();
  }

  function handleDeleteClient(id: string) {
    // Interrompe a exclusão se o usuário cancelar a confirmação.
    if (!window.confirm("Tem certeza de que deseja excluir este cliente?")) {
      return;
    }

    // Atualiza a interface somente se o serviço confirmar a exclusão.
    if (deleteClient(id)) {
      setClients((clients) => clients.filter((client) => client.id !== id));
    }
  }

  function handleSelectClient(client: Client) {
    setSelectedClient(client);
    setIsFormOpen(true);
  }

  function handleUpdateClient(clientData: Omit<Client, "id">) {
    if (!selectedClient) {
      return;
    }

    const updatedClient = updateClient(selectedClient.id, clientData);

    if (updatedClient) {
      setClients((clients) =>
        clients.map((client) =>
          client.id === updatedClient.id ? updatedClient : client,
        ),
      );
      handleCancelForm();
    }
  }

  function handleCancelForm() {
    setIsFormOpen(false);
    setSelectedClient(null);
  }

  return (
    <>
      <button
        type="button"
        className="mb-4 px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors cursor-pointer"
        onClick={() => {
          setSelectedClient(null);
          setIsFormOpen(true);
        }}
      >
        Novo cliente
      </button>
      {isFormOpen && (
        <ClientForm
          initialData={selectedClient}
          onSubmit={(clientData) =>
            selectedClient
              ? handleUpdateClient(clientData)
              : handleCreateClient(clientData)
          }
          onCancel={handleCancelForm}
        />
      )}
      <ClientList
        clients={clients}
        onEdit={handleSelectClient}
        onDelete={handleDeleteClient}
      />
    </>
  );
}
