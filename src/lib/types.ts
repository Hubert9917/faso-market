export type Boutique = {
  id: string;
  owner_id: string;
  nom: string;
  slug: string;
  ville: string;
  type: string;
  whatsapp: string;
  description: string | null;
  created_at: string;
};

export type Produit = {
  id: string;
  boutique_id: string;
  nom: string;
  prix: number;
  stock: number;
  photo_url: string | null;
  prix_achat: number | null;
  fournisseur: string | null;
  created_at: string;
};

export type ProduitAvecBoutique = Produit & {
  boutiques: Pick<Boutique, "nom" | "slug" | "ville" | "whatsapp"> | null;
};
