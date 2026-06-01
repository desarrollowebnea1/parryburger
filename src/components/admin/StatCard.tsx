export default function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-[10px] border border-brand-gray1 bg-brand-black3 p-3 sm:p-4">
      <div className="text-[10px] font-bold uppercase tracking-wide text-brand-cream/35 sm:text-[11px]">
        {label}
      </div>
      <div className="mt-0.5 font-display text-3xl text-brand-orange sm:mt-1 sm:text-4xl">
        {value}
      </div>
    </div>
  );
}
