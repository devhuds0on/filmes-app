import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Menu() {
  const { usuario } = useAuth();

  return (
    <nav>
      <Link to="/">Início</Link> | <Link to="/registros">Filmes</Link> |{" "}
      {usuario ? (
        <Link to="/perfil">Perfil ({usuario.user_metadata?.nome || usuario.email})</Link>
      ) : (
        <>
          <Link to="/login">Entrar</Link> | <Link to="/cadastro">Cadastrar</Link>
        </>
      )}
    </nav>
  );
}
