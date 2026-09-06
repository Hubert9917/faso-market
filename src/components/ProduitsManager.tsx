import { useEffect, useState, type FormEvent } from "react";
import { Package, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Produit } from "../lib/types";

export default function ProduitsManager({ boutiqueId }: { boutiqueId: string }) {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function chargerProduits() {
    setLoading(true);
    const { data } = await supabase
      .from("produits")
      .select("*")
      .eq("boutique_id", boutiqueId)
      .order("created_at", { ascending: false });
    setProduits((data as Produit[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    chargerProduits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boutiqueId]);

  async function ajouterProduit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const prixNum = Number(prix);
    const stockNum = Number(stock || "0");
    if (!nom.trim() || Number.isNaN(prixNum) || prixNum < 0) {
      setError("Nom et prix valides requis.");
      return;
    }

    setSaving(true);
    try {
      let photoUrl: string | null = null;

      if (photo) {
        const chemin = `${boutiqueId}/${Date.now()}-${photo.name}`;
        const { error: uploadError } = await supabase.storage.from("produits").upload(chemin, photo);
        if (uploadError) throw uploadError;
        photoUrl = supabase.storage.from("produits").getPublicUrl(chemin).data.publicUrl;
      }

      const { error: insertError } = await supabase.from("produits").insert({
        boutique_id: boutiqueId,
        nom: nom.trim(),
        prix: prixNum,
        stock: stockNum,
        photo_url: photoUrl,
      });
      if (insertError) throw insertError;

      setNom("");
      setPrix("");
      setStock("");
      setPhoto(null);
      await chargerProduits();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout du produit.");
    } finally {
      setSaving(false);
    }
  }

  async function supprimerProduit(id: string) {
    await supabase.from("produits").delete().eq("id", id);
    setProduits((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="mt-8">
      <h2 className="font-bold text-[18px] flex items-center gap-2">
        <Package size={18} /> Mes produits
      </h2>

      <form
        onSubmit={ajouterProduit}
        className="mt-4 rounded-2xl border bg-white p-5 grid md:grid-cols-[1.5fr_1fr_1fr_1fr_auto] gap-3 items-end"
      >
        <div>
          <label className="text-[11px] font-bold">Nom du produit *</label>
          <input
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            placeholder="Ex: Riz local 25kg"
            className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold">Prix (FCFA) *</label>
          <input
            type="number"
            min={0}
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            placeholder="15000"
            className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold">Stock</label>
          <input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="10"
            className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label className="text-[11px] font-bold">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
            className="mt-1 w-full text-[12px]"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="h-11 px-4 rounded-xl bg-zinc-900 text-white text-[13px] font-bold inline-flex items-center justify-center gap-1 disabled:opacity-60"
        >
          <Plus size={16} /> {saving ? "Ajout…" : "Ajouter"}
        </button>

        {error && <div className="md:col-span-5 text-[12px] text-[#EF2B2D] font-semibold">{error}</div>}
      </form>

      <div className="mt-5">
        {loading ? (
          <div className="text-[13px] text-zinc-500">Chargement…</div>
        ) : produits.length === 0 ? (
          <div className="text-[13px] text-zinc-500">Aucun produit pour l'instant. Ajoutez-en un ci-dessus.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-3">
            {produits.map((p) => (
              <div key={p.id} className="rounded-2xl border bg-white p-4 flex flex-col">
                <div className="h-28 rounded-xl bg-zinc-100 overflow-hidden grid place-items-center">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.nom} className="h-full w-full object-cover" />
                  ) : (
                    <Package className="text-zinc-400" />
                  )}
                </div>
                <div className="mt-3 font-bold text-[14px]">{p.nom}</div>
                <div className="text-[13px] text-zinc-600">
                  {p.prix.toLocaleString("fr-FR")} F • Stock: {p.stock}
                </div>
                <button
                  onClick={() => supprimerProduit(p.id)}
                  className="mt-3 self-start inline-flex items-center gap-1 text-[12px] font-semibold text-[#EF2B2D]"
                >
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
