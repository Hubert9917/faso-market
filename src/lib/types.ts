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
  boutiques: Pick<Boutique, "id" | "nom" | "slug" | "ville" | "whatsapp"> | null;
};

export type Livreur = {
  id: string;
  boutique_id: string;
  nom: string;
  telephone: string;
  created_at: string;
};

export type StatutCommande = "nouvelle" | "en_preparation" | "en_livraison" | "livree" | "annulee";

export type Commande = {
  id: string;
  boutique_id: string;
  produit_id: string | null;
  produit_nom: string;
  prix: number;
  quantite: number;
  client_nom: string;
  client_telephone: string;
  client_adresse: string;
  livreur_id: string | null;
  statut: StatutCommande;
  created_at: string;
};
