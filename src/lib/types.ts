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
  created_at: string;
};
