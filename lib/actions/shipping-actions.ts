// lib/actions/shipping-actions.ts
"use server";

import { routes } from "@/config/routes";

interface CalculateShippingRequest {
  id: string;
  quantity: number;
}

interface CalculateShippingResponse {
  deliveryPrice: number;
}

const shippingCache = new Map<string, CalculateShippingResponse>();

export async function calculateShipping(
  data: CalculateShippingRequest
): Promise<CalculateShippingResponse> {
  try {
    if (!data.id || !data.quantity || data.quantity <= 0) {
      throw new Error(
        "Dados inválidos: província e quantidade são obrigatórios"
      );
    }

    const cacheKey = `${data.id}-${data.quantity}`;
    const cached = shippingCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await fetch(routes.calculate_price, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const result = await response.json();

    const deliveryData: CalculateShippingResponse = {
      deliveryPrice: result.deliveryPrice,
    };

    shippingCache.set(cacheKey, deliveryData);

    return deliveryData;
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    throw new Error("Erro ao calcular frete. Tente novamente.");
  }
}
