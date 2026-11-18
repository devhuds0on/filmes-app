import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";

// Pode ser usada envolvendo um componente (children)
// ou como rota "pai" de várias rotas protegidas (Outlet)
export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();
  const location = useLocation();

  if (carregando) return <p>Carregando...</p>;

  // Sem usuário logado: manda para o login e guarda a página de origem
  if (!usuario) {
    return <Navigate to="/login" replace state={{ de: location.pathname }} />;
  }

  return children ?? <Outlet />;
}
