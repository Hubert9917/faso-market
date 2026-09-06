import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default function InscriptionPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationRequise, setConfirmationRequise] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      navigate("/dashboard");
    } else {
      // La confirmation par email est activée sur le projet Supabase.
      setConfirmationRequise(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFEFB]">
      <Header />
      <div className="mx-auto max-w-[440px] px-5 py-16 md:py-24">
        <div className="inline-flex rounded-full bg-[#009E49] text-white px-3 py-1 text-[11px] font-black tracking-widest">
          INSCRIPTION • GRATUIT
        </div>
        <h1 className="mt-4 text-[30px] font-extrabold tracking-tight leading-[0.95]">
          Créez votre compte marchand
        </h1>
        <p className="mt-3 text-[14px] text-zinc-600">
          Vous créerez votre boutique et ajouterez vos produits juste après.
        </p>

        {confirmationRequise ? (
          <div className="mt-8 rounded-2xl bg-[#009E49] text-white p-5 flex gap-3">
            <div className="h-9 w-9 shrink-0 rounded-full bg-white text-[#009E49] grid place-items-center">
              <Check size={18} />
            </div>
            <div className="text-[13px] leading-relaxed">
              <b>Compte créé !</b> Vérifiez votre boîte mail ({email}) et cliquez sur le lien de confirmation,
              puis <Link to="/connexion" className="underline font-bold">connectez-vous</Link>.
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 rounded-[24px] bg-white border shadow-[0_10px_30px_rgba(0,0,0,0.04)] p-6 space-y-4">
            <div>
              <label className="text-[12px] font-bold">Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                className="mt-1 w-full h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-[14px] outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div>
              <label className="text-[12px] font-bold">Mot de passe *</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
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
              className="w-full h-[52px] rounded-full bg-[#EF2B2D] text-white font-bold text-[15px] shadow-[0_10px_24px_rgba(239,43,45,0.3)] hover:bg-[#d42426] transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Création…" : "Créer mon compte"} <ArrowRight size={18} />
            </button>

            <div className="text-center text-[13px] text-zinc-600">
              Déjà un compte ? <Link to="/connexion" className="font-bold text-zinc-900 underline">Se connecter</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
