"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { routes } from "@/config/routes"; // <= substitui aqui se o path for outro

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
// CREATE CART  -> POST /carts/create
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

    // Aqui devolvemos igual ao backend:
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
// UPDATE CART -> PUT /carts/:id
// =====================================
export async function updateCart(cartId: string, data: CreateCartPayload) {
  try {
    const token = getToken();

    const response = await axios.put(`${routes.carts}/${cartId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Carrinho atualizado com sucesso!",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status ?? 500,
        message:
          error.response?.data?.message || "Erro ao atualizar o carrinho.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// DELETE CART -> DELETE /carts/:id
// =====================================
export async function deleteCart(cartId: string) {
  try {
    const token = getToken();

    const response = await axios.delete(`${routes.carts}/${cartId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Carrinho removido com sucesso!",
    };
  } catch (error) {
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
