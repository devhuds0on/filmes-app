import { z } from "zod";

// Regras reaproveitadas em mais de um schema
const email = z
  .string()
  .trim()
  .min(1, "Informe o e-mail.")
  .pipe(z.email("Informe um e-mail válido."));

const nomeCompleto = z
  .string()
  .trim()
  .min(1, "Informe o nome completo.")
  .max(80, "O nome deve ter no máximo 80 caracteres.")
  // Nome completo = pelo menos duas palavras (nome e sobrenome)
  .refine((valor) => valor.split(/\s+/).length >= 2, {
    message: "Informe o nome completo (nome e sobrenome).",
  });

const senhaNova = z
  .string()
  .min(8, "A senha deve ter pelo menos 8 caracteres.")
  .max(72, "A senha deve ter no máximo 72 caracteres.");

export const cadastroSchema = z
  .object({
    nome: nomeCompleto,
    email,
    senha: senhaNova,
    confirmarSenha: z.string().min(1, "Confirme a senha."),
  })
  // Validação que depende de dois campos: confirmação igual à senha
  .refine((dados) => dados.senha === dados.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"], // mostra o erro no campo de confirmação
  });

export const loginSchema = z.object({
  email,
  senha: z.string().min(1, "Informe a senha."),
});

export const perfilSchema = z.object({
  nome: nomeCompleto,
});
