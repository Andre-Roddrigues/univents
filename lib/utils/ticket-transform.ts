// lib/utils/ticket-transform.ts
import type { LocalTicket } from '@/components/profile/QrModdal';

interface ApiTicketItem {
  id: string;
  userId: string;
  ticketId: string;
  code: string;
  ticket: {
    id: string;
    name: string;
    type: string;
    price: number;
    expiresAt: string;
    eventId: string;
    event: {
      id: string;
      title: string;
      description: string;
      location: string;
      img: string;
      province: string;
    };
  };
}

export function transformApiTicketsToLocal(apiItems: ApiTicketItem[]): LocalTicket[] {
  return apiItems.map(item => {
    const expiresAt = new Date(item.ticket.expiresAt);
    const now = new Date();
    
    // Determinar status baseado na data de expiração
    let status: 'active' | 'expired' | 'pending' = 'active';
    if (expiresAt < now) {
      status = 'expired';
    }
    
    // Extrair data e hora do evento
    const eventDate = expiresAt.toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    
    const eventTime = expiresAt.toLocaleTimeString('pt-MZ', {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Determinar método de pagamento baseado no tipo de ticket
    const paymentMethod = item.ticket.type === 'vip' ? 'Cartão' : 'Dinheiro';
    
    // Status de pagamento (assumindo que todos os tickets da API são confirmados)
    const paymentStatus = 'confirmed';

    return {
      id: item.id,
      ticketId: item.ticketId,
      ticketCode: item.code,
      ticketType: item.ticket.type,
      ticketName: item.ticket.name,
      price: item.ticket.price,
      expiresAt: item.ticket.expiresAt,
      
      // Dados do evento
      eventId: item.ticket.eventId,
      eventName: item.ticket.event.title,
      eventDescription: item.ticket.event.description,
      eventLocation: item.ticket.event.location,
      eventImage: item.ticket.event.img,
      eventProvince: item.ticket.event.province,
      eventDate: eventDate,
      eventTime: eventTime,
      
      // Dados de compra
      purchaseDate: new Date().toLocaleDateString('pt-MZ'),
      quantity: 1,
      paymentMethod: paymentMethod,
      paymentStatus: paymentStatus,
      paymentReference: `REF-${item.code}`,
      
      // Status e QR Code
      status: status,
      qrCode: '',
      
      // Dados originais
      originalData: {
        paymentId: item.id,
        ticketId: item.ticketId,
        eventId: item.ticket.event.id,
        type: item.ticket.type,
        quantity: 1,
        paymentDate: new Date().toISOString(),
        ticketUser: {
          code: item.code
        },
        event: item.ticket.event
      }
    };
  });
}

// Funções auxiliares
export function getTicketStatus(expiresAt: string): 'active' | 'expired' | 'pending' {
  const expiresDate = new Date(expiresAt);
  const now = new Date();
  
  if (expiresDate < now) {
    return 'expired';
  }
  
  return 'active';
}

export function calculateTicketSummary(items: ApiTicketItem[]) {
  const transformed = transformApiTicketsToLocal(items);
  
  return {
    totalTickets: transformed.length,
    activeTickets: transformed.filter(t => t.status === 'active').length,
    expiredTickets: transformed.filter(t => t.status === 'expired').length,
    totalAmount: transformed.reduce((sum, ticket) => sum + (ticket.price || 0), 0),
    pendingTickets: transformed.filter(t => t.paymentStatus === 'pending').length
  };
}