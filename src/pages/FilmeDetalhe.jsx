import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { supabase } from "../supabaseClient";
import { traduzirErroBanco } from "../utils/erroSupabase";

export default function FilmeDetalhe() {
  const { id } = useParams();
  const [filme, setFilme] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      setCarregando(true);
      const { data, error } = await supabase
        .from("filmes")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) setErro(traduzirErroBanco(error));
      else setFilme(data);
      setCarregando(false);
    }
    carregar();
  }, [id]);

  const voltar = <Link to="/registros">← Voltar para a lista</Link>;

  if (carregando) return <p>Carregando...</p>;

  if (erro)
    return (
      <div>
        <p>Erro ao carregar o filme: {erro}</p>
        {voltar}
      </div>
    );

  if (!filme)
    return (
      <div>
        <p>Filme não encontrado.</p>
        {voltar}
      </div>
    );

  return (
    <div>
      <h1>Detalhes do filme</h1>
      <ul>
        {Object.entries(filme).map(([campo, valor]) => (
          <li key={campo}>
            <strong>{campo}:</strong> {String(valor)}
          </li>
        ))}
      </ul>
      {voltar}
    </div>
  );
}
