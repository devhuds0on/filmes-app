import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { cadastroSchema } from "../schemas/authSchemas";
import { traduzirErroSupabase } from "../utils/erroSupabase";
import CampoFormulario from "../components/CampoFormulario";

export default function Cadastro() {
  const { usuario, cadastrar } = useAuth();
  const navigate = useNavigate();
  const [sucesso, setSucesso] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cadastroSchema),
    mode: "onTouched", // valida ao sair do campo e, depois, a cada digitação
    defaultValues: { nome: "", email: "", senha: "", confirmarSenha: "" },
  });

  // Só chega aqui se os dados passaram pelo schema do Zod
  async function onSubmit(dados) {
    setSucesso(null);
    try {
      const { data, error } = await cadastrar(dados);

      if (error) {
        const mensagem = traduzirErroSupabase(error);
        // Alguns erros fazem mais sentido embaixo do campo
        if (error.code === "weak_password") {
          setError("senha", { message: mensagem });
        } else if (error.code === "user_already_exists" || error.code === "email_exists") {
          setError("email", { message: mensagem });
        } else {
          setError("root.servidor", { message: mensagem });
        }
        return;
      }

      // Com confirmação de e-mail ativa, o Supabase não informa que o e-mail
      // já existe: ele devolve um usuário sem identidades
      if (data.user && data.user.identities?.length === 0) {
        setError("email", { message: "Já existe uma conta com este e-mail." });
        return;
      }

      if (data.session) {
        navigate("/registros", { replace: true });
      } else {
        setSucesso("Cadastro feito! Enviamos um link de confirmação para o seu e-mail.");
      }
    } catch (erro) {
      setError("root.servidor", { message: traduzirErroSupabase(erro) });
    }
  }

  if (usuario) return <Navigate to="/registros" replace />;

  return (
    <div className="formulario-container">
      <h1>Cadastro</h1>

      {sucesso ? (
        <p className="mensagem-sucesso" role="status">{sucesso}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CampoFormulario id="nome" label="Nome completo" autoComplete="name"
            registro={register("nome")} erro={errors.nome} />
          <CampoFormulario id="email" label="E-mail" type="email" autoComplete="email"
            registro={register("email")} erro={errors.email} />
          <CampoFormulario id="senha" label="Senha" type="password" autoComplete="new-password"
            registro={register("senha")} erro={errors.senha} />
          <CampoFormulario id="confirmarSenha" label="Confirmar senha" type="password"
            autoComplete="new-password" registro={register("confirmarSenha")}
            erro={errors.confirmarSenha} />

          {errors.root?.servidor && (
            <p className="erro-servidor" role="alert">{errors.root.servidor.message}</p>
          )}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      )}

      <p>Já tem conta? <Link to="/login">Entrar</Link></p>
    </div>
  );
}
