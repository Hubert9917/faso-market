import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default function ConnexionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <Header />
      <div className="mx-auto max-w-[440px] px-5 py-16 md:py-24">
        <h1 className="text-[30px] font-extrabold tracking-tight leading-[0.95]">Content de vous revoir</h1>
        <p className="mt-3 text-[14px] text-zinc-600">Connectez-vous pour gérer votre boutique.</p>

        <form onSubmit={onSubmit} className="mt-8 rounded-[24px] bg-white border shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 space-y-4">
          <div>
            <label className="text-[12px] font-bold">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
          <div>
            <label className="text-[12px] font-bold">Mot de passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 border border-[#EF2B2D]/30 px-4 py-3 text-[12.5px] text-[#EF2B2D] font-semibold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] rounded-full bg-zinc-900 text-white font-bold text-[15px] hover:bg-black transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Connexion…" : "Se connecter"} <ArrowRight size={18} />
          </button>

          <div className="text-center text-[13px] text-zinc-600">
            Pas encore de compte ? <Link to="/inscription" className="font-bold text-zinc-900 underline">Créer ma boutique</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
