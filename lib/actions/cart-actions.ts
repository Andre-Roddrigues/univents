"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { routes } from "@/config/routes";

// Tipos
export interface CartItemPayload {
  ticketId: string;
  quantity: string | number;
}

export interface CreateCartPayload {
  items: CartItemPayload[];
}

// Função auxiliar para pegar token do cookie
function getToken() {
  return cookies().get("session")?.value || "";
}

// =====================================
// CREATE CART  -> POST /carts
// =====================================
export async function createCart(data: CreateCartPayload) {
  try {
    const token = getToken();

    const response = await axios.post(routes.carts_create, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Carrinho criado com sucesso!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status ?? 500,
        message: error.response?.data?.message || "Erro ao criar carrinho.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// LIST CARTS -> GET /carts/list
// =====================================
export async function listCarts() {
  try {
    const token = getToken();

    const response = await axios.get(routes.carts_list, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: response.data?.success ?? true,
      carts: response.data?.carts ?? [],
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        carts: [],
        status: error.response?.status ?? 500,
        message: error.response?.data?.message || "Erro ao listar carrinhos.",
      };
    }
    return { success: false, carts: [], message: String(error) };
  }
}

// =====================================
// GET CART BY ID -> GET /carts/:id
// =====================================
export async function getCartById(cartId: string) {
  try {
    const token = getToken();

    const response = await axios.get(`${routes.carts}/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status ?? 500,
        message:
          error.response?.data?.message ||
          "Erro ao buscar detalhes do carrinho.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// GET CART -> GET /carts/:id
// =====================================
export async function getCart(cartId: string) {
  try {
    const token = getToken();

    const response = await axios.get(`${routes.carts}/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('📦 Resposta da API getCart:', response.data);

    const cartData = response.data?.cart || response.data?.data?.cart || response.data;

    return {
      success: true,
      cart: cartData,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('❌ Erro na API getCart:', error.response?.data);
      return {
        success: false,
        status: error.response?.status ?? 500,
        message:
          error.response?.data?.message ||
          "Erro ao buscar detalhes do carrinho.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// UPDATE CART ITEMS -> PUT /carts/update-items/:id
// =====================================
export async function updateCartItems(cartId: string, data: CreateCartPayload) {
  try {
    const token = getToken();

    console.log('🔄 Atualizando carrinho:', {
      url: `${routes.cart_update}/${cartId}`,
      payload: data,
      cartId
    });

    const response = await axios.put(`${routes.cart_update}/${cartId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Carrinho atualizado com sucesso:', response.data);

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Carrinho atualizado com sucesso!",
    };
  } catch (error) {
    console.error('❌ Erro ao atualizar carrinho:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao atualizar o carrinho.";
      const status = error.response?.status ?? 500;
      
      console.error('📋 Detalhes do erro:', {
        status,
        message: errorMessage,
        data: error.response?.data
      });

      return {
        success: false,
        status,
        message: errorMessage,
      };
    }
    return { 
      success: false, 
      message: "Erro de conexão ao atualizar carrinho" 
    };
  }
}

// =====================================
// REMOVE CART ITEMS -> PUT /carts/remove-items/:id
// =====================================
export async function removeCartItems(cartId: string, data: CreateCartPayload) {
  try {
    const token = getToken();

    console.log('🗑️ Removendo itens do carrinho:', {
      url: `${routes.cart_remove}/${cartId}`,
      payload: data,
      cartId
    });

    const response = await axios.put(`${routes.cart_remove}/${cartId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Itens removidos com sucesso:', response.data);

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Itens removidos do carrinho com sucesso!",
    };
  } catch (error) {
    console.error('❌ Erro ao remover itens:', error);
    
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Erro ao remover itens do carrinho.";
      const status = error.response?.status ?? 500;
      
      console.error('📋 Detalhes do erro:', {
        status,
        message: errorMessage,
        data: error.response?.data
      });

      return {
        success: false,
        status,
        message: errorMessage,
      };
    }
    return { 
      success: false, 
      message: "Erro de conexão ao remover itens" 
    };
  }
}

// =====================================
// DELETE CART -> DELETE /carts/:id
// =====================================
export async function deleteCart(cartId: string) {
  try {
    const token = getToken();

    console.log('🗑️ Removendo carrinho:', cartId);

    const response = await axios.delete(`${routes.carts}/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('✅ Carrinho removido com sucesso:', response.data);

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Carrinho removido com sucesso!",
    };
  } catch (error) {
    console.error('❌ Erro ao remover carrinho:', error);
    
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status ?? 500,
        message:
          error.response?.data?.message || "Erro ao remover o carrinho.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// ADD TO CART (Função inteligente)
// =====================================
export async function addToCart(data: CreateCartPayload) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (cartId) {
      // Se já existe carrinho, ATUALIZA os itens
      return await updateCartItems(cartId, data);
    } else {
      // Se não existe carrinho, CRIA novo
      const result = await createCart(data);
      
      // Salva o ID do carrinho nos cookies se foi criado com sucesso
      if (result.success && result.data?.id) {
        cookieStore.set('cartId', result.data.id, {
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          path: '/',
        });
      }
      
      return result;
    }
  } catch (error) {
    console.error('💥 Erro ao adicionar ao carrinho:', error);
    return {
      success: false,
      message: 'Erro de conexão ao adicionar ao carrinho'
    };
  }
}

// =====================================
// CLEAR CART (Limpar completamente)
// =====================================
export async function clearCart() {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (!cartId) {
      return {
        success: true,
        message: 'Carrinho já está vazio'
      };
    }

    // Para limpar completamente, removemos todos os items
    const result = await removeCartItems(cartId, { items: [] });

    if (result.success) {
      // Limpar cookie
      cookieStore.delete('cartId');
      return {
        success: true,
        message: 'Carrinho limpo com sucesso'
      };
    }

    return result;
  } catch (error) {
    console.error('💥 Erro ao limpar carrinho:', error);
    return {
      success: false,
      message: 'Erro de conexão ao limpar carrinho'
    };
  }
}

// =====================================
// GET CURRENT CART (Obter carrinho atual)
// =====================================
export async function getCurrentCart() {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get('cartId')?.value;

    if (!cartId) {
      return {
        success: true,
        data: null
      };
    }

    const result = await getCart(cartId);
    return result;
  } catch (error) {
    console.error('💥 Erro ao obter carrinho atual:', error);
    return {
      success: false,
      message: 'Erro de conexão ao obter carrinho'
    };
  }
}