import { z } from "zod";

// Regras reaproveitadas em mais de um schema
const email = z
  .string()
  .trim()
  .min(1, "Informe o e-mail.")
  .pipe(z.email("Informe um e-mail válido."));

const nome = z
  .string()
  .trim()
  .min(2, "O nome deve ter pelo menos 2 caracteres.")
  .max(60, "O nome deve ter no máximo 60 caracteres.");

// O Supabase exige no mínimo 6 caracteres por padrão
const senha = z
  .string()
  .min(6, "A senha deve ter pelo menos 6 caracteres.")
  .max(72, "A senha deve ter no máximo 72 caracteres.");

export const cadastroSchema = z
  .object({
    nome,
    email,
    senha,
    confirmarSenha: z.string().min(1, "Confirme a senha."),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"], // mostra o erro no campo de confirmação
  });

export const loginSchema = z.object({
  email,
  senha: z.string().min(1, "Informe a senha."),
});

export const perfilSchema = z.object({
  nome,
});
