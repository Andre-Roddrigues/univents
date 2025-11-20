'use server';

export interface EventType {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
}

export async function getEventList(): Promise<EventType[]> {
  try {
    const res = await fetch("https://backend-eventos.unitec.academy/events", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // evita cache em produção
    });

    if (!res.ok) {
      console.error("Erro ao buscar eventos:", res.status);
      return [];
    }

    const data = await res.json();

    if (data?.success && Array.isArray(data.events)) {
      return data.events;
    }

    return [];
  } catch (error) {
    console.error("Erro inesperado ao buscar eventos:", error);
    return [];
  }
}
