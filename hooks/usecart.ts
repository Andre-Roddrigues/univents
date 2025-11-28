'use client';

import { useState, useEffect } from 'react';
import { 
  getCurrentCart,
  addToCart, 
  updateCartItems, 
  removeCartItems, 
  clearCart 
} from '@/lib/actions/cart-actions';

interface CartItem {
  ticketId: string;
  quantity: number;
  name?: string;
  price?: number;
  type?: string;
}

interface CartResponse {
  success: boolean;
  data?: any;
  cart?: any;
  message?: string;
  status?: number;
}

export function useCart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Carregar carrinho
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    try {
      const result: CartResponse = await getCurrentCart();
      if (result.success) {
        // ✅ CORREÇÃO: Usar result.data ou result.cart conforme retorno da API
        setCart(result.data || result.cart);
      } else {
        console.error('❌ Erro ao carregar carrinho:', result.message);
        setCart(null);
      }
    } catch (error) {
      console.error('💥 Erro no hook useCart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar itens ao carrinho (função inteligente)
  const addItems = async (items: CartItem[]) => {
    if (items.length === 0) return { success: false, message: 'Nenhum item para adicionar' };
    
    setUpdating(true);
    try {
      // Converter quantity para string para a API
      const apiItems = items.map(item => ({
        ticketId: item.ticketId,
        quantity: item.quantity.toString()
      }));

      const result: CartResponse = await addToCart({ items: apiItems });
      
      if (result.success) {
        // ✅ CORREÇÃO: Usar result.data ou result.cart
        const updatedCart = result.data || result.cart;
        setCart(updatedCart);
        
        // Disparar evento para atualizar componentes que escutam
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { cart: updatedCart } 
        }));
      }
      
      return result;
    } catch (error) {
      console.error('💥 Erro ao adicionar itens:', error);
      return { 
        success: false, 
        message: 'Erro ao adicionar itens ao carrinho' 
      };
    } finally {
      setUpdating(false);
    }
  };

  // Atualizar itens do carrinho
  const updateItems = async (items: CartItem[]) => {
    if (!cart?.id) return { success: false, message: 'Carrinho não encontrado' };
    if (items.length === 0) return { success: false, message: 'Nenhum item para atualizar' };
    
    setUpdating(true);
    try {
      // Converter quantity para string para a API
      const apiItems = items.map(item => ({
        ticketId: item.ticketId,
        quantity: item.quantity.toString()
      }));

      const result: CartResponse = await updateCartItems(cart.id, { items: apiItems });
      
      if (result.success) {
        // ✅ CORREÇÃO: Usar result.data ou result.cart
        const updatedCart = result.data || result.cart;
        setCart(updatedCart);
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { cart: updatedCart } 
        }));
      }
      
      return result;
    } catch (error) {
      console.error('💥 Erro ao atualizar itens:', error);
      return { 
        success: false, 
        message: 'Erro ao atualizar itens do carrinho' 
      };
    } finally {
      setUpdating(false);
    }
  };

  // Remover itens específicos do carrinho
  const removeItems = async (items: CartItem[]) => {
    if (!cart?.id) return { success: false, message: 'Carrinho não encontrado' };
    if (items.length === 0) return { success: false, message: 'Nenhum item para remover' };
    
    setUpdating(true);
    try {
      // Converter quantity para string para a API
      const apiItems = items.map(item => ({
        ticketId: item.ticketId,
        quantity: item.quantity.toString()
      }));

      const result: CartResponse = await removeCartItems(cart.id, { items: apiItems });
      
      if (result.success) {
        // ✅ CORREÇÃO: Usar result.data ou result.cart
        const updatedCart = result.data || result.cart;
        setCart(updatedCart);
        
        // Se o carrinho ficou vazio, atualizar estado local
        if (updatedCart?.items?.length === 0) {
          setCart(null);
        }
        
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { cart: updatedCart } 
        }));
      }
      
      return result;
    } catch (error) {
      console.error('💥 Erro ao remover itens:', error);
      return { 
        success: false, 
        message: 'Erro ao remover itens do carrinho' 
      };
    } finally {
      setUpdating(false);
    }
  };

  // Remover um item específico por ticketId
  const removeItem = async (ticketId: string) => {
    return await removeItems([{ ticketId, quantity: 0 }]);
  };

  // Atualizar quantidade de um item específico
  const updateItemQuantity = async (ticketId: string, quantity: number) => {
    if (quantity === 0) {
      return await removeItem(ticketId);
    }
    return await updateItems([{ ticketId, quantity }]);
  };

  // Limpar carrinho completamente
  const clear = async () => {
    setUpdating(true);
    try {
      const result: CartResponse = await clearCart();
      
      if (result.success) {
        setCart(null);
        window.dispatchEvent(new CustomEvent('cartUpdated', { 
          detail: { cart: null } 
        }));
      }
      
      return result;
    } catch (error) {
      console.error('💥 Erro ao limpar carrinho:', error);
      return { 
        success: false, 
        message: 'Erro ao limpar carrinho' 
      };
    } finally {
      setUpdating(false);
    }
  };

  // Calcular totais
  const getTotals = () => {
    if (!cart?.items) return { totalItems: 0, totalValue: 0 };
    
    const totalItems = cart.items.reduce((total: number, item: any) => 
      total + (parseInt(item.quantity) || 0), 0
    );
    
    const totalValue = cart.items.reduce((total: number, item: any) => 
      total + ((parseInt(item.quantity) || 0) * (item.price || 0)), 0
    );
    
    return { totalItems, totalValue };
  };

  // Verificar se um item específico está no carrinho
  const getItemQuantity = (ticketId: string) => {
    if (!cart?.items) return 0;
    const item = cart.items.find((item: any) => item.ticketId === ticketId);
    return item ? parseInt(item.quantity) : 0;
  };

  return {
    // Estado
    cart,
    loading,
    updating,
    
    // Ações
    addItems,
    updateItems,
    removeItems,
    removeItem,
    updateItemQuantity,
    clearCart: clear,
    reloadCart: loadCart,
    
    // Utilitários
    getTotals,
    getItemQuantity,
    
    // Estado derivado
    isEmpty: !cart || !cart.items || cart.items.length === 0,
    totalItems: getTotals().totalItems,
    totalValue: getTotals().totalValue
  };
}