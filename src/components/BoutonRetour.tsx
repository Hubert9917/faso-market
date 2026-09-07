import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BoutonRetour({ className }: { className?: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className={className ?? "inline-flex items-center gap-1.5 text-[13px] font-semibold text-zinc-500 hover:text-zinc-900 transition"}
    >
      <ArrowLeft size={16} /> Retour
    </button>
  );
}
