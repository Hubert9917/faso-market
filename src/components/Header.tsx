import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-zinc-100">
      <div className="mx-auto max-w-[1180px] px-5 md:px-8 h-[68px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white grid place-items-center font-black tracking-tight">
            F
          </div>
          <div className="leading-none">
            <div className="font-extrabold tracking-tight text-[17px]">FASO MARKET</div>
            <div className="text-[10px] font-bold tracking-[0.18em] text-zinc-500">BURKINA • BF</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-medium text-zinc-600">
          <a href="/#comment" className="hover:text-black">Comment ça marche</a>
          <a href="/#tarifs" className="hover:text-black">Tarifs</a>
          <a href="/#boutiques" className="hover:text-black">Boutiques</a>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/dashboard"
              className="h-10 px-5 rounded-full bg-zinc-900 text-white text-[13.5px] font-bold"
            >
              Mon tableau de bord
            </Link>
          ) : (
            <>
              <Link
                to="/connexion"
                className="hidden md:inline-flex h-9 px-4 rounded-full bg-zinc-900 text-white text-[13px] font-semibold"
              >
                Se connecter
              </Link>
              <Link
                to="/inscription"
                className="h-10 px-5 rounded-full bg-[#EF2B2D] text-white text-[13.5px] font-bold shadow-[0_8px_20px_rgba(239,43,45,0.25)] hover:bg-[#d42426] transition"
              >
                Créer ma boutique
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
