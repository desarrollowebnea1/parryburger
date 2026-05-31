import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export function AdminInput({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="admin-label mb-1 block text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
        {label}
      </span>
      <input className={`admin-input w-full ${className}`} {...props} />
    </label>
  );
}

export function AdminTextarea({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <label className="block">
      <span className="admin-label mb-1 block text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
        {label}
      </span>
      <textarea className={`admin-input min-h-[90px] w-full resize-y ${className}`} {...props} />
    </label>
  );
}

export function AdminSelect({
  label,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="admin-label mb-1 block text-[11px] font-bold uppercase tracking-wide text-brand-cream/40">
        {label}
      </span>
      <select className={`admin-input w-full ${className}`} {...props}>
        {children}
      </select>
    </label>
  );
}

export function AdminCheckbox({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-brand-cream/70">
      <input type="checkbox" className="accent-brand-orange" {...props} />
      {label}
    </label>
  );
}
