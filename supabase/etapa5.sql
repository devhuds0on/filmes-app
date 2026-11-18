-- =====================================================================
-- Etapa 5 — Validação no banco de dados (tabela public.filmes)
-- Rode este arquivo inteiro no Supabase: SQL Editor → New query → Run
-- =====================================================================

-- 1) Coluna com o dono de cada filme.
--    Os filmes antigos ficam com user_id nulo (foram cadastrados antes do login existir).
--    Em novos registros, o padrão é o id do usuário logado.
alter table public.filmes
  add column if not exists user_id uuid references auth.users (id) default auth.uid();

-- 2) Constraint CHECK: o título precisa ter entre 2 e 100 caracteres
--    (sem contar espaços nas pontas). Mesmas regras do schema do Zod.
alter table public.filmes
  add constraint filmes_titulo_tamanho
  check (char_length(btrim(titulo)) between 2 and 100);

-- 3) Liga o Row Level Security na tabela.
--    A partir daqui, nada é permitido até que uma política libere.
alter table public.filmes enable row level security;

-- 4) Leitura: qualquer usuário autenticado pode ver a lista de filmes.
--    USING define QUAIS LINHAS EXISTENTES o usuário enxerga.
create policy "Usuarios autenticados podem ver os filmes"
  on public.filmes
  for select
  to authenticated
  using (true);

-- 5) Inserção: o usuário só pode inserir um filme em nome dele mesmo.
--    WITH CHECK confere a LINHA NOVA antes de gravar.
create policy "Usuarios inserem filmes somente em nome proprio"
  on public.filmes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);


-- =====================================================================
-- Testes (rodar DEPOIS do bloco acima, um de cada vez)
-- =====================================================================

-- Teste A — constraint CHECK, direto no SQL Editor (sem passar pelo formulário).
-- Esperado: ERROR 23514: new row for relation "filmes" violates check constraint "filmes_titulo_tamanho"
-- insert into public.filmes (titulo, diretor, genero, ano_lancamento, nota, assistido)
-- values ('A', 'Teste', 'Teste', 2024, 5, false);

-- Teste B — política RLS, pela API REST sem login (Postman/Insomnia), ver README.
-- Esperado: HTTP 401, código 42501: new row violates row-level security policy for table "filmes"
