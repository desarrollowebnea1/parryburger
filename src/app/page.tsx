import PublicHome from "@/components/public/PublicHome";
import { getPublicHomeData } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { settings, categories, promos } = await getPublicHomeData();

  if (!settings) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-black px-6 text-center text-brand-cream">
        <div>
          <h1 className="mb-3 font-display text-4xl text-brand-orange">
            Parry Burger Express
          </h1>
          <p className="text-sm text-brand-cream/55">
            Configuración no encontrada. Ejecutá{" "}
            <code className="text-brand-orange">npm run db:migrate</code> y{" "}
            <code className="text-brand-orange">npm run db:seed</code>.
          </p>
        </div>
      </main>
    );
  }

  return (
    <PublicHome settings={settings} categories={categories} promos={promos} />
  );
}
