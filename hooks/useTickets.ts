// hooks/useTickets.ts
import { useState, useEffect } from 'react';
import { getUserTickets, type TicketInfo } from '@/lib/actions/user-tickets-actions';
import { LocalTicket } from '@/components/profile/QrModdal';

interface TicketSummary {
  totalTickets: number;
  confirmedTickets: number;
  pendingTickets: number;
  totalAmount: number;
}

export function useTickets(token: string | null) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiTickets, setApiTickets] = useState<TicketInfo[]>([]);
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
      
      const result = await getUserTickets(token);
      
      if (result.success && result.tickets && result.tickets.length > 0) {
        console.log('✅ Bilhetes carregados com sucesso:', result.tickets.length);
        
        setApiTickets(result.tickets);
        
        if (result.summary) {
          setSummary(result.summary);
        }
        
        // Converter para o formato local (sem QR Codes inicialmente)
        const convertedTickets: LocalTicket[] = result.tickets.map((ticket, index) => ({
          id: `${ticket.paymentId}-${ticket.ticketId}-${index}`,
          paymentReference: ticket.paymentReference,
          eventName: `Evento - ${ticket.name}`,
          eventDate: new Date(ticket.paymentDate).toLocaleDateString('pt-MZ'),
          eventTime: '20:00',
          eventLocation: 'Local do Evento',
          ticketCode: ticket.paymentReference || `TKT-${ticket.ticketId.slice(0, 8).toUpperCase()}`,
          ticketType: ticket.type.toUpperCase(),
          quantity: ticket.quantity ?? 1,
          price: ticket.totalPrice,
          purchaseDate: new Date(ticket.paymentDate).toLocaleDateString('pt-MZ'),
          status: getTicketStatus(ticket.paymentStatus),
          qrCode: '', // Inicialmente vazio - será gerado sob demanda
          paymentMethod: ticket.paymentMethod,
          paymentStatus: ticket.paymentStatus,
          originalData: ticket
        }));
        
        setLocalTickets(convertedTickets);
        
      } else if (result.success) {
        console.log('ℹ️ Nenhum bilhete encontrado');
        setApiTickets([]);
        setLocalTickets([]);
        setSummary({
          totalTickets: 0,
          confirmedTickets: 0,
          pendingTickets: 0,
          totalAmount: 0
        });
      } else {
        console.error('❌ Erro ao carregar bilhetes:', result.message);
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
    apiTickets,
    localTickets,
    summary,
    loadUserTickets,
    updateTicketQRCode
  };
}