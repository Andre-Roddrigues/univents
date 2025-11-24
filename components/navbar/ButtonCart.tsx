'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { createCart } from '@/lib/actions/cart-actions';

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
  onAddToCart?: (success: boolean) => void;
}

export default function ButtonCart({ 
  event, 
  selectedTicket, 
  ticketQuantity,
  onAddToCart 
}: ButtonCartProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAddToCart = async () => {
    if (!selectedTicket) return;
    
    setIsAdding(true);
    
    try {
      // Preparar payload para a API
      const cartPayload = {
        items: [
          {
            ticketId: selectedTicket.id,
            quantity: ticketQuantity.toString()
          }
        ]
      };

      console.log('🛒 Enviando para API:', cartPayload);

      // Chamar a action do servidor
      const result = await createCart(cartPayload);

      if (result.success) {
        console.log('✅ Carrinho criado na API:', result.data);
        
        // Disparar evento customizado para atualizar o modal
        window.dispatchEvent(new Event('cartUpdated'));
        
        // Callback opcional
        if (onAddToCart) {
          onAddToCart(true);
        }
        
        // Mostrar feedback
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 3000);
      } else {
        console.error('❌ Erro ao criar carrinho na API:', result.message);
        if (onAddToCart) {
          onAddToCart(false);
        }
      }
    } catch (error) {
      console.error('💥 Erro ao adicionar ao carrinho:', error);
      if (onAddToCart) {
        onAddToCart(false);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = !selectedTicket || selectedTicket.price === 0 || ticketQuantity === 0;

  return (
    <>
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

      {/* Feedback de adição ao carrinho */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-center"
        >
          ✅ Adicionado ao carrinho!
        </motion.div>
      )}
    </>
  );
}