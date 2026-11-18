import { Routes, Route } from "react-router";
import Menu from "./components/Menu";
import RotaProtegida from "./components/RotaProtegida";
import Home from "./pages/Home";
import Filmes from "./pages/Filmes";
import FilmeDetalhe from "./pages/FilmeDetalhe";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import Perfil from "./pages/Perfil";
import NaoEncontrado from "./pages/NaoEncontrado";

export default function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registros" element={<Filmes />} />
        <Route path="/registros/:id" element={<FilmeDetalhe />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </>
  );
}
