'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';

interface CartItem {
  eventId: string;
  ticketId: string;
  eventTitle: string;
  ticketName: string;
  ticketType: string;
  price: number;
  quantity: number;
  eventImage: string;
  eventDate: string;
  eventLocation: string;
}

interface ButtonCartProps {
  event: {
    id: string;
    title: string;
    image: string;
    date: string;
    location: string;
  };
  selectedTicket: {
    id: string;
    name: string;
    type: string;
    price: number;
  } | null;
  ticketQuantity: number;
  onAddToCart?: (item: CartItem) => void;
}

export default function ButtonCart({ 
  event, 
  selectedTicket, 
  ticketQuantity,
  onAddToCart 
}: ButtonCartProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedTicket) return;
    
    setIsAdding(true);
    
    // Simular processo de adição
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const cartItem: CartItem = {
      eventId: event.id,
      ticketId: selectedTicket.id,
      eventTitle: event.title,
      ticketName: selectedTicket.name,
      ticketType: selectedTicket.type,
      price: selectedTicket.price,
      quantity: ticketQuantity,
      eventImage: event.image,
      eventDate: event.date,
      eventLocation: event.location
    };
    
    // Adicionar ao localStorage
    const existingCart = JSON.parse(localStorage.getItem('eventCart') || '[]');
    const existingItemIndex = existingCart.findIndex(
      (item: CartItem) => item.eventId === event.id && item.ticketId === selectedTicket.id
    );
    
    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += ticketQuantity;
    } else {
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('eventCart', JSON.stringify(existingCart));
    
    // Disparar evento customizado para atualizar o navbar
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Callback opcional
    if (onAddToCart) {
      onAddToCart(cartItem);
    }
    
    setIsAdding(false);
  };

  const isDisabled = !selectedTicket || selectedTicket.price === 0 || ticketQuantity === 0;

  return (
    <button
      onClick={handleAddToCart}
      disabled={isDisabled || isAdding}
      className="w-full py-4 bg-secondary text-secondary-foreground rounded-xl font-bold text-lg hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 border-2 border-transparent hover:border-secondary/30"
    >
      {isAdding ? (
        <>
          <div className="w-5 h-5 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
          Adicionando...
        </>
      ) : (
        <>
          <Plus className="w-5 h-5" />
          Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}