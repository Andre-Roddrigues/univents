'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus,
  Calendar,
  MapPin,
  Ticket
} from 'lucide-react';
import { useRouter } from 'next/navigation';

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

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    loadCartItems();
    
    // Ouvir eventos de atualização do carrinho
    const handleCartUpdate = () => loadCartItems();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const loadCartItems = () => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('eventCart');
      setCartItems(storedCart ? JSON.parse(storedCart) : []);
    }
  };

  const updateQuantity = (eventId: string, ticketId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems.map(item =>
      item.eventId === eventId && item.ticketId === ticketId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('eventCart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (eventId: string, ticketId: string) => {
    const updatedCart = cartItems.filter(
      item => !(item.eventId === eventId && item.ticketId === ticketId)
    );
    
    setCartItems(updatedCart);
    localStorage.setItem('eventCart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('eventCart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  if (!isClient) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-bold text-foreground">
                    Meu Carrinho
                    {cartItems.length > 0 && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'})
                      </span>
                    )}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Carrinho vazio
                    </h3>
                    <p className="text-muted-foreground">
                      Adicione bilhetes ao seu carrinho
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={`${item.eventId}-${item.ticketId}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-lg p-4"
                      >
                        <div className="flex gap-4">
                          <img
                            src={item.eventImage}
                            alt={item.eventTitle}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm leading-tight mb-1">
                              {item.eventTitle}
                            </h4>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(item.eventDate).toLocaleDateString('pt-MZ')}
                            </div>
                            
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                              <MapPin className="w-3 h-3" />
                              {item.eventLocation}
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Ticket className="w-3 h-3 text-primary" />
                                  <span className="text-sm font-medium text-foreground">
                                    {item.ticketName}
                                  </span>
                                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                                    {item.ticketType}
                                  </span>
                                </div>
                                <div className="text-sm font-bold text-foreground mt-1">
                                  {(item.price * item.quantity).toLocaleString('pt-MZ', {
                                    style: 'currency',
                                    currency: 'MZN'
                                  })}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <div className="flex items-center border border-border rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.eventId, item.ticketId, item.quantity - 1)}
                                    className="p-1 hover:bg-muted transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 text-sm font-medium min-w-8 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.eventId, item.ticketId, item.quantity + 1)}
                                    className="p-1 hover:bg-muted transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                
                                <button
                                  onClick={() => removeItem(item.eventId, item.ticketId)}
                                  className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span>
                      {getTotalPrice().toLocaleString('pt-MZ', {
                        style: 'currency',
                        currency: 'MZN'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={clearCart}
                      className="flex-1 py-3 px-4 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
                    >
                      Limpar
                    </button>
                    <button
                      onClick={handleCheckout}
                      className="flex-1 py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold"
                    >
                      Finalizar Compra
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}