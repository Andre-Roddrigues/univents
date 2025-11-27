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

// lib/actions/user-tickets-actions.ts
export async function getUserTickets(token: string): Promise<any> {
  try {
    console.log('🔐 Fazendo request com token:', token ? 'Token presente' : 'Token ausente');
    
    const response = await fetch(routes.payments_user_list, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();
    console.log('📦 Dados recebidos:', data);
    
    return data;
  } catch (error) {
    console.error('💥 Erro ao buscar tickets do usuário:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}