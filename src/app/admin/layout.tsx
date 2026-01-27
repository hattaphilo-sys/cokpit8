import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground>
        <AdminSidebar />
        <main className="lg:ml-80 min-h-screen">
          {children}
        </main>
      </AuroraBackground>
    </div>
  );
}
