import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

type BrandIconProps = {
  size?: number;
  className?: string;
};

export function WhatsAppIcon({ size = 20, className = "" }: BrandIconProps) {
  return (
    <FaWhatsapp
      size={size}
      className={`shrink-0 ${className}`}
      aria-hidden
      style={{ color: "#25D366" }}
    />
  );
}

export function WhatsAppIconOnGreen({ size = 18, className = "" }: BrandIconProps) {
  return (
    <FaWhatsapp size={size} className={`shrink-0 text-white ${className}`} aria-hidden />
  );
}

export function InstagramIcon({ size = 20, className = "" }: BrandIconProps) {
  return (
    <FaInstagram
      size={size}
      className={`shrink-0 text-brand-cream ${className}`}
      aria-hidden
    />
  );
}

export function FacebookIcon({ size = 20, className = "" }: BrandIconProps) {
  return (
    <FaFacebookF
      size={size}
      className={`shrink-0 ${className}`}
      aria-hidden
      style={{ color: "#1877F2" }}
    />
  );
}
