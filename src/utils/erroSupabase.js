import { isAuthError, isAuthRetryableFetchError } from "@supabase/supabase-js";

// Mensagens em português para os códigos de erro do Supabase Auth
// Lista completa: https://supabase.com/docs/guides/auth/debugging/error-codes
const mensagens = {
  invalid_credentials: "E-mail ou senha incorretos.",
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
  user_not_found: "Usuário não encontrado.",
  same_password: "A nova senha deve ser diferente da atual.",
  validation_failed: "Dados inválidos. Confira os campos.",
};

export function traduzirErroSupabase(error) {
  if (!error) return null;

  // Falha de rede (sem internet, Supabase fora do ar etc.)
  if (isAuthRetryableFetchError(error)) {
    return "Não foi possível conectar ao servidor. Verifique sua internet.";
  }

  if (isAuthError(error)) {
    if (error.code && mensagens[error.code]) return mensagens[error.code];
    if (error.status === 429) return mensagens.over_request_rate_limit;
  }

  return "Ocorreu um erro inesperado. Tente novamente.";
}
