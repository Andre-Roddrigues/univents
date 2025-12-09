'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ShoppingCart, Trash2, Plus, Minus,
  Ticket, RefreshCw, Loader, Ban, LogIn
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { listCarts } from '@/lib/actions/cart-actions';
// Importar as actions de update e remove
import { updateCartItems, removeCartItems } from '@/lib/actions/cart-update-actions';

// Tipos conforme o backend
interface CartItem {
  id: string;
  ticketId: string;
  quantity: number;
  price: number;
  totalProductDiscount: number | null;
}

interface Cart {
  id: string;
  discount: number | null;
  totalPriceAftertDiscount: number | null;
  totalPrice: number;
  userId: string;
  status: 'pending' | 'paid' | 'canceled';
  cartItems: CartItem[];
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [filteredCarts, setFilteredCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [deletingCart, setDeletingCart] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // ===========================================
  // 🔄 Carregar carrinhos
  // ===========================================
  useEffect(() => {
    if (isOpen) {
      loadCarts();
    }
  }, [isOpen]);

  // Filtrar carrinhos baseado no status
  useEffect(() => {
    if (carts.length > 0) {
      const validCarts = carts.filter(cart => cart.status === 'pending');
      setFilteredCarts(validCarts);
    } else {
      setFilteredCarts([]);
    }
  }, [carts]);

  const loadCarts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await listCarts();

      if (result.success && Array.isArray(result.carts)) {
        setCarts(result.carts);
      } else {
        // Verificar se é erro de autenticação
        if (result.message?.includes('Token não fornecido') || result.message?.includes('401')) {
          setError("Sem sessão iniciada");
        } else {
          setError(result.message || "Erro ao carregar carrinhos");
        }
        setCarts([]);
      }
    } catch (err: any) {
      console.error("Erro ao carregar carrinhos:", err);
      
      // Verificar se é erro de autenticação
      if (err.message?.includes('Token não fornecido') || err.message?.includes('401') || err.response?.status === 401) {
        setError("Sem sessão iniciada");
      } else {
        setError("Erro ao carregar carrinhos");
      }
      setCarts([]);
    } finally {
      setLoading(false);
    }
  };

  // ===========================================
  // 🔄 Atualizar quantidade de um item
  // ===========================================
  const updateCartItem = async (cartId: string, itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Se quantidade for menor que 1, remove o item
      await removeCartItemFromCart(cartId, itemId);
      return;
    }

    try {
      setUpdatingItem(itemId);
      setError(null);

      // Encontrar o item específico no carrinho
      const cart = carts.find(c => c.id === cartId);
      if (!cart) {
        throw new Error('Carrinho não encontrado');
      }

      const item = cart.cartItems.find(i => i.id === itemId);
      if (!item) {
        throw new Error('Item não encontrado');
      }

      // CORREÇÃO: Calcular a diferença (delta) ao invés de enviar a quantidade total
      const quantityDifference = newQuantity - item.quantity;

      // Se a diferença for 0, não faz nada
      if (quantityDifference === 0) {
        setUpdatingItem(null);
        return;
      }

      // Preparar o payload para a API com a DIFERENÇA
      const updatePayload = [
        {
          ticketId: item.ticketId,
          quantity: Math.abs(quantityDifference) // Sempre positivo
        }
      ];

      let result;
      if (quantityDifference > 0) {
        // Se aumentando, usar updateCartItems
        result = await updateCartItems(cartId, updatePayload);
      } else {
        // Se diminuindo, usar removeCartItems
        result = await removeCartItems(cartId, updatePayload);
      }

      if (result.success) {
        // Atualizar o estado local com a nova quantidade
        setCarts(prevCarts => 
          prevCarts.map(cart => {
            if (cart.id === cartId) {
              const updatedCartItems = cart.cartItems.map(item => 
                item.id === itemId 
                  ? { ...item, quantity: newQuantity }
                  : item
              );

              const newTotalPrice = updatedCartItems.reduce((total, item) => {
                return total + (item.price * item.quantity);
              }, 0);

              return {
                ...cart,
                cartItems: updatedCartItems,
                totalPrice: newTotalPrice
              };
            }
            return cart;
          })
        );
      } else {
        setError(result.message || "Erro ao atualizar item");
      }
    } catch (err: any) {
      console.error("Erro ao atualizar item:", err);
      setError("Erro ao atualizar item no carrinho");
    } finally {
      setUpdatingItem(null);
    }
  };

  // ===========================================
  // 🗑️ Remover item específico do carrinho
  // ===========================================
  const removeCartItem = async (cartId: string, itemId: string) => {
    try {
      setRemovingItem(itemId);
      setError(null);

      // Encontrar o item específico no carrinho
      const cart = carts.find(c => c.id === cartId);
      if (!cart) {
        throw new Error('Carrinho não encontrado');
      }

      const item = cart.cartItems.find(i => i.id === itemId);
      if (!item) {
        throw new Error('Item não encontrado');
      }

      // Preparar o payload para a API
      const removePayload = [
        {
          ticketId: item.ticketId,
          quantity: item.quantity // Enviar a quantidade atual para remoção completa
        }
      ];

      // Chamar a action de remove
      const result = await removeCartItems(cartId, removePayload);

      if (result.success) {
        // Atualizar o estado local
        setCarts(prevCarts => 
          prevCarts.map(cart => {
            if (cart.id === cartId) {
              const updatedCartItems = cart.cartItems.filter(item => item.id !== itemId);
              const newTotalPrice = updatedCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
              
              return {
                ...cart,
                cartItems: updatedCartItems,
                totalPrice: newTotalPrice
              };
            }
            return cart;
          })
        );
      } else {
        setError(result.message || "Erro ao remover item");
      }
    } catch (err: any) {
      console.error("Erro ao remover item:", err);
      setError("Erro ao remover item do carrinho");
    } finally {
      setRemovingItem(null);
    }
  };

  // Função auxiliar para remover item quando quantidade chegar a 0
  const removeCartItemFromCart = async (cartId: string, itemId: string) => {
    await removeCartItem(cartId, itemId);
  };

  // ===========================================
  // 🗑️ Remover carrinho completo
  // ===========================================
  const removeCart = async (cartId: string) => {
    try {
      setDeletingCart(cartId);
      setError(null);

      // Encontrar o carrinho
      const cart = carts.find(c => c.id === cartId);
      if (!cart) {
        throw new Error('Carrinho não encontrado');
      }

      // Preparar payload para remover todos os items do carrinho
      const removePayload = cart.cartItems.map(item => ({
        ticketId: item.ticketId,
        quantity: item.quantity
      }));

      // Chamar a action de remove para todos os items
      const result = await removeCartItems(cartId, removePayload);

      if (result.success) {
        // Remover o carrinho do estado local
        setCarts(prevCarts => prevCarts.filter(cart => cart.id !== cartId));
      } else {
        setError(result.message || "Erro ao remover carrinho");
      }
    } catch (err: any) {
      console.error("Erro ao remover carrinho:", err);
      setError("Erro ao remover carrinho");
    } finally {
      setDeletingCart(null);
    }
  };

  // ===========================================
  // 🔐 Funções de autenticação
  // ===========================================
  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  const handleSignup = () => {
    onClose();
    router.push('/register');
  };

  // ===========================================
  // 🧮 Totais (apenas para carrinhos pending)
  // ===========================================
  const getTotalItems = () => {
    return filteredCarts.reduce(
      (total, cart) => total + cart.cartItems.reduce((cartTotal, item) => cartTotal + item.quantity, 0),
      0
    );
  };

  const getTotalPrice = () => {
    return filteredCarts.reduce((total, cart) => total + cart.totalPrice, 0);
  };

  // Contar carrinhos por status
  const getCartStatusCounts = () => {
    const paidCarts = carts.filter(cart => cart.status === 'paid').length;
    const canceledCarts = carts.filter(cart => cart.status === 'canceled').length;
    const pendingCarts = filteredCarts.length;

    return { paidCarts, canceledCarts, pendingCarts };
  };

  const handleCheckout = () => {
    onClose();
    if (filteredCarts.length === 1) {
      router.push(`/eventos/checkout/${filteredCarts[0].id}`);
    } else {
      router.push('/eventos/checkout');
    }
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-MZ", { 
      style: "currency", 
      currency: "MZN" 
    });
  };

  // Função para gerar nome do ticket baseado no preço (fallback)
  const getTicketDisplayInfo = (price: number, ticketId: string) => {
    // Baseado no preço, podemos inferir o tipo de bilhete
    if (price >= 9000) return { name: "Bilhete VIP", type: "vip" };
    if (price >= 5000) return { name: "Bilhete Normal", type: "normal" };
    return { name: `Bilhete ${ticketId.slice(0, 8)}`, type: "standard" };
  };

  // ===========================================
  // 🖥 RENDER
  // ===========================================
  const statusCounts = getCartStatusCounts();

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
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Meu Carrinho</h2>
                    {filteredCarts.length > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'} • {formatCurrency(getTotalPrice())}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {statusCounts.pendingCarts === 0 ? 'Nenhum carrinho ativo' : 'Carregando...'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadCarts}
                    disabled={loading}
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                    title="Recarregar"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                  <button 
                    onClick={onClose} 
                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    {error === "Sem sessão iniciada" ? (
                      // Estado de não autenticado
                      <div className="space-y-6">
                        <div className="text-red-500 mb-4">
                          <Ban className="w-16 h-16 mx-auto mb-2" />
                          <p className="text-lg font-semibold">Sem sessão iniciada</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Faça login para acessar seu carrinho
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            onClick={handleLogin}
                            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold flex items-center justify-center gap-2"
                          >
                            <LogIn className="w-5 h-5" />
                            Fazer Login
                          </button>
                          
                          <button
                            onClick={handleSignup}
                            className="w-full py-3 px-4 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-bold"
                          >
                            Criar Conta
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Outros erros
                      <>
                        <div className="text-red-500 mb-4">❌ {error}</div>
                        <button
                          onClick={loadCarts}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Tentar Novamente
                        </button>
                      </>
                    )}
                  </div>
                ) : filteredCarts.length === 0 ? (
                  <div className="text-center py-8">
                    {/* Informações sobre outros status */}
                    {(statusCounts.paidCarts > 0 || statusCounts.canceledCarts > 0) && (
                      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2 text-sm">
                          {/* Informações opcionais sobre outros carrinhos */}
                        </div>
                      </div>
                    )}

                    {/* Estado vazio */}
                    <div className="py-8">
                      <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {carts.length === 0 ? 'Carrinho vazio' : 'Nenhum carrinho ativo'}
                      </h3>
                      <p className="text-muted-foreground">
                        {carts.length === 0 
                          ? 'Adicione bilhetes ao seu carrinho' 
                          : 'Todos os carrinhos estão finalizados ou cancelados'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredCarts.map((cart, index) => (
                      <motion.div
                        key={cart.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-lg p-4"
                      >
                        {/* Cabeçalho do Carrinho */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              Carrinho 
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {cart.cartItems.length} {cart.cartItems.length === 1 ? 'item' : 'itens'} • {formatCurrency(cart.totalPrice)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeCart(cart.id)}
                            disabled={deletingCart === cart.id}
                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                            title="Remover carrinho"
                          >
                            {deletingCart === cart.id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Itens do Carrinho */}
                        <div className="space-y-4">
                          {cart.cartItems.map((item) => {
                            const ticketInfo = getTicketDisplayInfo(item.price, item.ticketId);
                            
                            return (
                              <div
                                key={item.id}
                                className="flex gap-3 p-3 bg-muted/30 rounded-lg"
                              >
                                {/* Ícone do Ticket */}
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Ticket className="w-6 h-6 text-primary" />
                                  </div>
                                </div>

                                {/* Informações do Item */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-medium text-foreground text-sm leading-tight">
                                        {ticketInfo.name}
                                      </h4>
                                      <span className={`text-xs px-2 py-1 rounded-full mt-1 inline-block ${
                                        ticketInfo.type === 'vip' 
                                          ? 'bg-purple-100 text-purple-800' 
                                          : ticketInfo.type === 'normal'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-gray-100 text-gray-800'
                                      }`}>
                                        {ticketInfo.type.toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-bold text-foreground">
                                        {formatCurrency(item.price * item.quantity)}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {formatCurrency(item.price)} cada
                                      </div>
                                    </div>
                                  </div>

                                  {/* Controles de Quantidade */}
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground">Quantidade:</span>
                                      <div className="flex items-center border border-border rounded-lg">
                                        <button
                                          onClick={() => updateCartItem(cart.id, item.id, item.quantity - 1)}
                                          disabled={updatingItem === item.id || item.quantity <= 1}
                                          className="p-1 hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                          <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-2 text-sm font-medium min-w-8 text-center">
                                          {updatingItem === item.id ? (
                                            <Loader className="w-3 h-3 animate-spin mx-auto" />
                                          ) : (
                                            item.quantity
                                          )}
                                        </span>
                                        <button
                                          onClick={() => updateCartItem(cart.id, item.id, item.quantity + 1)}
                                          disabled={updatingItem === item.id}
                                          className="p-1 hover:bg-muted transition-colors disabled:opacity-50"
                                        >
                                          <Plus className="w-3 h-3" />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <button
                                      onClick={() => removeCartItem(cart.id, item.id)}
                                      disabled={removingItem === item.id || updatingItem === item.id}
                                      className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                                      title="Remover item"
                                    >
                                      {removingItem === item.id ? (
                                        <Loader className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Trash2 className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* FOOTER */}
              {filteredCarts.length > 0 && !loading && (
                <div className="border-t border-border p-6 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold text-foreground">
                    <span>Total Geral:</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-bold"
                  >
                    Finalizar Compra
                  </button>

                  {filteredCarts.length > 1 && (
                    <p className="text-xs text-muted-foreground text-center">
                      Será redirecionado para selecionar o carrinho desejado
                    </p>
                  )}
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}