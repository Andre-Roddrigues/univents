"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { routes } from "@/config/routes";

// Tipos para as respostas da API
export interface MpesaPaymentPayload {
  paymentMethod: "mpesa";
  cartId: string;
  phoneNumber: string;
}

export interface TransferPaymentPayload {
  paymentMethod: "transference";
  cartId: string;
  proofImage: File;
  referenceNumber: string;
}

export type PaymentPayload = MpesaPaymentPayload | TransferPaymentPayload;

export interface PaymentResponse {
  success: boolean;
  message: {
    success: boolean;
    statusCode: number;
    mensagem: string;
  };
  payment?: {
    id: string;
    paymentDate: string;
    entityId: string;
    amount: number;
    method: string;
    status: "pending" | "completed" | "failed";
    itemName: string;
    itemId: string;
    updatedAt: string;
    createdAt: string;
  };
  mpesa?: {
    id: string;
    amount: number;
    transactionReference: string;
    thirdPartyReference: string;
    userId: string;
    responseDescription: string;
    phoneNumber: string;
    updatedAt: string;
    createdAt: string;
  };
}

export interface ApiResponse {
  success: boolean;
  data?: PaymentResponse;
  message?: string;
  status?: number;
}

// Função auxiliar para pegar token do cookie
function getToken() {
  return cookies().get("token")?.value || "";
}

