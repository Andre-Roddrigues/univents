"use server";

import { cookies } from "next/headers";

function getToken() {
  return cookies().get("session")?.value || "";
}

interface PaymentItem {
  ticketId: string;
  quantity: string | number;
}

export async function directPayment(data: {
  paymentMethod: "mpesa" | "transference" | "saldo";
  phoneNumber?: string;
  items: PaymentItem[];
}) {
  try {
    const token = getToken();

    // 🔥 Monta o payload SEMPRE no formato exigido pelo backend
    const payload = {
      paymentMethod: data.paymentMethod,
      phoneNumber: data.phoneNumber,
      items: data.items.map((item) => ({
        ticketId: item.ticketId,
        quantity: String(item.quantity),
      })),
    };

    const res = await fetch(
      "https://backend-eventos.unitec.academy/payments/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const response = await res.json();

    // 👉 Extrair mensagem sempre, independente do formato
    const mensagem =
      response?.message?.mensagem ||
      response?.message ||
      response?.mensagem ||
      "Erro desconhecido";

    return {
      success: response.success === true,
      mensagem,
      raw: response, // resposta completa
    };
  } catch (error) {
    console.error("Erro no pagamento:", error);

    return {
      success: false,
      mensagem: "Erro interno ao processar o pagamento",
      raw: null,
    };
  }
}
