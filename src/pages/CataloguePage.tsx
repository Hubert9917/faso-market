import { useEffect, useState } from "react";
import { Search, MapPin, Package, ShieldCheck, Store } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PaginationControls from "../components/PaginationControls";
import SupabaseAvertissement from "../components/SupabaseAvertissement";
import CommandeModal from "../components/CommandeModal";
import { supabase, supabaseConfigured } from "../lib/supabase";
import type { ProduitAvecBoutique } from "../lib/types";

const PRODUITS_PAR_PAGE = 12;

export default function CataloguePage() {
  const [produits, setProduits] = useState<ProduitAvecBoutique[] | undefined>(undefined);
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const [totalProduits, setTotalProduits] = useState(0);
  const [produitACommander, setProduitACommander] = useState<ProduitAvecBoutique | null>(null);

  const totalPages = Math.max(1, Math.ceil(totalProduits / PRODUITS_PAR_PAGE));

  useEffect(() => {
    if (!supabaseConfigured) return;

    let requete = supabase
      .from("produits")
      .select("*, boutiques(id, nom, slug, ville, whatsapp)", { count: "exact" })
      .order("created_at", { ascending: false });

    if (recherche.trim()) {
      requete = requete.ilike("nom", `%${recherche.trim()}%`);
    }

    Promise.resolve(
      requete.range((page - 1) * PRODUITS_PAR_PAGE, page * PRODUITS_PAR_PAGE - 1)
    ).then(({ data, count }) => {
      setProduits((data as ProduitAvecBoutique[]) ?? []);
      setTotalProduits(count ?? 0);
    });
  }, [page, recherche]);

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <Header />

      <div className="bg-zinc-900 text-white">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-10">
          <div className="text-[11px] font-bold tracking-widest text-zinc-400">CATALOGUE</div>
          <h1 className="mt-1 text-[28px] md:text-[36px] font-extrabold">Tous les produits, toutes les boutiques.</h1>
          <p className="mt-2 text-[14px] text-zinc-300 max-w-[560px]">
            Cherche un produit, peu importe qui le vend sur Faso Market.
          </p>
          <div className="mt-5 relative max-w-[420px]">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              value={recherche}
              onChange={(e) => {
                setRecherche(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un produit…"
              className="w-full h-12 rounded-full pl-11 pr-4 bg-white/10 border border-white/15 text-white placeholder:text-zinc-400 text-[14px] outline-none focus:bg-white/15"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-10">
        {!supabaseConfigured ? (
          <SupabaseAvertissement />
        ) : produits === undefined ? (
          <p className="text-[13px] text-zinc-500">Chargement…</p>
        ) : produits.length === 0 ? (
          <div className="text-center text-zinc-500 py-16">
            {recherche
              ? `Aucun produit ne correspond à "${recherche}".`
              : "Aucun produit disponible pour l'instant."}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {produits.map((p) => (
              <div key={p.id} className="rounded-2xl border bg-white overflow-hidden flex flex-col">
                <div className="h-36 bg-zinc-100 grid place-items-center">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.nom} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="text-zinc-400" />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="font-bold text-[14px] line-clamp-2 min-h-[36px]">{p.nom}</div>
                  <div className="mt-1 text-[15px] font-black">{p.prix.toLocaleString("fr-FR")} F</div>
                  {p.fournisseur && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-[#009E49]">
                      <ShieldCheck size={11} /> {p.fournisseur}
                    </div>
                  )}
                  {p.boutiques && (
                    <div className="mt-2 text-[11px] text-zinc-500 flex items-center gap-1">
                      <Store size={11} /> {p.boutiques.nom}
                      <span className="mx-1">•</span>
                      <MapPin size={11} /> {p.boutiques.ville}
                    </div>
                  )}
                  {p.boutiques && (
                    <button
                      onClick={() => setProduitACommander(p)}
                      className="mt-3 h-10 rounded-full bg-zinc-900 text-white text-[12px] font-bold grid place-items-center"
                    >
                      Commander
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>

      <Footer />

      {produitACommander && produitACommander.boutiques && (
        <CommandeModal
          produit={produitACommander}
          boutique={produitACommander.boutiques}
          onClose={() => setProduitACommander(null)}
        />
      )}
    </div>
  );
}
