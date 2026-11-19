import { useState } from "react"
import { getClients } from "../../services/clientService"
import type { Client } from "../../types/client";

export function Clients() {
  
  const [clients, setClients] = useState<Client[]>(getClients());
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  return (
    <h1>Clientes</h1>
  )
}