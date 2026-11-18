# Catálogo de Filmes — Validação de Formulários com React Hook Form, Zod e Supabase

Aplicação React + Vite com autenticação pelo **Supabase Auth**, sessão compartilhada
com **Context API**, **rotas protegidas** com React Router e formulários validados com
**React Hook Form** + **Zod**. Os erros devolvidos pelo Supabase são tratados e mostrados
ao usuário em português, e o banco de dados também valida os dados com uma
**constraint CHECK** e **políticas RLS**.

## Rotas

| Rota              | Página                | Acesso      |
| ----------------- | --------------------- | ----------- |
| `/`               | Início                | Público     |
| `/login`          | Login                 | Público     |
| `/registro`       | Cadastro              | Público     |
| `/registros`      | Listagem de filmes    | Autenticado |
| `/registros/novo` | Novo filme            | Autenticado |
| `/registros/:id`  | Detalhes de um filme  | Autenticado |
| `/perfil`         | Perfil do usuário     | Autenticado |

Quem acessa uma rota protegida sem estar logado é enviado para `/login` e, depois de
entrar, volta para a página que tentou abrir.

## Tecnologias

- React + Vite
- React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `Navigate`, `Outlet`, `useParams`, `useNavigate`, `useLocation`)
- Supabase Auth e Supabase Client (`@supabase/supabase-js`)
- Context API (`AuthContext`)
- React Hook Form (`useForm`, `register`, `handleSubmit`, `setError`, `reset`, `formState`)
- Zod + `@hookform/resolvers` (`zodResolver`)

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com os dados do projeto Supabase
   (Project Settings → API):

   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publishable-ou-anon
   ```

   Use apenas a chave pública (anon/publishable). **Nunca** coloque a chave
   `service_role`/secret no front-end nem no repositório.

3. No painel do Supabase:
   - Em **Authentication → Providers**, deixe o provedor **Email** ativado.
   - No **SQL Editor**, rode o arquivo [`supabase/etapa5.sql`](supabase/etapa5.sql)
     (cria a coluna `user_id`, a constraint do título e as políticas RLS).

4. Rode o projeto:

   ```bash
   npm run dev
   ```

## Estrutura

```
src/
├── components/
│   ├── CampoFormulario.jsx   # label + input + mensagem de erro
│   ├── Menu.jsx              # links mudam se o usuário está logado
│   └── RotaProtegida.jsx     # redireciona para /login sem sessão
├── contexts/
│   └── AuthContext.jsx       # sessão, cadastrar, entrar, sair, atualizarPerfil
├── pages/                    # Home, Login, Cadastro, Filmes, NovoFilme, FilmeDetalhe, Perfil
├── schemas/
│   ├── authSchemas.js        # schemas do Zod: cadastro, login e perfil
│   └── filmeSchema.js        # schema do Zod: novo filme
├── utils/
│   └── erroSupabase.js       # traduz erros do Supabase Auth e do banco
└── supabaseClient.js
supabase/
└── etapa5.sql                # constraint CHECK + políticas RLS + testes
```

## Regras de validação

### Cadastro (`src/schemas/authSchemas.js`)
- **Nome completo:** obrigatório, com nome e sobrenome (pelo menos duas palavras).
- **E-mail:** formato válido.
- **Senha:** no mínimo 8 caracteres.
- **Confirmação de senha:** igual à senha (`refine` com `path: ["confirmarSenha"]`).

### Login
- **E-mail:** formato válido.
- **Senha:** obrigatória.

### Novo filme (`src/schemas/filmeSchema.js`)
- **Título:** de 2 a 100 caracteres (mesma regra da constraint do banco).
- **Diretor:** de 2 a 80 caracteres. **Gênero:** de 2 a 40 caracteres.
- **Ano de lançamento:** número inteiro entre 1888 e o ano atual + 5.
- **Nota:** de 0 a 10. **Assistido:** verdadeiro/falso.

Todos os formulários usam `mode: "onTouched"`: o campo é validado quando o usuário sai
dele e, depois disso, a cada digitação. O botão fica desabilitado enquanto
`formState.isSubmitting` é verdadeiro.

## Tratamento dos erros do Supabase

Toda chamada ao Supabase confere o `error` devolvido. A mensagem técnica original
(`error.message`, em inglês) **nunca** é exibida: o arquivo `src/utils/erroSupabase.js`
usa o `error.code` para escolher uma mensagem em português.

| Onde        | Código                       | Mensagem mostrada                         | Onde aparece        |
| ----------- | ---------------------------- | ----------------------------------------- | ------------------- |
| Login       | `invalid_credentials`        | E-mail ou senha inválidos.                | Erro geral          |
| Login       | `email_not_confirmed`        | Confirme seu e-mail antes de entrar.      | Erro geral          |
| Cadastro    | `user_already_exists`        | Já existe uma conta com este e-mail.      | Campo e-mail        |
| Cadastro    | `weak_password`              | Senha fraca. Use uma senha mais forte.    | Campo senha         |
| Auth        | `over_request_rate_limit`    | Muitas tentativas. Aguarde um pouco.      | Erro geral          |
| Novo filme  | `23514` (constraint CHECK)   | O título deve ter entre 2 e 100 caracteres. | Campo título      |
| Novo filme  | `42501` (política RLS)       | Você não tem permissão para fazer isso.   | Erro geral          |
| Qualquer    | falha de rede                | Não foi possível conectar ao servidor.    | Erro geral          |

Os erros entram no formulário com `setError`: os ligados a um campo aparecem embaixo
dele, e os gerais ficam em `errors.root.servidor`, acima do botão.

Com a confirmação de e-mail ativada, o Supabase não informa diretamente que o e-mail
já existe (para não revelar quais e-mails estão cadastrados): ele devolve um usuário
com `identities` vazio, e a aplicação trata isso como "e-mail já cadastrado".

## Etapa 5 — Validação no banco de dados

Comandos aplicados: [`supabase/etapa5.sql`](supabase/etapa5.sql)

- **Constraint `filmes_titulo_tamanho`:** `CHECK (char_length(btrim(titulo)) BETWEEN 2 AND 100)`.
- **RLS ativado** na tabela `filmes`.
- **Política de leitura:** usuários autenticados podem ver os filmes (`USING (true)`).
- **Política de inserção:** só é possível inserir em nome do próprio usuário
  (`WITH CHECK ((select auth.uid()) = user_id)`).

### Teste A — constraint, pelo SQL Editor (sem o formulário)

```sql
insert into public.filmes (titulo, diretor, genero, ano_lancamento, nota, assistido)
values ('A', 'Teste', 'Teste', 2024, 5, false);
```

**Resultado:** _(colar aqui o erro mostrado pelo SQL Editor)_

### Teste B — política RLS, pela API REST sem login (Postman/Insomnia)

```
POST https://SEU-PROJETO.supabase.co/rest/v1/filmes
Headers:
  apikey: SUA_CHAVE_PUBLICA
  Content-Type: application/json
