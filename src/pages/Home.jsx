import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const { usuario } = useAuth();

  return (
    <div>
      <h1>Catálogo de Filmes</h1>
      {usuario ? (
        <p>
          <Link to="/registros">Ver filmes</Link> ou{" "}
          <Link to="/registros/novo">cadastrar um novo filme</Link>.
        </p>
      ) : (
        <p>
          <Link to="/login">Entre</Link> ou <Link to="/registro">crie uma conta</Link> para
          ver e cadastrar filmes.
        </p>
      )}
    </div>
  );
}
