import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres")
      .max(50, "Nome deve ter no máximo 50 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),

    lastName: z
      .string()
      .min(2, "Apelido deve ter pelo menos 2 caracteres")
      .max(50, "Apelido deve ter no máximo 50 caracteres")
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Apelido deve conter apenas letras"),

    email: z.string().email("Email inválido").min(1, "Email é obrigatório"),

    telephone: z
      .string()
      .optional()
      .transform((val) => val ?? "")
      .refine(
        (val) =>
          val === "" || (/^[\+]?[0-9\s\-\(\)]+$/.test(val) && val.length >= 9),
        {
          message: "Formato de contacto inválido ou muito curto",
        }
      ),

    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(100, "Senha deve ter no máximo 100 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Senha deve conter: 1 minúscula, 1 maiúscula e 1 número"
      ),

    passwordConfirm: z
      .string()
      .min(1, "Confirmação de senha é obrigatória"),

    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os termos e condições",
    }),
  })

  // 🔥 Ajuste principal: path corrigido para passwordConfirm
  .refine((data) => data.password === data.passwordConfirm, {
    message: "As senhas não coincidem",
    path: ["passwordConfirm"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
