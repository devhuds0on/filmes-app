import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { filmeSchema } from "../schemas/filmeSchema";
import { traduzirErroBanco } from "../utils/erroSupabase";
import CampoFormulario from "../components/CampoFormulario";

const valoresIniciais = {
  titulo: "",
  diretor: "",
  genero: "",
  ano_lancamento: undefined,
  nota: undefined,
  assistido: false,
};

export default function NovoFilme() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(filmeSchema),
    mode: "onTouched",
    defaultValues: valoresIniciais,
  });

  async function onSubmit(dados) {
    try {
      const { error } = await supabase
        .from("filmes")
        .insert({ ...dados, user_id: usuario.id });

      if (error) {
        const mensagem = traduzirErroBanco(error);
        // Violação da constraint do título: mostra o erro no próprio campo
        if (error.code === "23514" && error.message?.includes("titulo")) {
          setError("titulo", { message: "O título deve ter entre 2 e 100 caracteres." });
        } else {
          setError("root.servidor", { message: mensagem });
        }
        return;
      }

      reset(valoresIniciais); // limpa o formulário
      navigate("/registros", { state: { mensagem: `Filme "${dados.titulo}" cadastrado com sucesso!` } });
    } catch (erro) {
      setError("root.servidor", { message: traduzirErroBanco(erro) });
    }
  }

  return (
    <div className="formulario-container">
      <h1>Novo filme</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CampoFormulario id="titulo" label="Título"
          registro={register("titulo")} erro={errors.titulo} />
        <CampoFormulario id="diretor" label="Diretor"
          registro={register("diretor")} erro={errors.diretor} />
        <CampoFormulario id="genero" label="Gênero"
          registro={register("genero")} erro={errors.genero} />
        <CampoFormulario id="ano_lancamento" label="Ano de lançamento" type="number"
          registro={register("ano_lancamento", { valueAsNumber: true })}
          erro={errors.ano_lancamento} />
        <CampoFormulario id="nota" label="Nota (0 a 10)" type="number" step="0.1"
          registro={register("nota", { valueAsNumber: true })} erro={errors.nota} />

        <label className="campo-checkbox">
          <input type="checkbox" {...register("assistido")} />
          Já assisti
        </label>

        {errors.root?.servidor && (
          <p className="erro-servidor" role="alert">{errors.root.servidor.message}</p>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar filme"}
        </button>
      </form>

      <Link to="/registros">← Voltar para a lista</Link>
    </div>
  );
}
