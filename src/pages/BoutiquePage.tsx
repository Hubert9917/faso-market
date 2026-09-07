import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MapPin, MessageCircle, Package, ShieldCheck } from "lucide-react";
import Footer from "../components/Footer";
import SupabaseAvertissement from "../components/SupabaseAvertissement";
import BoutonRetour from "../components/BoutonRetour";
import PaginationControls from "../components/PaginationControls";
import { supabase, supabaseConfigured } from "../lib/supabase";
import type { Boutique, Produit } from "../lib/types";

const PRODUITS_PAR_PAGE = 9;

function lienWhatsapp(whatsapp: string, message: string) {
  const numero = whatsapp.replace(/[^0-9]/g, "");
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}

export default function BoutiquePage() {
  const { slug } = useParams<{ slug: string }>();
  const [boutique, setBoutique] = useState<Boutique | null | undefined>(undefined);
  const [produits, setProduits] = useState<Produit[]>([]);
  const [page, setPage] = useState(1);
  const [totalProduits, setTotalProduits] = useState(0);

  useEffect(() => {
    setPage(1);
    if (!slug || !supabaseConfigured) return;

    Promise.resolve(supabase.from("boutiques").select("*").eq("slug", slug).maybeSingle())
      .then(({ data }) => setBoutique((data as Boutique) ?? null))
      .catch(() => setBoutique(null));
  }, [slug]);

  useEffect(() => {
    if (!boutique || !supabaseConfigured) return;

    Promise.resolve(
      supabase
        .from("produits")
        .select("*", { count: "exact" })
        .eq("boutique_id", boutique.id)
        .order("created_at", { ascending: false })
        .range((page - 1) * PRODUITS_PAR_PAGE, page * PRODUITS_PAR_PAGE - 1)
    ).then(({ data, count }) => {
      setProduits((data as Produit[]) ?? []);
      setTotalProduits(count ?? 0);
    });
  }, [boutique, page]);

  const totalPages = Math.max(1, Math.ceil(totalProduits / PRODUITS_PAR_PAGE));

  if (!supabaseConfigured) {
    return <SupabaseAvertissement />;
  }

  if (boutique === undefined) {
    return <div className="min-h-screen grid place-items-center text-zinc-500">Chargement…</div>;
  }

  if (boutique === null) {
    return (
      <div className="min-h-screen grid place-items-center text-center px-5">
        <div>
          <div className="text-[22px] font-extrabold">Boutique introuvable</div>
          <p className="mt-2 text-zinc-500">Ce lien de boutique n'existe pas ou plus.</p>
          <Link to="/" className="mt-4 inline-block underline font-bold">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <div className="bg-zinc-900 text-white">
        <div className="mx-auto max-w-[900px] px-5 pt-5">
          <BoutonRetour className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-400 hover:text-white transition" />
        </div>
        <div className="mx-auto max-w-[900px] px-5 py-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-zinc-400 flex items-center gap-1">
              <MapPin size={12} /> {boutique.ville} • {boutique.type}
            </div>
            <div className="mt-1 text-[28px] font-extrabold">{boutique.nom}</div>
            {boutique.description && (
              <p className="mt-2 text-[14px] text-zinc-300 max-w-[520px]">{boutique.description}</p>
            )}
          </div>
          <a
            href={lienWhatsapp(boutique.whatsapp, `Bonjour ${boutique.nom} ! Je viens de votre boutique Faso Market.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 px-5 rounded-full bg-[#009E49] text-white font-bold text-[14px] inline-flex items-center gap-2"
          >
            <MessageCircle size={16} /> Contacter sur WhatsApp
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-[900px] px-5 py-4 flex items-center gap-2 text-[12px] text-zinc-500">
        <ShieldCheck size={14} /> Boutique Faso Market • Paiement Orange Money / Moov / Wave à la livraison
      </div>

      <div className="mx-auto max-w-[900px] px-5 pb-16">
        {produits.length === 0 ? (
          <div className="text-center text-zinc-500 py-16">Cette boutique n'a pas encore ajouté de produits.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
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
                  <div className="font-bold text-[15px]">{p.nom}</div>
                  <div className="mt-1 text-[14px] font-black">{p.prix.toLocaleString("fr-FR")} F</div>
                  <div className="text-[12px] text-zinc-500">
                    {p.stock > 0 ? `En stock (${p.stock})` : "Rupture de stock"}
                  </div>
                  <a
                    href={lienWhatsapp(
                      boutique.whatsapp,
                      `Bonjour, je veux commander : ${p.nom} (${p.prix.toLocaleString("fr-FR")} F) sur ${boutique.nom}.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 h-10 rounded-full bg-zinc-900 text-white text-[13px] font-bold grid place-items-center"
                  >
                    Commander sur WhatsApp
                  </a>
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
    </div>
  );
}
