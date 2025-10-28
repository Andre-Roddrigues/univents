"use client";

import React from "react";
import { Mail, Lock, User, Eye, EyeOff, Phone } from "lucide-react";
import { createAccount } from "@/lib/actions/auth-actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "../ui/InputField";
import { Separator } from "../ui/separator";
import { SubmitButton } from "../SubmitButton";
import {
  RegisterSchema,
  registerSchema,
} from "@/lib/validations/RegisterSchema";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

  const handleRegister = async (data: RegisterSchema) => {
    try {
      const response = await createAccount(data);
      if (!response?.success) {
        toast.error("Erro!!!", {
          description: response?.message,
        });
        console.log("Erro", response?.message);
        console.error(response?.errors);
        console.error(response?.errorMessage);
        return;
      }
      toast.success(response?.message);
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      console.error("Erro inesperado ao tentar fazer cadastro.", error);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              icon={<User size={18} className="sm:w-5 sm:h-5" />}
              label="Nome:"
              placeholder="Seu nome"
              type="text"
              {...register("name")}
              errorMessage={errors.name?.message}
              className="text-sm sm:text-base"
            />

            <InputField
              icon={<User size={18} className="sm:w-5 sm:h-5" />}
              label="Apelido:"
              placeholder="Seu apelido"
              type="text"
              {...register("lastName")}
              errorMessage={errors.lastName?.message}
              className="text-sm sm:text-base"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <InputField
              icon={<Mail size={18} className="sm:w-5 sm:h-5" />}
              label="Email:"
              placeholder="william@email.com"
              type="email"
              {...register("email")}
              errorMessage={errors.email?.message}
              className="text-sm sm:text-base"
            />

            <InputField
              icon={<Phone size={18} className="sm:w-5 sm:h-5" />}
              label="Contacto:"
              placeholder="+258 XX XXX XXXX"
              type="tel"
              {...register("telephone")}
              errorMessage={errors.telephone?.message}
              className="text-sm sm:text-base"
            />
          </div>

          <InputField
            icon={<Lock size={18} className="sm:w-5 sm:h-5" />}
            rightIcon={
              showPassword ? (
                <EyeOff size={18} className="sm:w-5 sm:h-5" />
              ) : (
                <Eye size={18} className="sm:w-5 sm:h-5" />
              )
            }
            onRightIconClick={() => setShowPassword(!showPassword)}
            label="Senha:"
            placeholder="Crie uma senha segura"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            errorMessage={errors.password?.message}
            className="text-sm sm:text-base"
          />

          {shouldShowConfirmPassword && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <InputField
                icon={<Lock size={18} className="sm:w-5 sm:h-5" />}
                rightIcon={
                  showConfirmPassword ? (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
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
                className="text-sm sm:text-base"
              />
            </div>
          )}

          <div className="flex items-start  space-x-2 pt-2">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="mt-1 h-4 w-4 border-gray-300 rounded flex-shrink-0"
            />
            <label
              htmlFor="terms"
              className="text-xs sm:text-sm text-gray-600 leading-relaxed"
            >
              Eu aceito os{" "}
              <button
                type="button"
                className=" hover:text-foreground font-medium transition-colors underline"
              >
                Termos de Uso
              </button>{" "}
              e a{" "}
              <button
                type="button"
                className=" hover:text-blue-800 font-medium transition-colors underline"
              >
                Política de Privacidade
              </button>
            </label>
          </div>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs sm:text-sm">
              {errors.acceptTerms.message}
            </p>
          )}

          <SubmitButton
            isLoading={isSubmitting}
            defaultText="Criar conta"
            loadingText="Criando conta..."
            className="w-full py-2.5 sm:py-3 text-sm sm:text-base "
          />

          <Separator />
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600 text-xs sm:text-sm">
            Já tem uma conta?{" "}
            <button className=" underline underline-offset-4 font-semibold transition-colors">
              Entrar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
