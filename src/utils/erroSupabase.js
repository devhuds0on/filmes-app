import { isAuthError, isAuthRetryableFetchError } from "@supabase/supabase-js";

const ERRO_GENERICO = "Ocorreu um erro inesperado. Tente novamente.";

// Mensagens em português para os códigos de erro do Supabase Auth
// Lista completa: https://supabase.com/docs/guides/auth/debugging/error-codes
const mensagensAuth = {
  // Mensagem genérica de propósito: não revela se o e-mail existe ou se a senha está errada
  invalid_credentials: "E-mail ou senha inválidos.",
  email_not_confirmed: "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.",
  user_already_exists: "Já existe uma conta com este e-mail.",
  email_exists: "Já existe uma conta com este e-mail.",
  weak_password: "Senha fraca. Use uma senha mais forte.",
  email_address_invalid: "Este e-mail não é aceito. Tente outro endereço.",
  signup_disabled: "O cadastro de novos usuários está desativado.",
  over_email_send_rate_limit: "Muitos e-mails enviados. Aguarde alguns minutos e tente de novo.",
  over_request_rate_limit: "Muitas tentativas. Aguarde um pouco e tente de novo.",
  session_expired: "Sua sessão expirou. Entre novamente.",
  session_not_found: "Sua sessão expirou. Entre novamente.",
  same_password: "A nova senha deve ser diferente da atual.",
  validation_failed: "Dados inválidos. Confira os campos.",
};

// Erros do Supabase Auth (cadastro, login, perfil)
export function traduzirErroSupabase(error) {
  if (!error) return null;

  // Falha de rede (sem internet, Supabase fora do ar etc.)
  if (isAuthRetryableFetchError(error)) {
    return "Não foi possível conectar ao servidor. Verifique sua internet.";
  }

  if (isAuthError(error)) {
    if (error.code && mensagensAuth[error.code]) return mensagensAuth[error.code];
    if (error.status === 429) return mensagensAuth.over_request_rate_limit;
  }

  // Nunca mostramos error.message: é técnico e em inglês
  return ERRO_GENERICO;
}

// Códigos do PostgreSQL devolvidos pelo Supabase Client em consultas/inserções
// https://www.postgresql.org/docs/current/errcodes-appendix.html
const mensagensBanco = {
  23514: "O banco recusou os dados: algum valor está fora das regras (ex.: tamanho do título).",
  42501: "Você não tem permissão para fazer isso. Entre na sua conta e tente de novo.",
  23505: "Já existe um registro com esses dados.",
  23502: "Preencha todos os campos obrigatórios.",
  "22P02": "Algum valor está em um formato inválido.",
  PGRST301: "Sua sessão expirou. Entre novamente.",
};

// Erros do banco (Supabase Client: insert, select...)
export function traduzirErroBanco(error) {
  if (!error) return null;
  if (error.code && mensagensBanco[error.code]) return mensagensBanco[error.code];
  if (error.message?.includes("Failed to fetch")) {
    return "Não foi possível conectar ao servidor. Verifique sua internet.";
  }
  return ERRO_GENERICO;
}
