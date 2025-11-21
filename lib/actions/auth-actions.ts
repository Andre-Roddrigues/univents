"use server";

import { cookies } from "next/headers";
import axios from "axios";
import { registerSchema, RegisterSchema } from "../validations/RegisterSchema";
import { parseZodErrors } from "../helpers/zod-helpers";
import { getErrorMessage } from "../utils";
import { loginSchema } from "../validations/LoginSchema";
import { routes } from "@/config/routes";

// =============================
// CREATE ACCOUNT
// =============================
export async function createAccount(data: RegisterSchema) {
  const result = registerSchema.safeParse(data);
  if (!result.success) {
    return {
      success: false,
      errors: parseZodErrors(result.error),
      message: "Preencha os campos correctamente e tente novamente.",
    };
  }

  try {
    const response = await axios.post(routes.create_account, data);

    if (response.status === 200 || response.status === 201) {
      return {
        data: response.data,
        status: response.status,
        success: true,
        message: "Conta criada com sucesso!",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      return {
        success: false,
        status: status ?? 500,
        message: error.response?.data?.message || "Erro ao criar conta.",
      };
    }
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

// =============================
// VERIFY OTP
// =============================
export async function verifyOTP(email: string, otp: string) {
  try {
    const response = await axios.patch(routes.verify_otp, { otp, email });

    // Guardar token no cookie
    if (response.status === 200 && response.data?.token) {
      cookies().set("token", response.data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }

    return { data: response.data, status: response.status };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
}

// =============================
// LOGIN
// =============================
// =============================
// LOGIN
// =============================
export async function login(identifier: string, password: string) {
  try {
    const response = await axios.post(routes.login, { identifier, password });

    if (response.status === 200 && response.data.token) {
      // Salva token no cookie
      cookies().set("token", response.data.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }

    return response.data; // { success, message, userData, token }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao fazer login",
      };
    }
    return { success: false, message: "Erro inesperado" };
  }
}

// =============================
// REENVIAR OTP
// =============================
export async function resend_OTP(email: string) {
  try {
    const response = await axios.post(routes.resend_otp, { email });
    return { data: response.data, status: response.status };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
}

// =============================
// LOGOUT
// =============================
export async function logout() {
  cookies().delete("token");
}
