// hooks/useTickets.ts
import { useState, useEffect } from 'react';
import { getUserTickets } from '@/lib/actions/user-tickets-actions';
import { LocalTicket } from '@/components/profile/QrModdal';

interface TicketSummary {
  totalTickets: number;
  activeTickets: number;
  expiredTickets: number;
  totalAmount: number;
  pendingTickets: number;
}

// Interface para o novo formato da API (com base no JSON que você forneceu)
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

interface UserTicketResponse {
  success: boolean;
  items?: ApiTicketItem[]; // Agora é "items" em vez de "payments"
  message?: string;
}

export function useTickets(token: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiItems, setApiItems] = useState<ApiTicketItem[]>([]);
  const [localTickets, setLocalTickets] = useState<LocalTicket[]>([]);
  const [summary, setSummary] = useState<TicketSummary>({
    totalTickets: 0,
    activeTickets: 0,
    expiredTickets: 0,
    totalAmount: 0,
    pendingTickets: 0
  });

  const getTicketStatus = (expiresAt: string): 'active' | 'expired' => {
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    return expiresDate > now ? 'active' : 'expired';
  };

  const loadUserTickets = async () => {
    if (!token) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🎫 Carregando bilhetes do usuário...');
      
      const result: UserTicketResponse = await getUserTickets();
      
      console.log('📦 Resposta da API:', result);
      
      if (result.success && result.items && result.items.length > 0) {
        console.log('✅ Items carregados com sucesso:', result.items.length);
        
        setApiItems(result.items);
        
        // Processar todos os tickets da API
        const allTickets: LocalTicket[] = [];
        let totalTickets = 0;
        let activeTickets = 0;
        let expiredTickets = 0;
        let totalAmount = 0;

        result.items.forEach((item: ApiTicketItem) => {
          console.log('🎫 Processando ticket:', item.id, 'Código:', item.code);
          
          const ticket = item.ticket;
          const event = ticket.event;
          const status = getTicketStatus(ticket.expiresAt);
          
          totalTickets++;
          totalAmount += ticket.price;
          
          if (status === 'active') {
            activeTickets++;
          } else {
            expiredTickets++;
          }
          
          // Formatar data do evento (usa expiresAt como data do evento)
          const eventDate = new Date(ticket.expiresAt).toLocaleDateString('pt-MZ', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
          
          const eventTime = new Date(ticket.expiresAt).toLocaleTimeString('pt-MZ', {
            hour: '2-digit',
            minute: '2-digit'
          });

          const localTicket: LocalTicket = {
            id: item.id,
            ticketId: item.ticketId,
            ticketCode: item.code,
            ticketType: ticket.type,
            ticketName: ticket.name,
            price: ticket.price,
            expiresAt: ticket.expiresAt,
            
            // Dados do evento
            eventId: ticket.eventId,
            eventName: event.title,
            eventDescription: event.description,
            eventLocation: event.location,
            eventImage: event.img,
            eventProvince: event.province,
            eventDate: eventDate,
            eventTime: eventTime,
            
            // Dados de compra (como não temos data de compra na API, usamos a data atual)
            purchaseDate: new Date().toLocaleDateString('pt-MZ'),
            quantity: 1,
            paymentMethod: 'Cartão', // Valor padrão
            paymentStatus: 'confirmed', // Assumindo que todos são confirmados
            paymentReference: `REF-${item.code}`,
            
            // Status e QR Code
            status: status,
            qrCode: '',
            
            // Dados originais
            originalData: {
              paymentId: item.id,
              ticketId: ticket.id,
              eventId: event.id,
              type: ticket.type,
              quantity: 1,
              paymentDate: new Date().toISOString(),
              ticketUser: {
                code: item.code
              },
              event: event
            }
          };

          console.log('✅ Ticket criado:', localTicket.eventName);
          allTickets.push(localTicket);
        });

        setSummary({
          totalTickets,
          activeTickets,
          expiredTickets,
          totalAmount,
          pendingTickets: 0 // Como não temos status de pending na nova API
        });

        setLocalTickets(allTickets);
        
        console.log('📊 Resumo final:', {
          totalTickets,
          activeTickets,
          expiredTickets,
          totalAmount,
          ticketsCount: allTickets.length
        });
        
      } else if (result.success) {
        console.log('ℹ️ Nenhum item encontrado na resposta');
        setApiItems([]);
        setLocalTickets([]);
        setSummary({
          totalTickets: 0,
          activeTickets: 0,
          expiredTickets: 0,
          totalAmount: 0,
          pendingTickets: 0
        });
      } else {
        console.error('❌ Erro na resposta da API:', result.message);
        setError(result.message || 'Erro ao carregar bilhetes');
        setLocalTickets([]);
      }
    } catch (err: any) {
      console.error('💥 Erro inesperado:', err);
      setError(err.message || 'Erro inesperado ao carregar bilhetes');
      setLocalTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketQRCode = (ticketId: string, qrCode: string) => {
    setLocalTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, qrCode } : t
    ));
  };

  useEffect(() => {
    if (token) {
      loadUserTickets();
    }
  }, [token]);

  return {
    loading,
    error,
    apiItems, // Mudado de apiPayments para apiItems
    localTickets,
    summary,
    loadUserTickets,
    updateTicketQRCode
  };
}