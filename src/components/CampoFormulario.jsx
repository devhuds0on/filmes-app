// Campo reutilizável: label + input + mensagem de erro do React Hook Form
export default function CampoFormulario({ id, label, type = "text", registro, erro, ...resto }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        aria-invalid={erro ? "true" : "false"}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...registro}
        {...resto}
      />
      {erro && (
        <span id={`${id}-erro`} className="erro-campo" role="alert">
          {erro.message}
        </span>
      )}
    </div>
  );
}
