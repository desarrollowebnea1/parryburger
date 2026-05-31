export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[10px] border border-brand-gray1 bg-brand-black3 p-4">
      <div className="text-[11px] font-bold uppercase tracking-wide text-brand-cream/35">
        {label}
      </div>
      <div className="mt-1 font-display text-4xl text-brand-orange">{value}</div>
    </div>
  );
}
