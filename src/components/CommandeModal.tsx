import { useState, type FormEvent } from "react";
import { Check, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { lienWhatsapp } from "../lib/whatsapp";

type Props = {
  produit: { id: string; nom: string; prix: number; stock: number };
  boutique: { id: string; nom: string; whatsapp: string };
  onClose: () => void;
};

export default function CommandeModal({ produit, boutique, onClose }: Props) {
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [adresse, setAdresse] = useState("");
  const [quantite, setQuantite] = useState("1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [envoyee, setEnvoyee] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const quantiteNum = Number(quantite);
    if (!nom.trim() || !telephone.trim() || !adresse.trim() || !Number.isInteger(quantiteNum) || quantiteNum < 1) {
      setError("Merci de remplir ton nom, téléphone, adresse et une quantité valide.");
      return;
    }

    if (quantiteNum > produit.stock) {
      setError(`Il ne reste que ${produit.stock} en stock pour ce produit.`);
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("commandes").insert({
      boutique_id: boutique.id,
      produit_id: produit.id,
      produit_nom: produit.nom,
      prix: produit.prix,
      quantite: quantiteNum,
      client_nom: nom.trim(),
      client_telephone: telephone.trim(),
      client_adresse: adresse.trim(),
    });
    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    const total = (produit.prix * quantiteNum).toLocaleString("fr-FR");
    window.open(
      lienWhatsapp(
        boutique.whatsapp,
        `Nouvelle commande Faso Market !\nProduit : ${produit.nom} x${quantiteNum}\nTotal : ${total} F\nClient : ${nom.trim()} (${telephone.trim()})\nAdresse : ${adresse.trim()}`
      ),
      "_blank",
      "noopener"
    );
    setEnvoyee(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:max-w-[440px] bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col">
        <div className="p-5 flex items-start justify-between border-b">
          <div>
            <div className="text-[11px] font-bold tracking-widest text-zinc-400">COMMANDER</div>
            <div className="mt-1 font-extrabold text-[16px]">{produit.nom}</div>
            <div className="text-[13px] text-zinc-500">
              {produit.prix.toLocaleString("fr-FR")} F • {boutique.nom}
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-zinc-100 grid place-items-center shrink-0">
            <X size={14} />
          </button>
        </div>

        {envoyee ? (
          <div className="p-5">
            <div className="rounded-2xl bg-[#009E49] text-white p-4 flex gap-3">
              <div className="h-9 w-9 shrink-0 rounded-full bg-white text-[#009E49] grid place-items-center">
                <Check size={18} />
              </div>
              <div className="text-[13px] leading-relaxed">
                <b>Commande envoyée !</b> Le vendeur a été notifié sur WhatsApp et te contactera pour confirmer la
                livraison.
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-4 w-full h-11 rounded-full bg-zinc-900 text-white text-[13px] font-bold"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="p-5 space-y-3 overflow-auto">
            <div>
              <label className="text-[11px] font-bold">Ton nom *</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold">Ton numéro WhatsApp *</label>
              <input
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+226 70 XX XX XX"
                className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold">Adresse de livraison *</label>
              <input
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Ex: Ouaga 2000, secteur 15"
                className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold">Quantité</label>
              <input
                type="number"
                min={1}
                max={produit.stock}
                value={quantite}
                onChange={(e) => setQuantite(e.target.value)}
                className="mt-1 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-[13px] outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <p className="mt-1 text-[11px] text-zinc-400">{produit.stock} disponible(s)</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-[#EF2B2D]/30 px-4 py-3 text-[12px] text-[#EF2B2D] font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full h-12 rounded-full bg-[#EF2B2D] text-white font-bold text-[14px] disabled:opacity-60"
            >
              {saving ? "Envoi…" : "Confirmer la commande"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
