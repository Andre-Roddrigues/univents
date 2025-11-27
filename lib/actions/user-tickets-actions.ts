"use server";

import { routes } from "@/config/routes";

export interface TicketInfo {
  // Dados do bilhete
  ticketId: string;
  name: string;
  type: string;
  unitPrice: number; // Preço unitário do bilhete
  quantity: number;  // Quantidade comprada
  eventId: string;

  // Dados do pagamento
  paymentId: string;
  paymentMethod: string; // "mpesa" ou "tranference"
  paymentStatus: string; // "confirmed" ou "pending"
  paymentDate: string;
  paymentReference: string | null;
  paymentAmount: number; // Valor total do pagamento

  // Dados calculados
  totalPrice: number; // unitPrice * quantity
  isConfirmed: boolean; // paymentStatus === "confirmed"
  isPending: boolean;   // paymentStatus === "pending"
}

export interface UserTicketResponse {
  success: boolean;
  tickets: TicketInfo[];
  message?: string;
  summary?: {
    totalTickets: number;
    confirmedTickets: number;
    pendingTickets: number;
    totalAmount: number;
  };
}

export async function getUserTickets(token: string): Promise<UserTicketResponse> {
  try {
    if (!token) {
      return { 
        success: false, 
        tickets: [],
        message: "Token de autenticação não fornecido" 
      };
    }

    console.log("🎫 Buscando tickets do usuário...");

    const response = await fetch(routes.payments_user_list, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store"
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erro HTTP ${response.status}:`, errorText);
      
      return { 
        success: false, 
        tickets: [],
        message: `Erro ao buscar tickets: ${response.status}` 
      };
    }

    const data = await response.json();
    console.log("✅ Resposta da API recebida");

    if (!data?.payments) {
      return { 
        success: false, 
        tickets: [],
        message: "Formato de resposta inválido" 
      };
    }

    // Filtrar apenas pagamentos válidos para tickets
    const validPayments = data.payments.filter(
      (p: any) => p.method && p.itemName === "tickets" && p.cart?.cartItems
    );

    console.log(`📊 ${validPayments.length} pagamentos válidos encontrados`);

    // Processar tickets
    const tickets: TicketInfo[] = validPayments.flatMap((payment: any) =>
      payment.cart.cartItems.map((item: any) => {
        const unitPrice = item.ticket?.price || 0;
        const quantity = item.quantity || 1;
        const totalPrice = unitPrice * quantity;
        const isConfirmed = payment.status === "confirmed";
        const isPending = payment.status === "pending";

        return {
          // Dados do bilhete
          ticketId: item.ticket?.id || 'unknown',
          name: item.ticket?.name || 'Bilhete sem nome',
          type: item.ticket?.type || 'standard',
          unitPrice: unitPrice,
          quantity: quantity,
          eventId: item.ticket?.eventId || 'unknown',

          // Dados do pagamento
          paymentId: payment.id,
          paymentMethod: payment.method,
          paymentStatus: payment.status,
          paymentDate: payment.paymentDate,
          paymentReference: payment.reference,
          paymentAmount: payment.amount,

          // Dados calculados
          totalPrice: totalPrice,
          isConfirmed: isConfirmed,
          isPending: isPending
        };
      })
    );

    // Calcular resumo
    const summary = {
      totalTickets: tickets.reduce((sum, ticket) => sum + ticket.quantity, 0),
      confirmedTickets: tickets
        .filter(ticket => ticket.isConfirmed)
        .reduce((sum, ticket) => sum + ticket.quantity, 0),
      pendingTickets: tickets
        .filter(ticket => ticket.isPending)
        .reduce((sum, ticket) => sum + ticket.quantity, 0),
      totalAmount: tickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0)
    };

    console.log(`🎯 ${tickets.length} tickets processados`);
    console.log(`📈 Resumo:`, summary);

    return { 
      success: true, 
      tickets,
      summary
    };
  } catch (error) {
    console.error("💥 Erro ao buscar tickets:", error);
    return { 
      success: false, 
      tickets: [],
      message: "Erro de conexão com o servidor" 
    };
  }
}