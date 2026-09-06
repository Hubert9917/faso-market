export default function SupabaseAvertissement() {
  return (
    <div className="min-h-screen grid place-items-center text-center px-5">
      <div className="max-w-[420px]">
        <div className="text-[20px] font-extrabold">Supabase non configuré</div>
        <p className="mt-2 text-[13px] text-zinc-500">
          Ajoute <code>VITE_SUPABASE_URL</code> et <code>VITE_SUPABASE_ANON_KEY</code> dans <code>.env.local</code>{" "}
          (voir <code>.env.example</code>) pour activer les comptes, boutiques et produits.
        </p>
      </div>
    </div>
  );
}
