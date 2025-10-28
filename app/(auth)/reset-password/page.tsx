"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  Lock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { InputField } from "@/components/ui/InputField";
import { Button } from "@/components/ui/button";

// Simulação das funções de recuperação (substitua pelas suas)
const sendRecoveryEmail = async (email: string) => {
  // Simulação de delay da API
  await new Promise((resolve) => setTimeout(resolve, 2000));
  // Simulação de verificação de email válido
  const isValidEmail = email.includes("@") && email.includes(".");
  return { status: isValidEmail ? 200 : 400 };
};
export const dynamic = "force-dynamic";


export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setValidationError("");
    setError("");
  };

  const handleSubmit = async () => {
    if (!email.trim()) {
      setValidationError("Por favor, digite seu email");
      return;
    }

    if (!validateEmail(email)) {
      setValidationError("Por favor, digite um email válido");
      return;
    }

    setLoading(true);
    setError("");
    setValidationError("");

    try {
      const response = await sendRecoveryEmail(email);

      if (response.status === 200) {
        setEmailSent(true);
      } else {
        setError("Email não encontrado. Verifique se o endereço está correto.");
      }
    } catch (error) {
      setError("Erro ao enviar email. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await sendRecoveryEmail(email);

      if (response.status === 200) {
        // Email reenviado com sucesso
      } else {
        setError("Erro ao reenviar email. Tente novamente!");
      }
    } catch (error) {
      setError("Erro ao reenviar email. Tente novamente!");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-xs sm:max-w-md w-full">
          <div className=" backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-white/20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Email Enviado!
            </h1>

            <p className="text-gray-600 text-sm sm:text-base mb-4">
              Enviamos as instruções de recuperação para:
            </p>

            <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8">
              <Mail className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm sm:text-base break-all">
                {email}
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 sm:mb-8">
              <p className="text-blue-800 text-xs sm:text-sm">
                📧 Verifique sua caixa de entrada e spam. O email pode levar
                alguns minutos para chegar.
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={handleResend}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Reenviando...
                  </div>
                ) : (
                  "Reenviar Email"
                )}
              </button>

              <button
                onClick={() => window.history.back()}
                className="w-full bg-gray-100 text-gray-700 py-3 px-4 sm:px-6 rounded-xl font-medium transition-all duration-200 hover:bg-gray-200 text-sm sm:text-base"
              >
                Voltar ao Login
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-xs sm:text-sm text-center">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="max-w-xs sm:max-w-md w-full">
        <div className=" backdrop-blur-xl rounded-xl shadow-xl p-6 sm:p-8 border ">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100  rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mb-2">
              Recuperar Senha
            </h1>

            <p className="text-sm ">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <InputField
                icon={<Mail className="w-4 h-4 text-muted-foreground" />}
                placeholder="william@email.com"
              />

              {validationError && (
                <div className="mt-2 flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs sm:text-sm">{validationError}</span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <p className="text-red-600 text-xs sm:text-sm">{error}</p>
                </div>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-tr from-primary to-secondary  py-3 px-4 sm:px-6 font-semibold transition-all duration-200  disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Enviando...
                </div>
              ) : (
                "Recuperar Senha"
              )}
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-6 sm:mt-8 p-4 bg-card rounded-lg border ">
            <h3 className="font-medium  mb-2 text-sm sm:text-base">
              Precisa de ajuda?
            </h3>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
              <li>• Verifique se o email está correto</li>
              <li>• Consulte a pasta de spam</li>
              <li>• Entre em contato com o suporte se necessário</li>
            </ul>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-center">
              🔒 Por segurança, o link de recuperação expira em 15 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
