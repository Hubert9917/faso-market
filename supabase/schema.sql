-- Faso Market — schema de base (comptes, boutiques, produits)
-- À exécuter dans Supabase Dashboard > SQL Editor (une seule fois).
-- Les comptes marchands utilisent directement Supabase Auth (table auth.users),
-- donc pas besoin d'une table "profiles" séparée pour le MVP.

-- 1) BOUTIQUES ---------------------------------------------------------
create table if not exists public.boutiques (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id) on delete cascade,
  nom text not null,
  slug text not null unique,
  ville text not null default 'Ouaga',
  type text not null default 'Alimentation',
  whatsapp text not null,
  description text,
  created_at timestamptz not null default now(),
  -- un seul marchand = une seule boutique pour le MVP
  constraint boutiques_owner_unique unique (owner_id)
);

alter table public.boutiques enable row level security;

create policy "Boutiques visibles publiquement"
  on public.boutiques for select
  using (true);

create policy "Un marchand cree sa propre boutique"
  on public.boutiques for insert
  with check (auth.uid() = owner_id);

create policy "Un marchand modifie sa propre boutique"
  on public.boutiques for update
  using (auth.uid() = owner_id);

create policy "Un marchand supprime sa propre boutique"
  on public.boutiques for delete
  using (auth.uid() = owner_id);

-- 2) PRODUITS -----------------------------------------------------------
create table if not exists public.produits (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references public.boutiques (id) on delete cascade,
  nom text not null,
  prix numeric(12, 2) not null check (prix >= 0),
  stock integer not null default 0 check (stock >= 0),
  photo_url text,
  created_at timestamptz not null default now()
);

alter table public.produits enable row level security;

create policy "Produits visibles publiquement"
  on public.produits for select
  using (true);

create policy "Un marchand ajoute des produits a sa boutique"
  on public.produits for insert
  with check (
    boutique_id in (select id from public.boutiques where owner_id = auth.uid())
  );

create policy "Un marchand modifie les produits de sa boutique"
  on public.produits for update
  using (
    boutique_id in (select id from public.boutiques where owner_id = auth.uid())
  );

create policy "Un marchand supprime les produits de sa boutique"
  on public.produits for delete
  using (
    boutique_id in (select id from public.boutiques where owner_id = auth.uid())
  );

-- 3) STOCKAGE PHOTOS PRODUITS --------------------------------------------
insert into storage.buckets (id, name, public)
values ('produits', 'produits', true)
on conflict (id) do nothing;

create policy "Photos produits visibles publiquement"
  on storage.objects for select
  using (bucket_id = 'produits');

create policy "Marchand connecte peut uploader une photo"
  on storage.objects for insert
  with check (bucket_id = 'produits' and auth.role() = 'authenticated');

create policy "Marchand peut modifier ses photos"
  on storage.objects for update
  using (bucket_id = 'produits' and auth.uid() = owner);

create policy "Marchand peut supprimer ses photos"
  on storage.objects for delete
  using (bucket_id = 'produits' and auth.uid() = owner);
