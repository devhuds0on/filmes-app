import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { supabase } from "../supabaseClient";
import { traduzirErroBanco } from "../utils/erroSupabase";

export default function Filmes() {
  const location = useLocation();
  const mensagemSucesso = location.state?.mensagem; // vem da página de novo filme
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase
        .from("filmes")
        .select("*")
        .order("id", { ascending: true });
      if (error) setErro(traduzirErroBanco(error));
      else setFilmes(data);
      setCarregando(false);
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p className="erro-servidor">Erro ao carregar os filmes: {erro}</p>;

  return (
    <div>
      <h1>Filmes</h1>
      {mensagemSucesso && (
        <p className="mensagem-sucesso" role="status">{mensagemSucesso}</p>
      )}
      <p><Link to="/registros/novo">+ Cadastrar novo filme</Link></p>

      {filmes.length === 0 ? (
        <p>Nenhum filme cadastrado.</p>
      ) : (
        <ul>
          {filmes.map((f) => (
            <li key={f.id}>
              <Link to={`/registros/${f.id}`}>{f.titulo}</Link> ({f.ano_lancamento})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
