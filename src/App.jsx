import { Routes, Route } from "react-router";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Filmes from "./pages/Filmes";
import FilmeDetalhe from "./pages/FilmeDetalhe";
import NaoEncontrado from "./pages/NaoEncontrado";

export default function App() {
  return (
    <>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registros" element={<Filmes />} />
        <Route path="/registros/:id" element={<FilmeDetalhe />} />
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </>
  );
}
