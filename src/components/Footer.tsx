import { MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-12 grid md:grid-cols-[1.2fr_0.8fr_0.8fr] gap-10">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white text-black grid place-items-center font-black">F</div>
            <div className="font-extrabold text-white">FASO MARKET</div>
          </div>
          <div className="mt-4 text-[13px] leading-relaxed text-zinc-400 max-w-[360px]">
            Le marché du Burkina dans votre téléphone. Créé à Ouagadougou pour les commerçants burkinabè.
            0% commission, 100% Faso.
          </div>
          <div className="mt-5 flex gap-2">
            <span className="h-1.5 w-10 rounded-full bg-[#EF2B2D]" />
            <span className="h-1.5 w-10 rounded-full bg-[#FCD116]" />
            <span className="h-1.5 w-10 rounded-full bg-[#009E49]" />
          </div>
        </div>

        <div>
          <div className="font-bold text-white text-[13px] tracking-widest">CONTACT</div>
          <div className="mt-4 space-y-2 text-[13px]">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} /> WhatsApp: +226 67 42 00 19
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} /> Ouagadougou, Zone 1 • Burkina Faso
            </div>
            <div className="mt-3 inline-flex rounded-full bg-white text-black px-3 py-1 text-[11px] font-bold">
              Ouvert 8h - 20h • Lun - Sam
            </div>
          </div>
        </div>

        <div>
          <div className="font-bold text-white text-[13px] tracking-widest">LÉGAL</div>
          <div className="mt-4 space-y-2 text-[13px] text-zinc-400">
            <div>Conditions • Confidentialité • Paiements</div>
            <div className="text-[11px]">© 2026 Faso Market • Fait avec ❤️ au Burkina</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
