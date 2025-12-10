// lib/actions/user-tickets-actions.ts
"use server";

import { routes } from '@/config/routes';
import { cookies } from 'next/headers';

// Interfaces...
interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  img: string;
  province: string;
}

interface Ticket {
  id: string;
  name: string;
  type: string;
  price: number;
  expiresAt: string;
  eventId: string;
  event: Event;
}

interface PaymentItem {
  id: string;
  userId: string;
  ticketId: string;
  code: string;
  ticket: Ticket;
}

interface ApiResponse {
  success: boolean;
  items: PaymentItem[];
}

// Função para obter o token
function getToken(): string {
  return cookies().get("token")?.value || "";
}

// Função principal para obter os tickets do usuário - Server Action
export async function getUserTickets(): Promise<ApiResponse> {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Token não encontrado. Por favor, faça login novamente.');
    }

    const response = await fetch(routes.payments_user_list, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
    }

    const data: ApiResponse = await response.json();
    
    if (!data.success) {
      throw new Error('Falha ao obter tickets');
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar tickets do usuário:', error);
    
    return {
      success: false,
      items: []
    };
  }
}