import { z } from "zod";

const anoAtual = new Date().getFullYear();

// Mesmas regras do banco (ver supabase/etapa5.sql): o título tem de 2 a 100 caracteres
export const filmeSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(2, "O título deve ter pelo menos 2 caracteres.")
    .max(100, "O título deve ter no máximo 100 caracteres."),
  diretor: z
    .string()
    .trim()
    .min(2, "O nome do diretor deve ter pelo menos 2 caracteres.")
    .max(80, "O nome do diretor deve ter no máximo 80 caracteres."),
  genero: z
    .string()
    .trim()
    .min(2, "O gênero deve ter pelo menos 2 caracteres.")
    .max(40, "O gênero deve ter no máximo 40 caracteres."),
  // Os inputs numéricos usam valueAsNumber; campo vazio vira NaN
  ano_lancamento: z
    .number({ error: "Informe o ano de lançamento." })
    .int("O ano deve ser um número inteiro.")
    .min(1888, "O ano deve ser 1888 ou depois.")
    .max(anoAtual + 5, `O ano deve ser no máximo ${anoAtual + 5}.`),
  nota: z
    .number({ error: "Informe a nota." })
    .min(0, "A nota deve ser no mínimo 0.")
    .max(10, "A nota deve ser no máximo 10."),
  assistido: z.boolean(),
});
