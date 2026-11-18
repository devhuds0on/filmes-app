import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Recupera a sessão salva (se o usuário já estava logado)
    supabase.auth.getSession().then(({ data }) => {
      setSessao(data.session);
      setCarregando(false);
    });

    // Escuta login, logout, atualização de perfil e renovação de token
    const { data } = supabase.auth.onAuthStateChange((_evento, novaSessao) => {
      setSessao(novaSessao);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  // As funções devolvem { data, error } do Supabase para as páginas tratarem o erro
  function cadastrar({ nome, email, senha }) {
    return supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });
  }

  function entrar({ email, senha }) {
    return supabase.auth.signInWithPassword({ email, password: senha });
  }

  function sair() {
    return supabase.auth.signOut();
  }

  function atualizarPerfil({ nome }) {
    return supabase.auth.updateUser({ data: { nome } });
  }

  const valor = {
    sessao,
    usuario: sessao?.user ?? null,
    carregando,
    cadastrar,
    entrar,
    sair,
    atualizarPerfil,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
