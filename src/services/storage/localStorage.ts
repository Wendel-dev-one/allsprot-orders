export function getStorageData<T>(key: string): T | null {
  try {
    const data = localStorage.getItem(key);

    if (!data) {
      return null; 
    }

    return JSON.parse(data) as T;
  } catch (error) {
    console.error(
      `Erro ao fazer parse do dado do localStorage para a chave "${key}":`,
      error,
    );
    return null;
  }
}

export function setStorageData<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function removeStorageData(key: string): void {
  localStorage.removeItem(key);
}
