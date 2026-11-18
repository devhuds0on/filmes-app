import { Link } from "react-router";

export default function NaoEncontrado() {
  return (
    <div>
      <h1>Página não encontrada</h1>
      <p>O endereço acessado não existe.</p>
      <Link to="/">← Voltar para o início</Link>
    </div>
  );
}
