import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "../supabaseClient";

export default function Filmes() {
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase.from("filmes").select("*");
      if (error) setErro(error.message);
      else setFilmes(data);
      setCarregando(false);
    }
    carregar();
  }, []);

  if (carregando) return <p>Carregando...</p>;
  if (erro) return <p>Erro ao carregar os filmes: {erro}</p>;
  if (filmes.length === 0) return <p>Nenhum filme cadastrado.</p>;

  return (
    <div>
      <h1>Filmes</h1>
      <ul>
        {filmes.map((f) => (
          <li key={f.id}>
            <Link to={`/registros/${f.id}`}>{f.titulo}</Link> ({f.ano})
          </li>
        ))}
      </ul>
    </div>
  );
}
