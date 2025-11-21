// components/CartModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2,
  Ticket,
  CheckCircle,
  X,
  CreditCard
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

interface CartModalProps {
  onCheckout: (items: CartItem[]) => void;
  onUpdateCart: (items: CartItem[]) => void;
}

export default function CartModal({ onCheckout, onUpdateCart }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Adicionar item ao carrinho (pode ser chamado de outros componentes)
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
    setIsModalOpen(true); // Abre o modal ao adicionar item
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
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Botão do Carrinho */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="relative p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-lg flex items-center gap-2"
      >
        <ShoppingCart className="w-5 h-5" />
        <span className="hidden sm:inline">Carrinho</span>
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Modal do Carrinho */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-card rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6" />
                  Meu Carrinho de Eventos
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Conteúdo */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Carrinho Vazio
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Adicione bilhetes de eventos ao seu carrinho
                    </p>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      Explorar Eventos
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={`${item.eventId}-${item.id}`}
                        className="bg-muted/50 rounded-lg p-4 border border-border"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">
                              {item.eventTitle}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {item.ticketName} • {item.ticketType}
                            </p>
                            <p className="text-lg font-bold text-primary mt-2">
                              {(item.price * item.quantity).toLocaleString('pt-MZ', {
                                style: 'currency',
                                currency: 'MZN'
                              })}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id, item.eventId)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Quantidade */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">Quantidade:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.eventId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              
                              <span className="text-lg font-medium text-foreground min-w-8 text-center">
                                {item.quantity}
                              </span>
                              
                              <button
                                onClick={() => updateQuantity(item.id, item.eventId, item.quantity + 1)}
                                disabled={item.quantity >= item.availableQuantity}
                                className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-50 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <span className="text-sm text-muted-foreground">
                            Disponível: {item.availableQuantity}
                          </span>
                        </div>

                        {/* Benefícios */}
                        {item.benefits.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <h5 className="text-sm font-medium text-foreground mb-2">
                              Benefícios:
                            </h5>
                            <div className="space-y-1">
                              {item.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                  <span className="text-foreground">{benefit.name}</span>
                                </div>
                              ))}
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
                <div className="border-t border-border p-6 bg-muted/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total de itens: {totalItems}
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {calculateTotal().toLocaleString('pt-MZ', {
                          style: 'currency',
                          currency: 'MZN'
                        })}
                      </p>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={clearCart}
                        className="px-4 py-2 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                      >
                        Limpar Carrinho
                      </button>
                      
                      <button
                        onClick={handleCheckout}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                      >
                        <CreditCard className="w-4 h-4" />
                        Finalizar Compra
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Exportar a função addToCart para uso externo