# Catálogo de Filmes

Aplicação React + Vite que usa React Router para navegar entre páginas e o
Supabase para consultar uma tabela de filmes e autenticar usuários.

Os formulários de cadastro, login e perfil usam **React Hook Form**, com as
regras de validação descritas em schemas do **Zod**. Os erros devolvidos pelo
**Supabase Auth** são tratados e mostrados em português.

## Páginas

| Página   | Rota             | Acesso    | Descrição                                     |
| -------- | ---------------- | --------- | --------------------------------------------- |
| Início   | `/`              | Pública   | Apresenta a aplicação                         |
| Listagem | `/registros`     | Pública   | Lista os filmes armazenados no Supabase       |
| Detalhes | `/registros/:id` | Pública   | Mostra os dados de um filme específico        |
| Cadastro | `/cadastro`      | Pública   | Cria uma conta com nome, e-mail e senha       |
| Login    | `/login`         | Pública   | Entra com e-mail e senha                      |
| Perfil   | `/perfil`        | Protegida | Mostra os dados do usuário e permite editar o nome |

Quem tenta abrir `/perfil` sem estar logado é enviado para `/login` e, depois
de entrar, volta para a página em que estava.

## Tecnologias

- React e Vite
- React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `Navigate`, `useParams`, `useNavigate`, `useLocation`)
- Supabase Client (`@supabase/supabase-js`): banco de dados e Auth
- Context API (`AuthContext`) para compartilhar a sessão do usuário
- React Hook Form (`useForm`, `register`, `handleSubmit`, `setError`, `formState`)
- Zod (schemas de validação) + `@hookform/resolvers` (`zodResolver`)

## Como executar

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie `.env.example` para `.env` e preencha com os dados do seu projeto
   Supabase (Project Settings → API):

   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publishable-ou-anon
   ```

   Use apenas a chave pública (anon/publishable). **Nunca** coloque a chave
   `service_role` no front-end nem no repositório.

3. No painel do Supabase, em Authentication → Providers, deixe o provedor
   **Email** ativado. Se a opção *Confirm email* estiver ligada, o usuário
   precisa clicar no link enviado por e-mail antes de conseguir entrar.

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
├── pages/                    # Home, Filmes, FilmeDetalhe, Cadastro, Login, Perfil
├── schemas/
│   └── authSchemas.js        # schemas do Zod (cadastro, login, perfil)
├── utils/
│   └── erroSupabase.js       # traduz os códigos de erro do Supabase Auth
└── supabaseClient.js
```

## Validação

### No front-end (Zod + React Hook Form)

As regras ficam em `src/schemas/authSchemas.js`:

- **Nome:** obrigatório, de 2 a 60 caracteres.
- **E-mail:** obrigatório e em formato válido (espaços nas pontas são removidos).
- **Senha:** de 6 a 72 caracteres (6 é o mínimo padrão do Supabase).
- **Confirmar senha:** precisa ser igual à senha (`refine` com `path: ["confirmarSenha"]`).

O `zodResolver` liga o schema ao `useForm`. A função `onSubmit` só é chamada
quando os dados passam em todas as regras; caso contrário, cada erro aparece
embaixo do seu campo (`formState.errors`).

### Erros do Supabase

A validação no front-end melhora a experiência do usuário, mas **não substitui
a validação do Supabase**: qualquer pessoa pode chamar a API sem passar pelo
formulário, e algumas regras só o servidor conhece (e-mail já cadastrado,
senha incorreta, e-mail não confirmado, limite de tentativas).

Por isso, toda chamada ao Supabase confere o `error` devolvido. A função
`traduzirErroSupabase` (em `src/utils/erroSupabase.js`) usa o `error.code` para
escolher uma mensagem em português. Alguns exemplos:

| Código                       | Mensagem mostrada                                    |
| ---------------------------- | ---------------------------------------------------- |
| `invalid_credentials`        | E-mail ou senha incorretos.                          |
| `email_not_confirmed`        | Confirme seu e-mail antes de entrar.                 |
| `user_already_exists`        | Já existe uma conta com este e-mail.                 |
| `weak_password`              | Senha fraca. Use uma senha mais forte.               |
| `over_email_send_rate_limit` | Muitos e-mails enviados. Aguarde alguns minutos.     |
| falha de rede                | Não foi possível conectar ao servidor.               |

Os erros são colocados no formulário com `setError`: os que dizem respeito a
um campo (senha fraca, e-mail já cadastrado) aparecem embaixo dele, e os
gerais aparecem em `errors.root.servidor`, acima do botão.

Com a confirmação de e-mail ativada, o Supabase não informa diretamente que o
e-mail já existe (para não revelar quais e-mails estão cadastrados). Nesse caso,
ele devolve um usuário com `identities` vazio, e a aplicação trata isso como
"e-mail já cadastrado".

## Pesquisa: documentação consultada

- React Hook Form: Get Started e API `useForm` / `setError`
  - https://react-hook-form.com/get-started
  - https://react-hook-form.com/docs/useform/seterror
- Resolver do Zod para React Hook Form
  - https://github.com/react-hook-form/resolvers#zod
- Zod: schemas básicos, `z.email()` e `refine`
  - https://zod.dev/basics
  - https://zod.dev/api
- Supabase Auth com senha (`signUp`, `signInWithPassword`, `updateUser`, `signOut`)
  - https://supabase.com/docs/guides/auth/passwords
  - https://supabase.com/docs/reference/javascript/auth-signup
- Supabase: tratamento de erros e códigos de erro do Auth
  - https://supabase.com/docs/guides/auth/debugging/error-codes
- React Router: `Navigate`, `useNavigate`, `useLocation`
  - https://reactrouter.com/
