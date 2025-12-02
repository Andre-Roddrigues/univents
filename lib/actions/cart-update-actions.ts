"use server";

import { cookies } from "next/headers";
import { routes } from "@/config/routes";

function getToken() {
  return cookies().get("session")?.value || "";
}

export async function updateCartItems(
  cartId: string,
  items: { ticketId: string; quantity: number }[]
) {
  try {
    const token = getToken();

    const res = await fetch(`${routes.cart_update}/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao atualizar itens do carrinho:", error);
    return { success: false, message: "Erro interno ao atualizar o carrinho." };
  }
}

export async function removeCartItems(
  cartId: string,
  items: { ticketId: string; quantity: number }[]
) {
  try {
    const token = getToken();

    const res = await fetch(`${routes.cart_remove}/${cartId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Erro ao remover itens:", error);
    return { success: false, message: "Erro interno ao remover itens." };
  }
}
