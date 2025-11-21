// lib/event-get-id.ts

export interface ApiEvent {
  id: string;
  title: string;
  description: string;
  capacity: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
  categoryId: string;
  category: { id: string; name: string } | null;
  organizer: string | null;
  tickets?: Array<{
    id: string;
    name: string;
    type: string;
    availableQuantity: number;
    price: number;
    lastDayPayment: string;
    benefits: Array<{
      id: string;
      name: string;
      description: string;
      icon: string | null;
    }>;
  }>;
}
export type EventResponse = {
  id: string;
  title: string;
  description: string;
  capacity: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
  categoryId: string;
  organizerId: string | null;
  category: {
    id: string;
    name: string;
  };
  organizer: any;
  tickets: {
    id: string;
    name: string;
    type: string;
    availableQuantity: number;
    price: number;
    lastDayPayment: string;
    benefits: {
      id: string;
      name: string;
      description: string;
      icon: string | null;
    }[];
  }[];
};
export interface EventPurchaseData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  address: string;
  image: string;
  capacity: number;
  ticketsLeft: number;
  rating: number;
  featured: boolean;
  organizer: string;
  longDescription: string;
  ticketTypes: Array<{
    id: string;
    name: string;
    price: number;
    type: string;
    availableQuantity: number;
    benefits: Array<{
      id: string;
      name: string;
      description: string;
      icon: string | null;
    }>;
    lastDayPayment: string;
  }>;
}

export async function getEventById(eventId: string) {
  const url = `https://backend-eventos.unitec.academy/events/${eventId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Erro ao buscar evento: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error("Evento não encontrado");
  }

  // 👉 RETORNA EXATAMENTE O QUE O BACKEND ENVIA
  return data.events ? data.events[0] : data.event;
}

