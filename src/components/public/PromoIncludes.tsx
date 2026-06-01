import { formatIncludesLine } from "@/lib/promo-includes";

type PromoIncludesInlineProps = {
  names: string[];
  className?: string;
};

export function PromoIncludesInline({ names, className }: PromoIncludesInlineProps) {
  const line = formatIncludesLine(names);
  if (!line) return null;
  return <p className={className}>{line}</p>;
}

type PromoIncludesSectionProps = {
  names: string[];
};

export function PromoIncludesSection({ names }: PromoIncludesSectionProps) {
  if (!names.length) return null;

  return (
    <div className="mb-3.5">
      <p className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[1.5px] text-brand-cream/50">
        Productos incluidos
      </p>
      <ul className="list-inside list-disc space-y-0.5 text-[13px] text-brand-cream/60">
        {names.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
