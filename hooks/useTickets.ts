// hooks/useTickets.ts
import { useState, useEffect } from 'react';
import { getUserTickets } from '@/lib/actions/user-tickets-actions';
import { LocalTicket } from '@/components/profile/QrModdal';

interface TicketSummary {
  totalTickets: number;
  confirmedTickets: number;
  pendingTickets: number;
  totalAmount: number;
}

interface Payment {
  id: string;
  amount: number;
  reference: string | null;
  method: string;
  status: string;
  paymentDate: string;
  itemName: string;
  itemId: string;
  entityId: string;
  cart: {
    id: string;
    discount: null | number;
    TotalPriceAftertDiscount: null | number;
    totalPrice: number;
    status: string;
    userId: string;
    cartItems: Array<{
      id: string;
      ticketId: string;
      cartId: string;
      price: number;
      quantity: number;
      TotalProductDiscount: null | number;
      ticket: {
        id: string;
        name: string;
        type: string;
        price: number;
        availableQuantity: number;
        lastDayPayment: string;
        status: string;
        expiresAt: null | string;
        eventId: string;
        ticketUsers: Array<{
          id: string;
          userId: string;
          ticketId: string;
          code: string;
        }>;
        event: {
          id: string;
          title: string;
          description: string;
          location: string;
          img: string;
          province: string;
          date?: string;
        };
      };
    }>;
  };
}

interface UserTicketResponse {
  success: boolean;
  payments?: Payment[];
  message?: string;
}

export function useTickets(token: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiPayments, setApiPayments] = useState<Payment[]>([]);
  const [localTickets, setLocalTickets] = useState<LocalTicket[]>([]);
  const [summary, setSummary] = useState<TicketSummary>({
    totalTickets: 0,
    confirmedTickets: 0,
    pendingTickets: 0,
    totalAmount: 0
  });

  const getTicketStatus = (paymentStatus: string): 'active' | 'used' | 'pending' => {
    switch (paymentStatus) {
      case 'confirmed':
        return 'active';
      case 'pending':
        return 'pending';
      default:
        return 'used';
    }
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
      
      const result: UserTicketResponse = await getUserTickets(token);
      
      console.log('📦 Resposta da API:', result);
      
      if (result.success && result.payments && result.payments.length > 0) {
        console.log('✅ Pagamentos carregados com sucesso:', result.payments.length);
        
        setApiPayments(result.payments);
        
        // Processar todos os tickets dos pagamentos
        const allTickets: LocalTicket[] = [];
        let totalTickets = 0;
        let confirmedTickets = 0;
        let pendingTickets = 0;
        let totalAmount = 0;

        result.payments.forEach((payment: Payment) => {
          console.log('💳 Processando pagamento:', payment.id, 'Status:', payment.status);
          console.log('🛒 Cart items:', payment.cart?.cartItems?.length);
          
          totalAmount += payment.amount;
          
          // Processar cada cartItem no carrinho
          if (payment.cart && payment.cart.cartItems) {
            payment.cart.cartItems.forEach((cartItem, itemIndex: number) => {
              const ticket = cartItem.ticket;
              const event = ticket.event;
              
              console.log('🎪 Evento:', event.title);
              console.log('🎫 Ticket:', ticket.name, 'Quantidade:', cartItem.quantity);
              
              // Para cada quantidade, criar um ticket individual
              for (let i = 0; i < cartItem.quantity; i++) {
                totalTickets++;
                
                if (payment.status === 'confirmed') {
                  confirmedTickets++;
                } else if (payment.status === 'pending') {
                  pendingTickets++;
                }
                
                // Encontrar o código do ticket para este usuário específico
                const ticketUser = ticket.ticketUsers?.find((tu) => 
                  tu.userId === payment.entityId
                );
                
                console.log('👤 Ticket User:', ticketUser);
                
                const ticketCode = ticketUser?.code || `TKT-${payment.id.slice(0, 8)}-${itemIndex}-${i}`;

                // Usar dados reais do evento
                // Se não houver data do evento, usar a data de pagamento como fallback
                const eventDate = event.date || ticket.lastDayPayment || payment.paymentDate;
                const eventTime = '20:00'; // Horário padrão

                const localTicket: LocalTicket = {
                  id: `${payment.id}-${ticket.id}-${itemIndex}-${i}`,
                  paymentReference: payment.reference,
                  eventName: event.title, // Nome real do evento
                  eventDate: new Date(eventDate).toLocaleDateString('pt-MZ'), // Data do evento
                  eventTime: eventTime,
                  eventLocation: event.location, // Local real do evento
                  ticketCode: ticketCode,
                  quantity: 1, // Cada ticket é individual
                  ticketType: ticket.name, // Nome do tipo de ticket (VIP, Normal, etc.)
                  price: cartItem.price,
                  purchaseDate: new Date(payment.paymentDate).toLocaleDateString('pt-MZ'),
                  status: getTicketStatus(payment.status),
                  qrCode: '',
                  paymentMethod: payment.method,
                  paymentStatus: payment.status,
                  originalData: {
                    paymentId: payment.id,
                    ticketId: ticket.id,
                    eventId: event.id,
                    type: ticket.type,
                    quantity: cartItem.quantity,
                    paymentDate: payment.paymentDate,
                    ticketUser: ticketUser,
                    event: event // Dados completos do evento
                  }
                };

                console.log('✅ Ticket criado:', localTicket.eventName);
                allTickets.push(localTicket);
              }
            });
          }
        });

        setSummary({
          totalTickets,
          confirmedTickets,
          pendingTickets,
          totalAmount
        });

        setLocalTickets(allTickets);
        
        console.log('📊 Resumo final:', {
          totalTickets,
          confirmedTickets,
          pendingTickets,
          totalAmount,
          ticketsCount: allTickets.length
        });
        
      } else if (result.success) {
        console.log('ℹ️ Nenhum pagamento encontrado na resposta');
        setApiPayments([]);
        setLocalTickets([]);
        setSummary({
          totalTickets: 0,
          confirmedTickets: 0,
          pendingTickets: 0,
          totalAmount: 0
        });
      } else {
        console.error('❌ Erro na resposta da API:', result.message);
        setError(result.message || 'Erro ao carregar bilhetes');
        setLocalTickets([]);
      }
    } catch (err) {
      console.error('💥 Erro inesperado:', err);
      setError('Erro inesperado ao carregar bilhetes');
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
    apiPayments,
    localTickets,
    summary,
    loadUserTickets,
    updateTicketQRCode
  };
}