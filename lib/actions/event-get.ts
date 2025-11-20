'use server';

import { revalidateTag } from 'next/cache';

// Tipos para os eventos
export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  province: string;
  location: string;
  img: string;
}

export interface EventsResponse {
  success: boolean;
  events: Event[];
}

/**
 * Action para buscar a lista de eventos da API
 */
export async function getEvents(): Promise<EventsResponse> {
  try {
    const API_URL = 'https://backend-eventos.unitec.academy/events';
    
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Adiciona cache com revalidação
      next: { 
        tags: ['events'],
        revalidate: 3600 // Revalida a cada hora
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar eventos: ${response.status}`);
    }

    const data: EventsResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Erro no getEvents:', error);
    throw new Error('Falha ao carregar eventos');
  }
}

/**
 * Action para buscar um evento específico por ID
 */
export async function getEventById(id: string): Promise<Event | null> {
  try {
    const events = await getEvents();
    
    const event = events.events.find(event => event.id === id);
    
    return event || null;
  } catch (error) {
    console.error('Erro no getEventById:', error);
    return null;
  }
}

/**
 * Action para forçar a revalidação da lista de eventos
 */
export async function revalidateEvents(): Promise<void> {
  revalidateTag('events');
}

/**
 * Action para buscar eventos filtrados por província
 */
export async function getEventsByProvince(province: string): Promise<Event[]> {
  try {
    const events = await getEvents();
    
    const filteredEvents = events.events.filter(event => 
      event.province.toLowerCase().includes(province.toLowerCase())
    );
    
    return filteredEvents;
  } catch (error) {
    console.error('Erro no getEventsByProvince:', error);
    return [];
  }
}

/**
 * Action para buscar eventos futuros
 */
export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const events = await getEvents();
    const now = new Date().toISOString();
    
    const upcomingEvents = events.events.filter(event => 
      event.startDate > now
    ).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    return upcomingEvents;
  } catch (error) {
    console.error('Erro no getUpcomingEvents:', error);
    return [];
  }
}

/**
 * Action para buscar eventos em andamento
 */
export async function getCurrentEvents(): Promise<Event[]> {
  try {
    const events = await getEvents();
    const now = new Date().toISOString();
    
    const currentEvents = events.events.filter(event => 
      event.startDate <= now && event.endDate >= now
    );
    
    return currentEvents;
  } catch (error) {
    console.error('Erro no getCurrentEvents:', error);
    return [];
  }
}