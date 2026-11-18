import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Menu() {
  const { usuario } = useAuth();

  return (
    <nav>
      <Link to="/">Início</Link>
      {usuario ? (
        <>
          {" | "}<Link to="/registros">Filmes</Link>
          {" | "}<Link to="/registros/novo">Novo filme</Link>
          {" | "}<Link to="/perfil">Perfil ({usuario.user_metadata?.nome || usuario.email})</Link>
        </>
      ) : (
        <>
          {" | "}<Link to="/login">Entrar</Link>
          {" | "}<Link to="/registro">Cadastrar</Link>
        </>
      )}
    </nav>
  );
}
