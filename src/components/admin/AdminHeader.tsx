import LogoutButton from "@/components/admin/LogoutButton";

type AdminHeaderProps = {
  email: string;
  name?: string | null;
};

export default function AdminHeader({ email, name }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-[54px] items-center justify-between border-b border-brand-gray1 bg-brand-black2 px-6">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-[22px] tracking-[2px] text-brand-orange">
          ⚙ ADMIN
        </h1>
        <span className="hidden text-xs text-brand-cream/35 sm:inline">
          {name || email}
        </span>
      </div>
      <LogoutButton />
    </header>
  );
}
