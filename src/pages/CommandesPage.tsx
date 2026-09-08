import { useEffect, useState, type FormEvent } from "react";
import Header from "../components/Header";
import BoutonRetour from "../components/BoutonRetour";
import PaginationControls from "../components/PaginationControls";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import type { Boutique, Commande, Livreur, StatutCommande } from "../lib/types";
import { ClipboardList, Plus, Trash2, Truck } from "lucide-react";

const COMMANDES_PAR_PAGE = 8;

const LABELS_STATUT: Record<StatutCommande, string> = {
  nouvelle: "Nouvelle",
  en_preparation: "En préparation",
  en_livraison: "En livraison",
  livree: "Livrée",
  annulee: "Annulée",
};

const COULEURS_STATUT: Record<StatutCommande, string> = {
  nouvelle: "bg-[#FCD116] text-black",
  en_preparation: "bg-zinc-200 text-zinc-800",
  en_livraison: "bg-[#009E49] text-white",
  livree: "bg-zinc-900 text-white",
  annulee: "bg-[#EF2B2D] text-white",
};

export default function CommandesPage() {
  const { user } = useAuth();
  const [boutique, setBoutique] = useState<Boutique | null | undefined>(undefined);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [nomLivreur, setNomLivreur] = useState("");
  const [telLivreur, setTelLivreur] = useState("");
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.max(1, Math.ceil(total / COMMANDES_PAR_PAGE));

  useEffect(() => {
    if (!user) return;
    Promise.resolve(supabase.from("boutiques").select("*").eq("owner_id", user.id).maybeSingle())
      .then(({ data }) => setBoutique((data as Boutique) ?? null));
  }, [user]);

  useEffect(() => {
    if (!boutique) return;
    supabase
      .from("livreurs")
      .select("*")
      .eq("boutique_id", boutique.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setLivreurs((data as Livreur[]) ?? []));
  }, [boutique]);

  async function chargerCommandes(boutiqueId: string, pageAffichee: number) {
    const { data, count } = await supabase
      .from("commandes")
      .select("*", { count: "exact" })
      .eq("boutique_id", boutiqueId)
      .order("created_at", { ascending: false })
      .range((pageAffichee - 1) * COMMANDES_PAR_PAGE, pageAffichee * COMMANDES_PAR_PAGE - 1);
    setCommandes((data as Commande[]) ?? []);
    setTotal(count ?? 0);
  }

  useEffect(() => {
    if (!boutique) return;
    chargerCommandes(boutique.id, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boutique, page]);

  async function ajouterLivreur(e: FormEvent) {
    e.preventDefault();
    if (!boutique || !nomLivreur.trim() || !telLivreur.trim()) return;
    const { data } = await supabase
      .from("livreurs")
      .insert({ boutique_id: boutique.id, nom: nomLivreur.trim(), telephone: telLivreur.trim() })
      .select()
      .single();
    if (data) setLivreurs((prev) => [data as Livreur, ...prev]);
    setNomLivreur("");
    setTelLivreur("");
  }

  async function supprimerLivreur(id: string) {
    await supabase.from("livreurs").delete().eq("id", id);
    setLivreurs((prev) => prev.filter((l) => l.id !== id));
  }

  async function changerStatut(commandeId: string, statut: StatutCommande) {
    setCommandes((prev) => prev.map((c) => (c.id === commandeId ? { ...c, statut } : c)));
    await supabase.from("commandes").update({ statut }).eq("id", commandeId);
  }

  async function assignerLivreur(commandeId: string, livreurId: string) {
    const valeur = livreurId || null;
    setCommandes((prev) => prev.map((c) => (c.id === commandeId ? { ...c, livreur_id: valeur } : c)));
    await supabase.from("commandes").update({ livreur_id: valeur }).eq("id", commandeId);
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <Header />
      <div className="mx-auto max-w-[1000px] px-5 py-10">
        <BoutonRetour className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition" />

        {boutique === undefined && <div className="text-center text-zinc-500 py-20">Chargement…</div>}

        {boutique === null && (
          <div className="text-center py-20">
            <p className="text-zinc-600">Crée d'abord ta boutique depuis le tableau de bord.</p>
          </div>
        )}

        {boutique && (
          <>
            <h1 className="text-[24px] font-extrabold flex items-center gap-2">
              <ClipboardList size={22} /> Commandes de {boutique.nom}
            </h1>

            <section className="mt-6">
              <h2 className="font-bold text-[16px] flex items-center gap-2">
                <Truck size={16} /> Mes livreurs
              </h2>
              <form onSubmit={ajouterLivreur} className="mt-3 rounded-2xl border bg-white p-4 grid md:grid-cols-[1.5fr_1fr_auto] gap-3 items-end">
                <div>
                  <label className="text-[11px] font-bold">Nom du livreur</label>
                  <input
                    value={nomLivreur}
                    onChange={(e) => setNomLivreur(e.target.value)}
                    placeholder="Ex: Issa"
                    className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold">Téléphone</label>
                  <input
                    value={telLivreur}
                    onChange={(e) => setTelLivreur(e.target.value)}
                    placeholder="+226 70 XX XX XX"
                    className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 px-4 rounded-xl bg-zinc-900 text-white text-[13px] font-bold inline-flex items-center justify-center gap-1"
                >
                  <Plus size={16} /> Ajouter
                </button>
              </form>

              {livreurs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {livreurs.map((l) => (
                    <div key={l.id} className="rounded-full border bg-white px-3 py-1.5 text-[12px] font-semibold flex items-center gap-2">
                      {l.nom} • {l.telephone}
                      <button onClick={() => supprimerLivreur(l.id)} className="text-[#EF2B2D]">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-8">
              <h2 className="font-bold text-[16px]">Commandes reçues</h2>

              {commandes.length === 0 ? (
                <p className="mt-3 text-[13px] text-zinc-500">Aucune commande pour l'instant.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {commandes.map((c) => (
                    <div key={c.id} className="rounded-2xl border bg-white p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="font-bold text-[14px]">
                            {c.produit_nom} x{c.quantite}
                          </div>
                          <div className="text-[13px] text-zinc-600">
                            {(c.prix * c.quantite).toLocaleString("fr-FR")} F
                          </div>
                          <div className="mt-1 text-[12px] text-zinc-500">
                            {c.client_nom} • {c.client_telephone}
                          </div>
                          <div className="text-[12px] text-zinc-500">{c.client_adresse}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-[11px] font-bold shrink-0 ${COULEURS_STATUT[c.statut]}`}>
                          {LABELS_STATUT[c.statut]}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <select
                          value={c.statut}
                          onChange={(e) => changerStatut(c.id, e.target.value as StatutCommande)}
                          className="h-9 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-[12px] outline-none"
                        >
                          {Object.entries(LABELS_STATUT).map(([valeur, libelle]) => (
                            <option key={valeur} value={valeur}>
                              {libelle}
                            </option>
                          ))}
                        </select>

                        <select
                          value={c.livreur_id ?? ""}
                          onChange={(e) => assignerLivreur(c.id, e.target.value)}
                          className="h-9 rounded-xl border border-zinc-200 bg-zinc-50 px-2 text-[12px] outline-none"
                        >
                          <option value="">Aucun livreur assigné</option>
                          {livreurs.map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.nom}
                            </option>
                          ))}
                        </select>
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
            </section>
          </>
        )}
      </div>
    </div>
  );
}
