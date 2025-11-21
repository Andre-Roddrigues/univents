// components/CartTicket.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  Ticket,
  CheckCircle
} from 'lucide-react';

export interface CartItem {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketName: string;
  ticketType: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  benefits: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface CartTicketProps {
  onCheckout: (items: CartItem[]) => void;
  onUpdateCart: (items: CartItem[]) => void;
}

export default function CartTicket({ onCheckout, onUpdateCart }: CartTicketProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Carregar itens do localStorage ao inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('eventCart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        setCartItems(items);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
        localStorage.removeItem('eventCart');
      }
    }
  }, []);

  // Atualizar localStorage quando o carrinho mudar
  useEffect(() => {
    localStorage.setItem('eventCart', JSON.stringify(cartItems));
    onUpdateCart(cartItems);
  }, [cartItems, onUpdateCart]);

  // Adicionar item ao carrinho
  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && cartItem.eventId === item.eventId
      );

      if (existingItem) {
        // Se já existe, aumenta a quantidade se houver disponibilidade
        if (existingItem.quantity < existingItem.availableQuantity) {
          return prev.map(cartItem =>
            cartItem.id === item.id && cartItem.eventId === item.eventId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return prev;
      } else {
        // Adiciona novo item com quantidade 1
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    setIsOpen(true);
  };

  // Remover item do carrinho
  const removeFromCart = (itemId: string, eventId: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === itemId && item.eventId === eventId)
    ));
  };

  // Atualizar quantidade
  const updateQuantity = (itemId: string, eventId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId && item.eventId === eventId) {
          // Garantir que não exceda a quantidade disponível
          const quantity = Math.min(newQuantity, item.availableQuantity);
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
  };

  // Calcular total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calcular total de itens
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Função de checkout
  const handleCheckout = () => {
    onCheckout(cartItems);
    // Não limpa o carrinho automaticamente - a página de checkout decide
  };

  return (
    <div className="relative">
      {/* Botão do Carrinho */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors shadow-lg"
      >
        <ShoppingCart className="w-6 h-6" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Dropdown do Carrinho */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl z-50"
        >
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Meu Carrinho
              </h3>
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpar Tudo
                </button>
              )}
            </div>

            {/* Lista de Itens */}
            <div className="max-h-80 overflow-y-auto">
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Seu carrinho está vazio
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={`${item.eventId}-${item.id}`}
                      className="bg-muted/50 rounded-lg p-3 border border-border"
                    >
                      {/* Informações do Evento */}
                      <div className="mb-2">
                        <h4 className="font-medium text-foreground text-sm line-clamp-1">
                          {item.eventTitle}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {item.ticketName} • {item.ticketType}
                        </p>
                      </div>

                      {/* Preço e Quantidade */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.eventId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          
                          <span className="text-sm font-medium text-foreground min-w-6 text-center">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.id, item.eventId, item.quantity + 1)}
                            disabled={item.quantity >= item.availableQuantity}
                            className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">
                            {(item.price * item.quantity).toLocaleString('pt-MZ', {
                              style: 'currency',
                              currency: 'MZN'
                            })}
                          </span>
                          
                          <button
                            onClick={() => removeFromCart(item.id, item.eventId)}
                            className="w-6 h-6 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Benefícios */}
                      {item.benefits.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              {item.benefits.slice(0, 2).map((benefit, index) => (
                                <p key={index} className="text-xs text-muted-foreground line-clamp-1">
                                  {benefit.name}
                                </p>
                              ))}
                              {item.benefits.length > 2 && (
                                <p className="text-xs text-muted-foreground">
                                  +{item.benefits.length - 2} mais
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-foreground">Total:</span>
                  <span className="text-lg font-bold text-primary">
                    {calculateTotal().toLocaleString('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN'
                    })}
                  </span>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-2 px-4 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Continuar Comprando
                  </button>
                  
                  <button
                    onClick={handleCheckout}
                    className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Finalizar
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Overlay para fechar ao clicar fora */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// Hook para usar o carrinho em outros componentes
export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('eventCart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && cartItem.eventId === item.eventId
      );

      if (existingItem) {
        if (existingItem.quantity < existingItem.availableQuantity) {
          return prev.map(cartItem =>
            cartItem.id === item.id && cartItem.eventId === item.eventId
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        return prev;
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId: string, eventId: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.id === itemId && item.eventId === eventId)
    ));
  };

  const updateQuantity = (itemId: string, eventId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId && item.eventId === eventId) {
          return { ...item, quantity: Math.min(quantity, item.availableQuantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    calculateTotal,
    totalItems
  };
}