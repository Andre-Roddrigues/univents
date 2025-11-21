import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email ou usuário é obrigatório")
    .refine(
      (val) => val.includes("@") || /^[a-zA-Z0-9._-]+$/.test(val),
      "Insira um email válido ou username"
    ),
  password: z
    .string()
    .min(1, "Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
