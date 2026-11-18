import { Routes, Route } from "react-router";
import Menu from "./components/Menu";
import RotaProtegida from "./components/RotaProtegida";
import Home from "./pages/Home";
import Filmes from "./pages/Filmes";
import FilmeDetalhe from "./pages/FilmeDetalhe";
import NovoFilme from "./pages/NovoFilme";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import NaoEncontrado from "./pages/NaoEncontrado";

export default function App() {
  return (
    <>
      <Menu />
      <main>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Cadastro />} />

          {/* Rotas que exigem login */}
          <Route element={<RotaProtegida />}>
            <Route path="/registros" element={<Filmes />} />
            <Route path="/registros/novo" element={<NovoFilme />} />
            <Route path="/registros/:id" element={<FilmeDetalhe />} />
            <Route path="/perfil" element={<Perfil />} />
          </Route>

          <Route path="*" element={<NaoEncontrado />} />
        </Routes>
      </main>
    </>
  );
}
