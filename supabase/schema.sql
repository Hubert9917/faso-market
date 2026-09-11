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

-- 4) CATALOGUE MARKETPLACE (revente / sourcing) ---------------------------
-- Champs optionnels : un marchand (ou Faso Market lui-meme, via son propre
-- compte/boutique) peut noter le fournisseur et le prix d'achat d'un produit
-- revendu avec marge. Le prix d'achat reste prive (jamais affiche
-- publiquement), le fournisseur peut etre affiche comme badge de confiance.
alter table public.produits add column if not exists prix_achat numeric(12, 2);
alter table public.produits add column if not exists fournisseur text;

-- 5) LIVREURS -------------------------------------------------------------
create table if not exists public.livreurs (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references public.boutiques (id) on delete cascade,
  nom text not null,
  telephone text not null,
  created_at timestamptz not null default now()
);

alter table public.livreurs enable row level security;

create policy "Un marchand gere ses propres livreurs"
  on public.livreurs for all
  using (boutique_id in (select id from public.boutiques where owner_id = auth.uid()))
  with check (boutique_id in (select id from public.boutiques where owner_id = auth.uid()));

-- 6) COMMANDES --------------------------------------------------------------
-- Une commande "gele" le nom et le prix du produit au moment de l'achat
-- (produit_nom, prix) pour garder un historique fiable meme si le produit
-- est ensuite modifie ou supprime.
create table if not exists public.commandes (
  id uuid primary key default gen_random_uuid(),
  boutique_id uuid not null references public.boutiques (id) on delete cascade,
  produit_id uuid references public.produits (id) on delete set null,
  produit_nom text not null,
  prix numeric(12, 2) not null check (prix >= 0),
  quantite integer not null default 1 check (quantite > 0),
  client_nom text not null,
  client_telephone text not null,
  client_adresse text not null,
  livreur_id uuid references public.livreurs (id) on delete set null,
  statut text not null default 'nouvelle'
    check (statut in ('nouvelle', 'en_preparation', 'en_livraison', 'livree', 'annulee')),
  created_at timestamptz not null default now()
);

alter table public.commandes enable row level security;

-- N'importe quel client (meme non connecte) peut passer une commande.
create policy "Un client peut passer commande"
  on public.commandes for insert
  with check (true);

create policy "Un marchand voit les commandes de sa boutique"
  on public.commandes for select
  using (boutique_id in (select id from public.boutiques where owner_id = auth.uid()));

create policy "Un marchand modifie les commandes de sa boutique"
  on public.commandes for update
  using (boutique_id in (select id from public.boutiques where owner_id = auth.uid()));

create policy "Un marchand supprime les commandes de sa boutique"
  on public.commandes for delete
  using (boutique_id in (select id from public.boutiques where owner_id = auth.uid()));

-- 7) GESTION AUTOMATIQUE DU STOCK --------------------------------------------
-- A la creation d'une commande, on verifie et decremente le stock du produit
-- dans la meme transaction (verrou "for update" pour eviter les ventes en
-- double sur un stock limite). Si le stock est insuffisant, l'insertion est
-- refusee et le client (via supabase-js) recoit l'erreur du "raise exception".
create or replace function public.decrementer_stock_commande()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  stock_actuel integer;
begin
  if new.produit_id is null then
    return new;
  end if;

  select stock into stock_actuel
  from public.produits
  where id = new.produit_id
  for update;

  if stock_actuel is null then
    return new;
  end if;

  if stock_actuel < new.quantite then
    raise exception 'Stock insuffisant (% restant, % demande)', stock_actuel, new.quantite;
  end if;

  update public.produits
  set stock = stock - new.quantite
  where id = new.produit_id;

  return new;
end;
$$;

create trigger commandes_decrementer_stock
  before insert on public.commandes
  for each row
  execute function public.decrementer_stock_commande();

-- Si une commande est annulee, on restitue le stock du produit.
create or replace function public.restituer_stock_commande_annulee()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.statut = 'annulee' and old.statut <> 'annulee' and new.produit_id is not null then
    update public.produits
    set stock = stock + new.quantite
    where id = new.produit_id;
  end if;

  return new;
end;
$$;

create trigger commandes_restituer_stock
  after update on public.commandes
  for each row
  execute function public.restituer_stock_commande_annulee();
