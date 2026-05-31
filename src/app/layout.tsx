import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, Bebas_Neue } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow-cond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Parry Burger Express | Hamburguesas, Milanesas y Pizzas",
  description:
    "Pedí online hamburguesas, milanesas, pizzas y promos en Parry Burger Express. Envío a domicilio en Corrientes.",
  openGraph: {
    title: "Parry Burger Express",
    description: "Sabores que te encantan. Pedí por WhatsApp.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
