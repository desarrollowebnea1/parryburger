import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <AdminHeader email={session.email} />
        <main className="mx-auto w-full min-w-0 max-w-[1100px] flex-1 overflow-x-hidden p-4 pb-8 sm:p-6 md:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}
