import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  CreditCard,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Package,
  Play,
  ShieldCheck,
  Smartphone,
  Star,
  Store,
  Truck,
  X,
  Zap,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const boutiquesDemo = [
  {
    id: 1,
    name: "Épicerie du quartier",
    cat: "Alimentation",
    city: "Ouaga 2000",
    color: "bg-[#009E49]",
    products: [
      { n: "Riz local 25kg", p: "22 500 F" },
      { n: "Huile 5L", p: "6 000 F" },
      { n: "Pack jus", p: "4 500 F" },
    ],
    emoji: "🥫",
    desc: "Épicerie fine et produits locaux. Livraison en 2h à Ouaga.",
  },
  {
    id: 2,
    name: "Électro Faso",
    cat: "Électroménager",
    city: "Ouaga - Zone 1",
    color: "bg-[#EF2B2D]",
    products: [
      { n: "Mixeur Silver Crest", p: "15 000 F" },
      { n: "Ventilateur", p: "25 000 F" },
      { n: "Fer à repasser", p: "12 500 F" },
    ],
    emoji: "📺",
    desc: "Le meilleur de l'électro à prix marché. Garantie 1 an.",
  },
  {
    id: 3,
    name: "Atelier Danfani",
    cat: "Mode & Tissus",
    city: "Bobo-Dioulasso",
    color: "bg-[#FCD116] text-black",
    products: [
      { n: "Pagne Faso Danfani", p: "18 000 F" },
      { n: "Boubou brodé", p: "35 000 F" },
      { n: "Bazin riche", p: "50 000 F" },
    ],
    emoji: "👗",
    desc: "Mode africaine authentique. Tailleur sur mesure disponible.",
  },
  {
    id: 4,
    name: "Téléphones Express",
    cat: "Téléphones",
    city: "Ouaga - Zabrda",
    color: "bg-black text-white",
    products: [
      { n: "Tecno Spark 10", p: "75 000 F" },
      { n: "iPhone 11 Recond.", p: "185 000 F" },
      { n: "Airpods Pro", p: "15 000 F" },
    ],
    emoji: "📱",
    desc: "#1 Téléphones à Ouaga. Troc possible + garantie.",
  },
];

const features = [
  {
    icon: LayoutGrid,
    title: "Boutique perso",
    desc: "marina.fasomarket.bf - Votre nom de domaine à vous. Pro et mémorable.",
    tag: "Gratuit",
  },
  {
    icon: Package,
    title: "Gestion stock",
    desc: "Ajoutez 10 ou 1000 produits en 2 clics. Photos, prix, promos.",
    tag: "Simple",
  },
  {
    icon: MessageCircle,
    title: "Catalogue WhatsApp auto",
    desc: "Vos produits partagés direct sur WhatsApp. Commande en 1 message.",
    tag: "Viral",
  },
  {
    icon: CreditCard,
    title: "Paiement Mobile Money",
    desc: "Orange Money, Moov Money, Wave intégrés. Vous êtes payé instantanément.",
    tag: "Sécurisé",
  },
  {
    icon: Truck,
    title: "Livraison intégrée",
    desc: "Connectez votre livreur ou utilisez nos partenaires à Ouaga & Bobo.",
    tag: "Rapide",
  },
  {
    icon: ShieldCheck,
    title: "0% commission",
    desc: "Sur le forfait gratuit, on ne prend rien. Vous vendez, vous gardez tout.",
    tag: "Juste",
  },
];

const steps = [
  {
    n: "01",
    t: "Inscription en 2 min",
    d: "Nom de boutique, WhatsApp, ville. C'est tout. On crée votre lien fasomarket.bf.",
    c: "bg-[#EF2B2D]",
    icon: Smartphone,
  },
  {
    n: "02",
    t: "Ajoutez vos produits",
    d: "Photo avec votre téléphone, prix en FCFA, stock. Glissez-déposez. Même hors connexion.",
    c: "bg-[#FCD116] text-black",
    icon: Zap,
  },
  {
    n: "03",
    t: "Vendez & encaissez",
    d: "Partagez sur WhatsApp/Facebook. Client paie via Orange Money, Moov, Wave. Vous livrez.",
    c: "bg-[#009E49]",
    icon: Store,
  },
];