// =====================================
// CREATE PAYMENT -> POST /payments/create
// =====================================
export async function createPayment(data: PaymentPayload): Promise<ApiResponse> {
  try {
    const token = getToken();

    // Para pagamentos M-Pesa
    if (data.paymentMethod === "mpesa") {
      const payload = {
        paymentMethod: data.paymentMethod,
        cartId: data.cartId,
        phoneNumber: data.phoneNumber
      };

      console.log("💰 Enviando pagamento M-Pesa:", payload);

      const response = await axios.post(routes.payments_create, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const responseData: PaymentResponse = response.data;

      // Mapear respostas da API para mensagens amigáveis
      let userMessage = "Pagamento processado com sucesso!";
      
      if (!responseData.success) {
        if (responseData.message?.mensagem.includes("Saldo insuficiente")) {
          userMessage = "Saldo insuficiente na sua conta M-Pesa. Por favor, recarregue e tente novamente.";
        } else if (responseData.message?.mensagem.includes("invalid phone number")) {
          userMessage = "Número de telefone inválido. Por favor, verifique o número e tente novamente.";
        } else if (responseData.message?.mensagem.includes("timeout")) {
          userMessage = "Tempo limite excedido. Por favor, tente novamente.";
        } else {
          userMessage = responseData.message?.mensagem || "Erro ao processar pagamento. Tente novamente.";
        }
      } else {
        if (responseData.payment?.status === "completed") {
          userMessage = "Pagamento realizado com sucesso! Os bilhetes serão enviados para o seu email.";
        } else if (responseData.payment?.status === "pending") {
          userMessage = "Pagamento em processamento. Aguarde a confirmação.";
        }
      }

      return {
        success: responseData.success,
        data: responseData,
        status: response.status,
        message: userMessage,
      };
    }

    // Para pagamentos por transferência (será implementado separadamente)
    return {
      success: false,
      message: "Método de pagamento não implementado",
    };

  } catch (error) {
    console.error("💥 Erro ao processar pagamento:", error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      let userMessage = "Erro ao processar pagamento. Tente novamente.";

      // Mapear códigos de erro comuns
      switch (status) {
        case 400:
          userMessage = "Dados inválidos. Verifique as informações e tente novamente.";
          break;
        case 401:
          userMessage = "Sessão expirada. Por favor, faça login novamente.";
          break;
        case 403:
          userMessage = "Acesso não autorizado.";
          break;
        case 422:
          userMessage = errorData?.message?.mensagem || "Não foi possível processar o pagamento. Verifique os dados.";
          break;
        case 500:
          userMessage = "Erro interno do servidor. Tente novamente em alguns instantes.";
          break;
        case 503:
          userMessage = "Serviço temporariamente indisponível. Tente novamente mais tarde.";
          break;
        default:
          userMessage = errorData?.message?.mensagem || "Erro inesperado. Tente novamente.";
      }

      return {
        success: false,
        status: status,
        message: userMessage,
      };
    }

    return {
      success: false,
      message: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}

// =====================================
// CREATE TRANSFER PAYMENT -> POST /payments/transference/create
// =====================================
// =====================================
// CREATE TRANSFER PAYMENT -> POST /payments/transference/create
// =====================================
export async function createTransferPayment(
  cartId: string,
  fileData: {
    name: string;
    type: string;
    size: number;
    base64: string;
  }
): Promise<ApiResponse> {
  try {
    const token = getToken();

    console.log("💰 Iniciando pagamento por transferência:", {
      cartId,
      fileName: fileData.name,
      fileSize: fileData.size,
      fileType: fileData.type
    });

    // Converter base64 para blob
    const response = await fetch(fileData.base64);
    const blob = await response.blob();
    const file = new File([blob], fileData.name, { type: fileData.type });

    const formData = new FormData();
    formData.append("paymentMethod", "transference");
    formData.append("cartId", cartId);
    formData.append("file", file);

    console.log("📦 FormData criado, enviando requisição...");

    const axiosResponse = await axios.post(routes.payments_transference_create, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    console.log("✅ Resposta do servidor:", axiosResponse.data);

    const responseData = axiosResponse.data;

    let userMessage = "Comprovante enviado com sucesso! Aguarde a confirmação do pagamento.";

    if (!responseData.success) {
      userMessage = responseData.message?.mensagem || "Erro ao enviar comprovante. Tente novamente.";
    }

    return {
      success: responseData.success,
      data: responseData,
      status: axiosResponse.status,
      message: userMessage,
    };

  } catch (error) {
    console.error("💥 Erro ao enviar comprovante de transferência:", error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const errorData = error.response?.data;

      let userMessage = "Erro ao enviar comprovante. Tente novamente.";

      switch (status) {
        case 400:
          userMessage = "Arquivo inválido ou dados incorretos. Verifique o comprovante e tente novamente.";
          break;
        case 401:
          userMessage = "Sessão expirada. Por favor, faça login novamente.";
          break;
        case 403:
          userMessage = "Acesso não autorizado.";
          break;
        case 413:
          userMessage = "Arquivo muito grande. O comprovante deve ter no máximo 5MB.";
          break;
        case 422:
          userMessage = errorData?.message?.mensagem || "Não foi possível processar o comprovante. Verifique o arquivo.";
          break;
        case 500:
          userMessage = "Erro interno do servidor. Tente novamente em alguns instantes.";
          break;
        case 503:
          userMessage = "Serviço temporariamente indisponível. Tente novamente mais tarde.";
          break;
        default:
          userMessage = errorData?.message?.mensagem || "Erro inesperado ao enviar comprovante.";
      }

      return {
        success: false,
        status: status,
        message: userMessage,
      };
    }

    return {
      success: false,
      message: "Erro de conexão. Verifique sua internet e tente novamente.",
    };
  }
}

// =====================================
// GET PAYMENT STATUS -> GET /payments/:id
// =====================================
export async function getPaymentStatus(paymentId: string): Promise<ApiResponse> {
  try {
    const token = getToken();

    const response = await axios.get(`${routes.payments}/${paymentId}`, {
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
        message: error.response?.data?.message || "Erro ao buscar status do pagamento.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// LIST PAYMENTS -> GET /payments/list
// =====================================
export async function listPayments(): Promise<ApiResponse> {
  try {
    const token = getToken();

    const response = await axios.get(routes.payments_list, {
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
        message: error.response?.data?.message || "Erro ao listar pagamentos.",
      };
    }
    return { success: false, message: String(error) };
  }
}

// =====================================
// UPLOAD TRANSFER PROOF (Legacy) -> Mantido para compatibilidade
// =====================================
export async function uploadTransferProof(
  cartId: string,
  referenceNumber: string,
  proofImage: File
): Promise<ApiResponse> {
  try {
    const token = getToken();

    console.log("📤 Usando método legacy de upload de comprovante");

    const formData = new FormData();
    formData.append("cartId", cartId);
    formData.append("referenceNumber", referenceNumber);
    formData.append("proofImage", proofImage);

    const response = await axios.post(routes.payments_transfer_proof, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      success: true,
      data: response.data,
      status: response.status,
      message: "Comprovante enviado com sucesso! Aguarde a confirmação do pagamento.",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status ?? 500,
        message: error.response?.data?.message || "Erro ao enviar comprovante.",
      };
    }
    return { success: false, message: String(error) };
  }
}