Body:
  { "titulo": "Filme pirata", "diretor": "Teste", "genero": "Teste",
    "ano_lancamento": 2024, "nota": 5, "assistido": false }
```

**Resultado:** _(colar aqui o status e o corpo da resposta)_

**Conclusão:** mesmo ignorando o formulário (e, portanto, o Zod), o banco recusou os
dados inválidos. A validação do front-end melhora a experiência do usuário, mas quem
garante a integridade e a segurança é o Supabase.

## Respostas — seção 8

**1. Qual é a vantagem de utilizar o React Hook Form em relação a controlar cada campo com `useState`?**
Com `useState`, cada campo precisa de um estado, de um `onChange` e de uma lógica de
validação própria, e cada letra digitada renderiza o componente de novo. O React Hook
Form registra os campos com `register`, guarda os valores sem criar um estado por campo
(evitando renderizações desnecessárias) e já entrega os erros, o envio
(`handleSubmit`) e o estado do formulário (`isSubmitting`, `isDirty`) prontos. O código
fica menor e mais organizado.

**2. Qual é o papel do Zod e do `zodResolver`?**
O Zod descreve as regras dos dados em um schema (tipo, tamanho, formato, campos que
dependem de outros) e valida um objeto contra essas regras, devolvendo mensagens de
erro. O `zodResolver` é a "ponte" entre o Zod e o React Hook Form: ele faz o formulário
usar o schema para validar e transforma os erros do Zod no formato de `formState.errors`.
Assim as regras ficam fora do JSX, em arquivos separados e reaproveitáveis.

**3. Por que a validação no front-end não é suficiente para garantir a segurança dos dados?**
Porque o front-end roda no navegador do usuário e pode ser ignorado: qualquer pessoa
pode desativar o JavaScript, alterar o código pelo DevTools ou chamar a API do Supabase
direto (Postman, curl), sem passar pelo formulário. Por isso as regras importantes
precisam existir também no servidor (Supabase Auth, constraints e RLS), como mostra o
teste da Etapa 5.

**4. Qual é a diferença entre um erro de validação do formulário e um erro devolvido pelo Supabase?**
O erro de validação acontece no navegador, antes de qualquer envio: o Zod percebe que o
dado está fora das regras e o formulário nem chega a chamar o servidor. O erro do
Supabase acontece depois do envio: os dados estavam no formato certo, mas o servidor
recusou por uma regra que só ele conhece ou garante — e-mail já cadastrado, senha
incorreta, constraint ou política RLS violada, limite de tentativas.

**5. Por que o login deve exibir uma mensagem genérica para credenciais inválidas?**
Se a mensagem dissesse "e-mail não encontrado" ou "senha incorreta", um atacante
saberia quais e-mails têm conta no sistema e poderia focar nesses e-mails para tentar
adivinhar senhas (enumeração de usuários). Com "E-mail ou senha inválidos", ele não
descobre qual dos dois está errado.

**6. Qual é a função das constraints e do `WITH CHECK` do RLS?**
As constraints são regras do próprio banco que todo dado precisa cumprir, venha de onde
vier; a `CHECK` testa uma condição (aqui, o tamanho do título) e recusa a linha se ela
for falsa. O `WITH CHECK` de uma política RLS confere a linha nova em `INSERT`/`UPDATE`
e só deixa gravar se a condição for verdadeira — aqui, que o `user_id` seja o do usuário
logado. Já o `USING` decide quais linhas existentes o usuário pode ver, alterar ou apagar.

## Notas da pesquisa

- **Pacotes:** `react-hook-form`, `zod` e `@hookform/resolvers`. A versão 5 ou maior do
  `@hookform/resolvers` é compatível com o Zod 4 (o `package.json` do resolver aceita
  `zod ^3.25.0 || ^4.0.0`).
- **Envio só com dados válidos:** `handleSubmit(onSubmit)` só chama `onSubmit` se o schema
  aprovar os dados.
- **Campo que depende de outro:** `.refine()` no objeto, com `path` apontando o campo
  onde o erro deve aparecer.
- **`mode` do `useForm`:** define quando a validação roda — `onSubmit` (padrão),
  `onBlur`, `onChange`, `onTouched` e `all`.
- **Formulário enviando:** `formState.isSubmitting`.
- **Erro vindo do servidor:** `setError("campo", { message })` ou
  `setError("root.servidor", { message })` para erros gerais.
- **Objeto de erro do Supabase Auth:** `name`, `message`, `status` (HTTP) e `code`
  (ex.: `invalid_credentials`). Erros do banco (PostgREST) trazem `code` (do PostgreSQL,
  ex.: `23514`, `42501`), `message`, `details` e `hint`.
- **Limpar o formulário:** `reset()` com os valores iniciais.
- **Tamanho mínimo e máximo com Zod:** `z.string().min(n, "msg").max(n, "msg")`.

## Fontes consultadas

- React Hook Form — Get Started: https://react-hook-form.com/get-started
- React Hook Form — `useForm` (`mode`, `formState`, `reset`): https://react-hook-form.com/docs/useform
- React Hook Form — `setError`: https://react-hook-form.com/docs/useform/seterror
- Resolvers (Zod): https://github.com/react-hook-form/resolvers#zod
- Zod — Basics e API: https://zod.dev/basics e https://zod.dev/api
- Supabase — Password-based Auth: https://supabase.com/docs/guides/auth/passwords
- Supabase — Error codes do Auth: https://supabase.com/docs/guides/auth/debugging/error-codes
- Supabase — Row Level Security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase — `insert` (JavaScript): https://supabase.com/docs/reference/javascript/insert
- PostgreSQL — Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL — Códigos de erro: https://www.postgresql.org/docs/current/errcodes-appendix.html

## Dificuldades encontradas

- O `npm` não era reconhecido no terminal: o Node.js tinha sido baixado em `.zip` e não
  estava no PATH. Resolvido instalando pelo instalador `.msi`.
- O PowerShell bloqueava o `npm` ("execução de scripts foi desabilitada"). Resolvido com
  `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.
- O primeiro commit falhou porque o Git não tinha nome e e-mail configurados
  (`git config --global user.name/user.email`).
- Com a confirmação de e-mail ativa, o Supabase não devolve erro ao cadastrar um e-mail
  repetido; foi preciso verificar `user.identities` vazio.
