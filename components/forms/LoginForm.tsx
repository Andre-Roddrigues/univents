"use client";

import React, { useEffect, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { login } from "@/lib/actions/auth-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../ui/InputField";
import { Separator } from "../ui/separator";
import { SubmitButton } from "../SubmitButton";
import { LoginSchema, loginSchema } from "@/lib/validations/LoginSchema";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState("/eventos");

  // Pega redirect da URL
  useEffect(() => {
    const params = new URL(window.location.href).searchParams;
    const redirectParam = params.get("redirect");
    if (redirectParam) setRedirectUrl(redirectParam);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

 const handleLogin = async (data: LoginSchema) => {
  try {
    const response = await login(data.identifier, data.password);

    // 👉 Se não veio token, é erro
    if (!response?.token) {
      toast.error("Erro ao fazer login", {
        description: response?.message ?? "Credenciais inválidas",
      });
      return;
    }

    const user = response.user;

    if (!user) {
      toast.error("Erro ao obter dados do usuário.");
      return;
    }

    const fullName = `${user.nome ?? ""} ${user.apelido ?? ""}`.trim();

    toast.success(`Bem-vindo, ${fullName}!`);

    if (user.userType === "admin") {
      router.push("/eventos/dashboard");
    } else {
      router.push(redirectUrl);
    }

  } catch (error) {
    console.error("Erro inesperado ao tentar fazer login.", error);
    toast.error("Erro inesperado ao tentar fazer login.");
  }
};


  return (
    <div className="bg-white/70 backdrop-blur-xl max-w-md w-full h-full shadow-2xl border border-white/20 py-4 overflow-hidden">
      <div className="p-8">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold">Bem-vindo de volta!</h2>
            <p className="text-muted-foreground text-sm">
            Compre e faça gestão dos seus bilhetes
            </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <InputField
            icon={<Mail size={20} />}
            label="Email ou usuário:"
            placeholder="Insira seu email ou usuário"
            type="text"
            {...register("identifier")}
            errorMessage={errors.identifier?.message}
          />

          <InputField
            icon={<Lock size={20} />}
            label="Senha:"
            placeholder="Insira sua senha"
            type="password"
            {...register("password")}
            errorMessage={errors.password?.message}
          />

          <Link
            href={"/reset-password"}
            className="text-sm text-blue-600 hover:text-blue-800 underline-offset-4 hover:underline font-medium transition-colors"
          >
            Esqueceu a senha?
          </Link>

          <SubmitButton
            isLoading={isSubmitting}
            defaultText="Entrar"
            loadingText="Entrando..."
            className="w-full bg-primary py-5 shadow-lg transition-all hover:bg-gradient-to-br hover:shadow-xl"
          />

          <Separator />
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Ainda não tem uma conta?{" "}
            <Link
              href={"/register"}
              className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
