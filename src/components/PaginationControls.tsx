import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        onClick={onPrev}
        disabled={page <= 1}
        className="h-10 px-4 rounded-full border border-zinc-200 bg-white text-[13px] font-bold inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-300 transition"
      >
        <ChevronLeft size={16} /> Page précédente
      </button>
      <span className="text-[13px] text-zinc-500 font-medium">
        Page {page} sur {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="h-10 px-4 rounded-full border border-zinc-200 bg-white text-[13px] font-bold inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:border-zinc-300 transition"
      >
        Page suivante <ChevronRight size={16} />
      </button>
    </div>
  );
}
