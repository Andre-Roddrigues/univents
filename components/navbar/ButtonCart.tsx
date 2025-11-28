'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { addToCart } from '@/lib/actions/cart-actions';

// Interface para os itens do carrinho
interface CartItem {
  ticketId: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  benefits: Array<{
    id: string;
    name: string;
    description: string;
    icon: string | null;
  }>;
}

interface ButtonCartProps {
  event: {
    id: string;
    title: string;
    image: string;
    date: string;
    location: string;
  };
  cartItems: CartItem[];
  onAddToCart?: (success: boolean) => void;
}

export default function ButtonCart({ 
  event, 
  cartItems,
  onAddToCart 
}: ButtonCartProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAddToCart = async () => {
    if (cartItems.length === 0) return;
    
    setIsAdding(true);
    
    try {
      // Preparar payload para a API com múltiplos itens
      const cartPayload = {
        items: cartItems
      };

      console.log('🛒 Enviando para API (múltiplos itens):', cartPayload);
      console.log('📦 Itens detalhados:', cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity
      })));

      // 🔥 USAR addToCart EM VEZ DE createCart
      // Esta função verifica se já existe carrinho e atualiza os itens
      const result = await addToCart(cartPayload);

      if (result.success) {
        console.log('✅ Carrinho atualizado na API:', result.data);
        
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
        console.error('❌ Erro ao atualizar carrinho na API:', result.message);
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

  // Calcular total de itens e valor
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalValue = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const isDisabled = cartItems.length === 0 || totalItems === 0;

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
            {cartItems.some(item => item.quantity > 0) ? 'Atualizando...' : 'Adicionando...'}
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            {totalItems > 0 ? (
              cartItems.some(item => item.quantity > 0) ? (
                `Atualizar ${totalItems} Item${totalItems > 1 ? 's' : ''} - ${totalValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}`
              ) : (
                `Adicionar ${totalItems} Item${totalItems > 1 ? 's' : ''} - ${totalValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}`
              )
            ) : (
              'Adicionar ao Carrinho'
            )}
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
          {cartItems.some(item => item.quantity > 0) ? '✅ Carrinho atualizado!' : '✅ Itens adicionados ao carrinho!'}
          <div className="text-sm mt-2 space-y-1">
            {cartItems.map((item) => (
              item.quantity > 0 && (
                <div key={item.ticketId} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>× {item.quantity}</span>
                </div>
              )
            ))}
          </div>
          <div className="text-sm font-semibold mt-2">
            Total: {totalValue.toLocaleString('pt-MZ', { style: 'currency', currency: 'MZN' })}
          </div>
        </motion.div>
      )}
    </>
  );
}