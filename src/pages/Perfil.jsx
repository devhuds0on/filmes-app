import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { perfilSchema } from "../schemas/authSchemas";
import { traduzirErroSupabase } from "../utils/erroSupabase";
import CampoFormulario from "../components/CampoFormulario";

export default function Perfil() {
  const { usuario, atualizarPerfil, sair } = useAuth();
  const navigate = useNavigate();
  const [sucesso, setSucesso] = useState(null);
  const [erroSair, setErroSair] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nome: usuario?.user_metadata?.nome ?? "" },
  });

  async function onSubmit(dados) {
    setSucesso(null);
    try {
      const { data, error } = await atualizarPerfil(dados);
      if (error) {
        setError("root.servidor", { message: traduzirErroSupabase(error) });
        return;
      }
      reset({ nome: data.user.user_metadata.nome }); // novo valor vira o padrão
      setSucesso("Perfil atualizado!");
    } catch (erro) {
      setError("root.servidor", { message: traduzirErroSupabase(erro) });
    }
  }

  async function handleSair() {
    setErroSair(null);
    const { error } = await sair();
    if (error) {
      setErroSair(traduzirErroSupabase(error));
      return;
    }
    navigate("/login", { replace: true });
  }

  return (
    <div className="formulario-container">
      <h1>Meu perfil</h1>
      <p><strong>E-mail:</strong> {usuario.email}</p>
      <p><strong>Conta criada em:</strong> {new Date(usuario.created_at).toLocaleDateString("pt-BR")}</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CampoFormulario id="nome" label="Nome" autoComplete="name"
          registro={register("nome")} erro={errors.nome} />

        {errors.root?.servidor && (
          <p className="erro-servidor" role="alert">{errors.root.servidor.message}</p>
        )}
        {sucesso && <p className="mensagem-sucesso" role="status">{sucesso}</p>}

        <button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </button>
      </form>

      <button type="button" className="botao-secundario" onClick={handleSair}>Sair</button>
      {erroSair && <p className="erro-servidor" role="alert">{erroSair}</p>}
    </div>
  );
}
