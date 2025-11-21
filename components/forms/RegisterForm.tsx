"use client";

import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { InputField } from "../ui/InputField";
import { Separator } from "../ui/separator";
import { SubmitButton } from "../SubmitButton";

import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { registerUser } from "@/lib/actions/register-actions";
import { registerSchema, RegisterSchema } from "@/lib/validations/RegisterSchema";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");
  const shouldShowConfirmPassword = password && password.length > 6;

  // -------------------------------------------------------
  // 🔥 HANDLE REGISTER - AGORA CHAMA registerUser
  // -------------------------------------------------------
  const handleRegister = async (data: RegisterSchema) => {
    try {
      const payload = {
        name: data.name,
        lastname: data.lastName,
        username: data.email.split("@")[0],
        email: data.email,
        password: data.password,
        phone: data.telephone,
        provincia: "Maputo",
        bairro: "Centro",
      };

      const response = await registerUser(payload);

      if (!response?.success) {
        toast.error("Erro ao registrar", {
          description: response?.message,
        });
        return;
      }

      toast.success("Conta criada com sucesso!");

      router.push(`/login`);
    } catch (error) {
      console.error("Erro inesperado:", error);
      toast.error("Erro inesperado. Tente novamente.");
    }
  };

  return (
    <div className="bg-background/80 backdrop-blur-xl w-full max-w-lg lg:max-w-xl xl:max-w-2xl h-full shadow-2xl border border-white/20 py-4 lg:overflow-y-auto scrollbar-hide">
      <div className="p-4 sm:p-6 lg:p-8 lg:pt-2 2xl:pt-8">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Crie sua conta</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Junte-se à nossa comunidade de leitores
          </p>
        </div>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="space-y-3 sm:space-y-4"
        >
          {/* Nome + Apelido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              icon={<User size={18} />}
              label="Nome:"
              placeholder="Seu nome"
              type="text"
              {...register("name")}
              errorMessage={errors.name?.message}
            />

            <InputField
              icon={<User size={18} />}
              label="Apelido:"
              placeholder="Seu apelido"
              type="text"
              {...register("lastName")}
              errorMessage={errors.lastName?.message}
            />
          </div>

          {/* Email + Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              icon={<Mail size={18} />}
              label="Email:"
              placeholder="email@email.com"
              type="email"
              {...register("email")}
              errorMessage={errors.email?.message}
            />

            <InputField
              icon={<Phone size={18} />}
              label="Contacto:"
              placeholder="+258 XX XXX XXXX"
              type="tel"
              {...register("telephone")}
              errorMessage={errors.telephone?.message}
            />
          </div>

          {/* Senha */}
          <InputField
            icon={<Lock size={18} />}
            rightIcon={
              showPassword ? <EyeOff size={18} /> : <Eye size={18} />
            }
            onRightIconClick={() => setShowPassword(!showPassword)}
            label="Senha:"
            placeholder="Crie uma senha"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            errorMessage={errors.password?.message}
          />

          {/* Confirmar Senha */}
          {shouldShowConfirmPassword && (
            <InputField
              icon={<Lock size={18} />}
              rightIcon={
                showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )
              }
              onRightIconClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              label="Confirmar senha:"
              placeholder="Confirme sua senha"
              type={showConfirmPassword ? "text" : "password"}
              {...register("passwordConfirm")}
              errorMessage={errors.passwordConfirm?.message}
            />
          )}

          {/* Termos */}
          <div className="flex items-start space-x-2 pt-2">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="mt-1 h-4 w-4"
            />
            <label className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Eu aceito os{" "}
              <button className="underline font-medium">Termos de Uso</button>{" "}
              e a{" "}
              <button className="underline font-medium">
                Política de Privacidade
              </button>
            </label>
          </div>

          {errors.acceptTerms && (
            <p className="text-red-500 text-xs">{errors.acceptTerms.message}</p>
          )}

          <SubmitButton
            isLoading={isSubmitting}
            defaultText="Criar conta"
            loadingText="Criando..."
            className="w-full py-3"
          />

          <Separator />
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            Já tem uma conta?{" "}
            <button className="underline font-semibold">Entrar</button>
          </p>
        </div>
      </div>
    </div>
  );
}
