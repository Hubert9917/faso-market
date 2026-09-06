import { useEffect, useState, type FormEvent } from "react";
import { Copy, LogOut, Store } from "lucide-react";
import Header from "../components/Header";
import ProduitsManager from "../components/ProduitsManager";
import SupabaseAvertissement from "../components/SupabaseAvertissement";
import { useAuth } from "../lib/auth";
import { supabase, supabaseConfigured } from "../lib/supabase";
import type { Boutique } from "../lib/types";

function genererSlug(nom: string) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CreerBoutiqueForm({ onCreated }: { onCreated: (b: Boutique) => void }) {
  const { user } = useAuth();
  const [nom, setNom] = useState("");
  const [slug, setSlug] = useState("");
  const [slugModifie, setSlugModifie] = useState(false);
  const [ville, setVille] = useState("Ouaga");
  const [type, setType] = useState("Alimentation");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);

    if (!nom.trim() || !slug.trim() || !whatsapp.trim()) {
      setError("Nom, lien et WhatsApp sont requis.");
      return;
    }

    setSaving(true);
    const { data, error: insertError } = await supabase
      .from("boutiques")
      .insert({
        owner_id: user.id,
        nom: nom.trim(),
        slug: slug.trim(),
        ville,
        type,
        whatsapp: whatsapp.trim(),
        description: description.trim() || null,
      })
      .select()
      .single();
    setSaving(false);

    if (insertError) {
      if (insertError.code === "23505") {
        setError("Ce lien de boutique est déjà pris, choisissez-en un autre.");
      } else {
        setError(insertError.message);
      }
      return;
    }

    onCreated(data as Boutique);
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <div className="inline-flex rounded-full bg-[#009E49] text-white px-3 py-1 text-[11px] font-black tracking-widest">
        DERNIÈRE ÉTAPE
      </div>
      <h1 className="mt-4 text-[28px] font-extrabold tracking-tight">Créez votre boutique</h1>
      <p className="mt-2 text-[14px] text-zinc-600">Votre lien public sera fasomarket.bf/#/boutique/votre-lien.</p>

      <form onSubmit={onSubmit} className="mt-6 rounded-[24px] bg-white border shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 space-y-4">
        <div>
          <label className="text-[12px] font-bold">Nom de la boutique *</label>
          <input
            value={nom}
            onChange={(e) => {
              setNom(e.target.value);
              if (!slugModifie) setSlug(genererSlug(e.target.value));
            }}
            placeholder="Ex: Liza Market"
            className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label className="text-[12px] font-bold">Lien de la boutique *</label>
          <input
            value={slug}
            onChange={(e) => {
              setSlug(genererSlug(e.target.value));
              setSlugModifie(true);
            }}
            placeholder="liza-market"
            className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[12px] font-bold">Ville</label>
            <select
              value={ville}
              onChange={(e) => setVille(e.target.value)}
              className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option>Ouaga</option>
              <option>Bobo</option>
              <option>Koudougou</option>
              <option>Autre</option>
            </select>
          </div>
          <div>
            <label className="text-[12px] font-bold">Type de commerce</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
            >
              <option>Alimentation</option>
              <option>Mode & Tissus</option>
              <option>Téléphone</option>
              <option>Électroménager</option>
              <option>Autre</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-[12px] font-bold">Numéro WhatsApp *</label>
          <input
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="+226 70 XX XX XX"
            className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>
        <div>
          <label className="text-[12px] font-bold">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Ce que vous vendez, votre spécialité…"
            className="mt-1 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-[#EF2B2D]/30 px-4 py-3 text-[12.5px] text-[#EF2B2D] font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full h-[52px] rounded-full bg-[#EF2B2D] text-white font-bold text-[15px] shadow-[0_10px_24px_rgba(239,43,45,0.3)] hover:bg-[#d42426] transition disabled:opacity-60"
        >
          {saving ? "Création…" : "Créer ma boutique"}
        </button>
      </form>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [boutique, setBoutique] = useState<Boutique | null | undefined>(undefined);
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    if (!user || !supabaseConfigured) return;
    Promise.resolve(supabase.from("boutiques").select("*").eq("owner_id", user.id).maybeSingle())
      .then(({ data }) => setBoutique((data as Boutique) ?? null))
      .catch(() => setBoutique(null));
  }, [user]);

  function copierLien() {
    if (!boutique) return;
    const lien = `${window.location.origin}${window.location.pathname}#/boutique/${boutique.slug}`;
    navigator.clipboard.writeText(lien);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  if (!supabaseConfigured) {
    return <SupabaseAvertissement />;
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <Header />
      <div className="mx-auto max-w-[1000px] px-5 py-12">
        {boutique === undefined && <div className="text-center text-zinc-500 py-20">Chargement…</div>}

        {boutique === null && <CreerBoutiqueForm onCreated={setBoutique} />}

        {boutique && (
          <>
            <div className="rounded-[24px] bg-zinc-900 text-white p-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-zinc-400">
                  <Store size={14} /> VOTRE BOUTIQUE
                </div>
                <div className="mt-1 text-[22px] font-extrabold">{boutique.nom}</div>
                <div className="text-[13px] text-zinc-400">
                  {boutique.ville} • {boutique.type} • {boutique.whatsapp}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copierLien}
                  className="h-10 px-4 rounded-full bg-white/10 hover:bg-white/20 transition text-[13px] font-bold inline-flex items-center gap-2"
                >
                  <Copy size={14} /> {copie ? "Lien copié !" : "Copier le lien"}
                </button>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="h-10 px-4 rounded-full bg-[#EF2B2D] text-[13px] font-bold inline-flex items-center gap-2"
                >
                  <LogOut size={14} /> Déconnexion
                </button>
              </div>
            </div>

            <ProduitsManager boutiqueId={boutique.id} />
          </>
        )}
      </div>
    </div>
  );
}
