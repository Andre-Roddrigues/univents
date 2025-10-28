"use server";

import { routes } from "@/config/routes";
import { getErrorMessage } from "../utils";
import { DeliveryFee } from "@/types/types";

export async function getAllDeliveries() {
  try {
    const response = await fetch(routes.deliveries, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return {
        success: false,
        error: "Erro ao carregar localizações de entrega",
        status: response.status,
      };
    }

    const data: DeliveryFee[] = await response.json();
    data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

    return { success: true, deliviryFees: data, status: response.status };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export interface PaymentRequest {
  ebooks: {
    ebookId: string;
    quantity: number;
  }[];
  paymentMethod: "M-pesa" | "cartao";
  phoneNumber: string;
  province: string;
  deliveryLocation: string;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  orderId?: string;
  transactionId?: string;
  error?: string;
}

export async function efectuarPagamento(
  paymentData: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const response = await fetch(routes.buyebook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao processar pagamento!!!");
    }

    const result = await response.json();

    return {
      success: true,
      message: "Pagamento processado com sucesso!",
      orderId: result.orderId,
      transactionId: result.transactionId,
    };
  } catch (error) {
    console.error("Erro ao efetuar pagamento:", error);

    return {
      success: false,
      message: "Erro ao processar pagamento. Tente novamente.",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Função auxiliar para validar dados de pagamento
export async function validatePaymentData(data: PaymentRequest) {
  const errors: string[] = [];

  if (!data.ebooks || data.ebooks.length === 0) {
    errors.push("Nenhum ebook selecionado");
  }

  if (!data.paymentMethod) {
    errors.push("Método de pagamento é obrigatório");
  }

  if (!data.phoneNumber || data.phoneNumber.trim() === "") {
    errors.push("Número de telefone é obrigatório");
  }

  if (!data.province || data.province.trim() === "") {
    errors.push("Província é obrigatória");
  }

  if (!data.deliveryLocation || data.deliveryLocation.trim() === "") {
    errors.push("Localização de entrega é obrigatória");
  }

  if (!data.contactInfo.name || data.contactInfo.name.trim() === "") {
    errors.push("Nome é obrigatório");
  }

  if (!data.contactInfo.email || data.contactInfo.email.trim() === "") {
    errors.push("Email é obrigatório");
  }

  if (!data.contactInfo.phone || data.contactInfo.phone.trim() === "") {
    errors.push("Telefone de contato é obrigatório");
  }

  // Validação básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.contactInfo.email && !emailRegex.test(data.contactInfo.email)) {
    errors.push("Email inválido");
  }

  // Validação básica de telefone moçambicano
  const phoneRegex = /^(\+258|258)?[0-9]{8,9}$/;
  if (
    data.phoneNumber &&
    !phoneRegex.test(data.phoneNumber.replace(/\s/g, ""))
  ) {
    errors.push("Número de telefone inválido");
  }

  return errors;
}
