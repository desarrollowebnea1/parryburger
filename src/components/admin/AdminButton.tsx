import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  href?: string;
  children: ReactNode;
};

const variants = {
  primary: "bg-brand-orange text-white hover:bg-brand-orange-dark",
  secondary: "border border-brand-gray1 text-brand-cream/70 hover:border-brand-orange hover:text-brand-orange",
  danger: "border border-[#c0392b]/40 text-[#c0392b] hover:bg-[#c0392b]/10",
  ghost: "text-brand-cream/45 hover:text-brand-cream",
};

export default function AdminButton({
  variant = "primary",
  href,
  className = "",
  children,
  ...props
}: AdminButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