const pricingPlans = (annual: boolean) => [
  {
    name: "GRATUIT",
    price: 0,
    orig: "0 F",
    feat: ["10 produits", "Boutique perso", "Commandes WhatsApp", "Lien partageable", "Support communauté"],
    cta: "Créer gratuitement",
    pop: false,
  },
  {
    name: "PRO",
    price: annual ? 4720 : 5900,
    orig: "5 900 F/mois",
    feat: [
      "50 produits",
      "Domaine perso + suppression logo",
      "Stats de ventes",
      "Paiement Mobile Money auto",
      "Support WhatsApp prioritaire",
      "Catalogue sans limite",
    ],
    cta: "Passer PRO",
    pop: true,
  },
  {
    name: "PREMIUM",
    price: annual ? 11920 : 14900,
    orig: "14 900 F/mois",
    feat: [
      "Produits illimités",
      "Multi-boutiques (Ouaga + Bobo)",
      "Employés & rôles",
      "Livraison intégrée + tracking",
      "API + Export",
      "Manager dédié",
    ],
    cta: "Devenir Premium",
    pop: false,
  },
];

export default function LandingPage() {
  const [annual, setAnnual] = useState(false);
  const [selected, setSelected] = useState<(typeof boutiquesDemo)[number] | null>(null);

  return (
    <div className="min-h-screen bg-[#FFFEFB] text-zinc-900 selection:bg-[#FCD116]/40 font-[Inter,system-ui,sans-serif]">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #000 0 1px, transparent 1px 14px)" }}
        />
        <div className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full bg-[#FCD116]/30 blur-[90px]" />
        <div className="absolute -bottom-40 -left-40 h-[560px] w-[560px] rounded-full bg-[#009E49]/15 blur-[80px]" />

        <div className="mx-auto max-w-[1180px] px-5 md:px-8 pt-10 md:pt-20 pb-12 md:pb-20 grid md:grid-cols-[1.15fr_0.85fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[11px] font-semibold tracking-wide shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#009E49] animate-pulse" />
              0F POUR COMMENCER • NOUVEAU AU BURKINA • PAIEMENT WAVE & ORANGE MONEY
            </div>
            <h1 className="mt-5 text-[34px] md:text-[56px] leading-[0.95] font-[800] tracking-[-0.03em]">
              Créez votre boutique
              <br />
              en ligne en{" "}
              <span className="relative inline-block">
                <span className="relative z-10">5 minutes.</span>
                <span className="absolute bottom-1 left-0 right-0 h-[14px] bg-[#FCD116] -rotate-1 z-0" />
              </span>
              <br />
              Vendez à tout Ouaga.
            </h1>
            <p className="mt-5 text-[16px] md:text-[18px] leading-relaxed text-zinc-600 max-w-[560px]">
              Le marché du Burkina dans votre téléphone. Créez votre boutique et vendez sur WhatsApp{" "}
              <b className="text-zinc-900">sans commission</b>. Boutique pro, catalogue auto, paiement Mobile
              Money.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/inscription"
                className="h-[52px] px-7 rounded-full bg-zinc-900 text-white font-bold text-[15px] inline-flex items-center gap-2 hover:bg-black transition"
              >
                Créer ma boutique gratuitement <ArrowRight size={18} />
              </Link>
              <a
                href="#boutiques"
                className="h-[52px] px-6 rounded-full bg-white border border-zinc-200 font-semibold text-[14px] inline-flex items-center gap-2 hover:border-zinc-300"
              >
                <Play size={16} /> Voir les boutiques
              </a>
            </div>
            <div className="mt-6 flex items-center gap-3 text-[12.5px] text-zinc-500">
              <div className="flex -space-x-2">
                {["LM", "MM", "BS"].map((m) => (
                  <div
                    key={m}
                    className="h-7 w-7 rounded-full bg-zinc-200 border-2 border-white grid place-items-center text-[11px] font-bold"
                  >
                    {m}
                  </div>
                ))}
              </div>
              <span>
                Service en cours de lancement — <b className="text-zinc-800">les premières boutiques ouvrent bientôt</b>
              </span>
            </div>
          </div>

          <div className="relative md:h-[560px] flex justify-center">
            <div className="relative w-[300px] md:w-[340px] h-[600px] rounded-[42px] bg-zinc-900 p-[10px] shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              <div className="h-full w-full rounded-[32px] bg-white overflow-hidden flex flex-col">
                <div className="h-11 flex items-center justify-between px-5 bg-zinc-50 border-b">
                  <span className="font-bold text-[13px]">marina.fasomarket.bf</span>
                  <span className="h-2 w-2 rounded-full bg-[#009E49]" />
                </div>
                <div className="p-3 space-y-3 overflow-auto">
                  <div className="rounded-2xl bg-zinc-900 text-white p-4">
                    <div className="text-[11px] tracking-widest opacity-60">NOUVEAU</div>
                    <div className="font-bold text-[18px] leading-tight mt-1">
                      Arrivage Mixeurs -15% aujourd'hui
                    </div>
                    <div className="mt-3 h-9 rounded-full bg-[#FCD116] text-black grid place-items-center font-bold text-[13px]">
                      Commander sur WhatsApp
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { n: "Mixeur 1.5L", p: "15 000 F", c: "bg-[#FFF7CC]" },
                      { n: "Ventilo 16''", p: "25 000 F", c: "bg-[#FFE2E2]" },
                      { n: "Bouilloire", p: "9 500 F", c: "bg-[#E8F5E9]" },
                      { n: "Plaque chauff.", p: "18 000 F", c: "bg-zinc-100" },
                    ].map((m, k) => (
                      <div key={k} className={`rounded-2xl ${m.c} p-3`}>
                        <div className="h-16 rounded-xl bg-white/70 grid place-items-center text-xl">📦</div>
                        <div className="mt-2 font-semibold text-[12px] leading-tight">{m.n}</div>
                        <div className="text-[11px] font-bold">{m.p}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-auto border-t p-3 flex gap-2">
                  <div className="flex-1 h-10 rounded-full bg-[#009E49] text-white grid place-items-center font-bold text-[13px]">
                    Payer • Orange Money
                  </div>
                  <div className="h-10 w-10 rounded-full bg-zinc-900 text-white grid place-items-center">
                    <MessageCircle size={16} />
                  </div>
                </div>
              </div>

              <div className="absolute -left-10 top-24 rounded-2xl bg-white shadow-xl border p-3 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#009E49] text-white grid place-items-center">
                  <Check size={16} />
                </div>
                <div className="text-[11px] leading-tight">
                  <b className="text-[12px]">Vente réussie!</b>
                  <br />
                  Mixeur • 15 000F • Wave
                </div>
              </div>

              <div className="absolute -right-8 bottom-28 rounded-2xl bg-white shadow-xl border p-3">
                <div className="text-[10px] font-bold tracking-widest text-zinc-500">LIVRAISON</div>
                <div className="text-[12px] font-bold flex items-center gap-1">
                  <MapPin size={12} /> Patte d'oie → Ouaga 2000 • 45 min
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-100 bg-white">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-6 flex flex-wrap items-center gap-4">
          <div className="text-[13px] font-bold tracking-wide">
            Ouvert aux commerçants de <span className="text-[#EF2B2D]">Ouaga, Bobo et Koudougou</span>
          </div>
          <div className="h-px w-8 bg-zinc-200 hidden md:block" />
          <div className="flex flex-wrap gap-2">
            {[
              "ALIMENTATION",
              "ÉLECTROMÉNAGER",
              "MODE & TISSUS",
              "TÉLÉPHONES",
              "COSMÉTIQUES",
              "QUINCAILLERIE",
              "LIBRAIRIE",
              "ARTISANAT",
            ].map((m) => (
              <span
                key={m}
                className="rounded-full border bg-zinc-50 px-3 py-1 text-[11px] font-bold tracking-wide text-zinc-600"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section id="comment" className="mx-auto max-w-[1180px] px-5 md:px-8 py-16 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="text-[30px] md:text-[42px] font-extrabold leading-[0.95] tracking-tight">
            De l'idée à la vente
            <br />
            en 3 étapes simples.
          </h2>
          <p className="text-[14px] text-zinc-600 max-w-[340px]">
            Pas besoin de développeur. Votre boutique est prête pendant que votre thé refroidit.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {steps.map((m, k) => (
            <div
              key={k}
              className="relative rounded-[28px] border bg-white p-6 md:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
            >
              <div className={`inline-flex h-10 w-10 rounded-full ${m.c} text-white grid place-items-center font-bold`}>
                <m.icon size={18} />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-[12px] font-black tracking-widest text-zinc-400">{m.n}</span>
                <div className="h-px flex-1 bg-zinc-100" />
              </div>
              <div className="mt-3 font-bold text-[18px]">{m.t}</div>
              <div className="mt-2 text-[14px] leading-relaxed text-zinc-600">{m.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-900 text-white rounded-[32px] md:rounded-[40px] mx-3 md:mx-5 overflow-hidden">
        <div className="mx-auto max-w-[1180px] px-6 md:px-10 py-14 md:py-20">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-[28px] md:text-[40px] font-extrabold leading-[0.95] tracking-tight">
              Tout ce qu'il faut
              <br />
              pour vendre au Faso.
            </h2>
            <div className="rounded-full bg-white/10 px-4 py-2 text-[11px] font-bold tracking-widest">
              PENSÉ POUR WHATSAPP • MOBILE MONEY • LIVRAISON MOTO
            </div>
          </div>
          <div className="mt-10 grid md:grid-cols-3 gap-4">
            {features.map((m, k) => (
              <div
                key={k}
                className="rounded-[22px] bg-white/[0.06] border border-white/10 p-6 hover:bg-white/[0.08] transition"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-white text-zinc-900 grid place-items-center">
                    <m.icon size={18} />
                  </div>
                  <span className="rounded-full bg-[#FCD116] text-black px-2.5 py-1 text-[10px] font-black tracking-wide">
                    {m.tag}
                  </span>
                </div>
                <div className="mt-5 font-bold text-[16px]">{m.title}</div>
                <div className="mt-2 text-[13.5px] leading-relaxed text-zinc-300">{m.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tarifs" className="mx-auto max-w-[1180px] px-5 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-[700px] mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900 text-white px-4 py-1.5 text-[11px] font-bold tracking-widest">
            TARIFS SIMPLES • PAS DE SURPRISE
          </div>
          <h2 className="mt-5 text-[32px] md:text-[44px] font-extrabold leading-[0.95] tracking-tight">
            Commencez gratuit.
            <br />
            Grandissez quand vous vendez.
          </h2>
          <div className="mt-6 inline-flex items-center rounded-full border bg-zinc-100 p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`h-8 px-5 rounded-full text-[13px] font-bold transition ${
                !annual ? "bg-white shadow" : "text-zinc-500"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`h-8 px-5 rounded-full text-[13px] font-bold transition ${
                annual ? "bg-white shadow" : "text-zinc-500"
              }`}
            >
              Annuel <span className="ml-1 text-[#009E49]">-20%</span>
            </button>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-3 gap-5 items-stretch">
          {pricingPlans(annual).map((m, k) => (
            <div
              key={k}
              className={`relative rounded-[28px] border p-7 flex flex-col ${
                m.pop
                  ? "bg-zinc-900 text-white border-zinc-900 shadow-[0_20px_60px_rgba(0,0,0,0.2)] scale-[1.02]"
                  : "bg-white"
              }`}
            >
              {m.pop && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FCD116] text-black px-3 py-1 text-[10px] font-black tracking-widest">
                  LE PLUS POPULAIRE
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="font-black tracking-widest text-[12px] opacity-70">{m.name}</div>
                {m.pop && <Star size={16} className="fill-[#FCD116] text-[#FCD116]" />}
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <div className="text-[34px] font-extrabold tracking-tight">
                  {m.price === 0 ? "0 F" : `${m.price.toLocaleString("fr-FR")} F`}
                </div>
                <div className="text-[13px] opacity-60">
                  {annual && m.price !== 0 ? "/mois (annuel)" : "/mois"}
                </div>
              </div>
              {annual && m.price !== 0 && (
                <div className="text-[11px] mt-1 opacity-60 line-through">{m.orig} • 2 mois offerts</div>
              )}
              {!annual && m.price !== 0 && <div className="text-[11px] mt-1 opacity-60">{m.orig}</div>}
              <div className="mt-6 space-y-2.5">
                {m.feat.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-[13px]">
                    <span
                      className={`h-5 w-5 rounded-full grid place-items-center ${
                        m.pop ? "bg-white/15" : "bg-zinc-100"
                      }`}
                    >
                      <Check size={12} />
                    </span>
                    {f}
                  </div>
                ))}
              </div>
              <Link
                to="/inscription"
                className={`mt-8 h-12 rounded-full font-bold text-[14px] transition grid place-items-center ${
                  m.pop ? "bg-[#FCD116] text-black hover:bg-[#ffde4a]" : "bg-zinc-900 text-white hover:bg-black"
                }`}
              >
                {m.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-[12px] text-zinc-500">
          Paiement via Orange Money / Moov / Wave • Facture disponible • Résiliable à tout moment
        </div>
      </section>

      <section id="boutiques" className="bg-[#FFFBEB] border-y border-amber-100">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 py-16 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-[28px] md:text-[40px] font-extrabold leading-[0.9] tracking-tight">
              À quoi ressemblera
              <br />
              votre boutique.
            </h2>
            <Link
              to="/inscription"
              className="rounded-full bg-zinc-900 text-white h-10 px-5 text-[13px] font-bold inline-flex items-center gap-2"
            >
              Créer la mienne <ArrowRight size={14} />
            </Link>
          </div>
          <p className="mt-2 text-[13px] text-zinc-500">
            Exemples illustratifs — les premières vraies boutiques ouvrent bientôt.
          </p>
          <div className="mt-8 grid md:grid-cols-4 gap-4">
            {boutiquesDemo.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelected(m)}
                className="text-left rounded-[24px] bg-white border shadow-[0_8px_24px_rgba(0,0,0,0.04)] overflow-hidden hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition group"
              >
                <div className={`h-28 ${m.color} relative p-4 flex justify-between`}>
                  <div className="text-[28px]">{m.emoji}</div>
                  <div className="text-[10px] font-bold tracking-widest opacity-80 bg-white/20 rounded-full px-2 py-1 h-fit">
                    {m.cat}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div className="font-bold text-[14px]">{m.name}</div>
                    <div className="text-[11px] opacity-80 flex items-center gap-1">
                      <MapPin size={10} />
                      {m.city}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="space-y-2">
                    {m.products.map((k) => (
                      <div key={k.n} className="flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2">
                        <span className="text-[12px] font-medium truncate pr-2">{k.n}</span>
                        <span className="text-[11px] font-bold whitespace-nowrap">{k.p}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-[11px] font-bold flex items-center gap-1">
                    Visiter la boutique <ChevronRight size={12} className="group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-5 md:px-8 py-16 md:py-24 text-center">
        <div className="inline-flex rounded-full bg-[#009E49] text-white px-3 py-1 text-[11px] font-black tracking-widest">
          INSCRIPTION • 2 MINUTES
        </div>
        <h2 className="mt-4 text-[32px] md:text-[44px] font-extrabold leading-[0.95] tracking-tight">
          Votre boutique
          <br />
          ce soir même.
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-zinc-600 max-w-[560px] mx-auto">
          Créez un vrai compte, gratuitement. Pas de carte bancaire nécessaire.
        </p>
        <Link
          to="/inscription"
          className="mt-7 inline-flex h-[52px] px-7 rounded-full bg-[#EF2B2D] text-white font-bold text-[15px] items-center gap-2 shadow-[0_10px_24px_rgba(239,43,45,0.3)] hover:bg-[#d42426] transition"
        >
          Créer ma boutique gratuitement <ArrowRight size={18} />
        </Link>
        <div className="mt-6 grid grid-cols-3 gap-3 max-w-[420px] mx-auto text-center">
          {[
            { k: "0 F", v: "pour commencer" },
            { k: "0%", v: "de commission" },
            { k: "<5min", v: "pour être en ligne" },
          ].map((m) => (
            <div key={m.k} className="rounded-2xl border bg-white p-3">
              <div className="font-extrabold text-[18px]">{m.k}</div>
              <div className="text-[11px] text-zinc-500">{m.v}</div>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative w-full md:max-w-[520px] bg-white rounded-t-[28px] md:rounded-[28px] shadow-2xl overflow-hidden max-h-[88vh] flex flex-col animate-[slideUp_0.25s_ease]">
            <div className={`h-28 ${selected.color} p-5 flex justify-between`}>
              <div>
                <div className="text-[26px]">{selected.emoji}</div>
                <div className="mt-1 font-extrabold text-[20px] leading-tight">{selected.name}</div>
                <div className="text-[12px] opacity-80">
                  {selected.cat} • {selected.city}
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="h-9 w-9 rounded-full bg-white/20 grid place-items-center">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-auto">
              <div className="text-[13px] text-zinc-600">{selected.desc}</div>
              <div className="grid grid-cols-1 gap-2">
                {selected.products.map((m) => (
                  <div key={m.n} className="flex items-center justify-between rounded-2xl border bg-zinc-50 p-4">
                    <div>
                      <div className="font-bold text-[14px]">{m.n}</div>
                      <div className="text-[12px] text-zinc-500">Livraison aujourd'hui • Stock: 12</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black">{m.p}</div>
                      <button className="mt-1 h-7 px-3 rounded-full bg-zinc-900 text-white text-[11px] font-bold">
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl bg-zinc-900 text-white p-4 flex items-center justify-between">
                <div className="text-[12px]">
                  Boutique vérifiée • Paiement sécurisé
                  <br />
                  <span className="text-[#FCD116] font-bold">Orange Money • Moov • Wave</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#009E49] grid place-items-center">
                  <MessageCircle size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
