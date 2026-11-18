import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return <p>Carregando...</p>;

  // Sem usuário logado: manda para o login e guarda a página de origem
  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  }

  return children;
}
