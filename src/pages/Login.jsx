import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { loginSchema } from "../schemas/authSchemas";
import { traduzirErroSupabase } from "../utils/erroSupabase";
import CampoFormulario from "../components/CampoFormulario";

export default function Login() {
  const { usuario, entrar } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.de || "/perfil";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  async function onSubmit(dados) {
    try {
      const { error } = await entrar(dados);
      if (error) {
        setError("root.servidor", { message: traduzirErroSupabase(error) });
        return;
      }
      navigate(destino, { replace: true });
    } catch (erro) {
      setError("root.servidor", { message: traduzirErroSupabase(erro) });
    }
  }

  if (usuario) return <Navigate to={destino} replace />;

  return (
    <div className="formulario-container">
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CampoFormulario id="email" label="E-mail" type="email" autoComplete="email"
          registro={register("email")} erro={errors.email} />
        <CampoFormulario id="senha" label="Senha" type="password" autoComplete="current-password"
          registro={register("senha")} erro={errors.senha} />

        {errors.root?.servidor && (
          <p className="erro-servidor" role="alert">{errors.root.servidor.message}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>Não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
    </div>
  );
}
