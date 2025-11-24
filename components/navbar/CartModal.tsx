'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingCart, Trash2, Plus, Minus, Calendar,
  MapPin, Ticket, RefreshCw, Loader
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { listCarts, updateCart, deleteCart } from '@/lib/actions/cart-actions';

// Tipos atualizados conforme o backend
interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  price: number;
  totalProductDiscount: number | null;
  ticket?: {
    id: string;
    name: string;
    type: string;
    event?: {
      id: string;
      title: string;
      img: string;
      startDate: string;
      location: string;
      province: string;
    };
  };
}

interface Cart {
  id: string;
  discount: number | null;
  totalPriceAftertDiscount: number | null;
  totalPrice: number;
  userId: string;
  cartItems: CartItem[];
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [deletingCart, setDeletingCart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ===========================================
  // 🔄 Carregar listas de carrinhos
  // ===========================================
  useEffect(() => {
    if (isOpen) {
      loadCarts();
    }
  }, [isOpen]);

  const loadCarts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await listCarts();

      // handle both response shapes: some APIs return { data: { carts } } and others return { carts }
      const cartsPayload = (result as any).data?.carts ?? (result as any).carts;

      if (result.success && cartsPayload) {
        setCarts(cartsPayload);
      } else {
        setError((result as any).message || "Erro ao carregar carrinhos");
      }
    } catch (err) {
      console.error("Erro ao carregar carrinhos:", err);
      setError("Erro ao carregar carrinhos");
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // 🔄 Atualizar quantidade de um item
  // ===========================================
  const updateCartItem = async (cartId: string, itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setUpdatingItem(itemId);

    try {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) return;

      const updatedItems = cart.cartItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      const payload = {
        items: updatedItems.map(item => ({
          ticketId: item.ticketId,
          quantity: item.quantity.toString()
        }))
      };

      const result = await updateCart(cartId, payload);

      if (result.success) {
        await loadCarts();
      } else {
        setError(result.message || "Erro ao atualizar item");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar item do carrinho");
    } finally {
      setUpdatingItem(null);
    }
  };

  // ===========================================
  // ❌ Remover item ou carrinho
  // ===========================================
  const removeCartItem = async (cartId: string, itemId: string) => {
    setUpdatingItem(itemId);

    try {
      const cart = carts.find(c => c.id === cartId);
      if (!cart) return;

      if (cart.cartItems.length === 1) {
        await removeCart(cartId);
        return;
      }

      const updatedItems = cart.cartItems.filter(i => i.id !== itemId);

      const payload = {
        items: updatedItems.map(item => ({
          ticketId: item.ticketId,
          quantity: item.quantity.toString()
        }))
      };

      const result = await updateCart(cartId, payload);

      if (result.success) {
        await loadCarts();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao remover item");
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeCart = async (cartId: string) => {
    setDeletingCart(cartId);

    try {
      const result = await deleteCart(cartId);

      if (result.success) {
        await loadCarts();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao remover carrinho");
    } finally {
      setDeletingCart(null);
    }
  };

  // ===========================================
  // 🧮 Totais
  // ===========================================
  const getTotalItems = () => {
    return carts.reduce(
      (t, c) => t + c.cartItems.reduce((i, v) => i + v.quantity, 0),
      0
    );
  };

  const getTotalPrice = () => {
    return carts.reduce((t, c) => t + c.totalPrice, 0);
  };

  const handleCheckout = () => {
    onClose();
    router.push('/checkout');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("pt-MZ");

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-MZ", { style: "currency", currency: "MZN" });

  // ===========================================
  // 🖥 RENDER
  // ===========================================
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
            transition={{ type: "spring", damping: 30 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background z-50 shadow-xl"
          >
            <div className="flex flex-col h-full">

              {/* HEADER */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold">Meus Carrinhos</h2>
                    {carts.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {getTotalItems()} itens no total
                      </p>
                    )}
                  </div>
                </div>

                <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                  <X />
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader className="w-8 h-8 animate-spin" />
                  </div>
                ) : carts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold">Nenhum carrinho encontrado</h3>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {carts.map((cart, idx) => (
                      <motion.div
                        key={cart.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card border rounded-lg p-4"
                      >
                        <div className="flex justify-between mb-4">
                          <h3 className="font-semibold">Carrinho {idx + 1}</h3>
                          <button
                            className="text-red-500"
                            onClick={() => removeCart(cart.id)}
                          >
                            <Trash2 />
                          </button>
                        </div>

                        {cart.cartItems.map(item => (
                          <div
                            key={item.id}
                            className="flex gap-3 bg-muted/20 p-3 rounded-lg"
                          >
                            <img
                              src={item.ticket?.event?.img || "/placeholder-event.jpg"}
                              className="w-12 h-12 rounded"
                            />

                            <div className="flex-1">

                              <h4 className="text-sm font-medium">
                                {item.ticket?.event?.title || "Evento"}
                              </h4>

                              {/* Infos */}
                              {item.ticket?.event && (
                                <>
                                  <div className="text-xs flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDate(item.ticket.event.startDate)}
                                  </div>

                                  <div className="text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {item.ticket.event.location}, {item.ticket.event.province}
                                  </div>
                                </>
                              )}

                              <div className="flex justify-between mt-2">
                                <div>
                                  <div className="text-sm font-bold">
                                    {formatCurrency(item.quantity * item.price)}
                                  </div>
                                </div>

                                {/* Quantidade */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateCartItem(cart.id, item.id, item.quantity - 1)}
                                    disabled={updatingItem === item.id}
                                    className="p-1 border rounded"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span>{item.quantity}</span>
                                  <button
                                    onClick={() => updateCartItem(cart.id, item.id, item.quantity + 1)}
                                    disabled={updatingItem === item.id}
                                    className="p-1 border rounded"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>

                                  <button
                                    onClick={() => removeCartItem(cart.id, item.id)}
                                    className="text-red-500"
                                  >
                                    <Trash2 />
                                  </button>
                                </div>
                              </div>

                            </div>
                          </div>
                        ))}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              {carts.length > 0 && !loading && (
                <div className="border-t p-6">
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span>Total Geral:</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-primary text-white rounded-lg"
                  >
                    Finalizar Compra
                  </button>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
