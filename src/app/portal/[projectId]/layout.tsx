"use client";
import { FloatingDock } from "@/components/ui/floating-dock";
import { Home, FolderKanban, Settings, Files } from "lucide-react";
import { useParams } from "next/navigation";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params.projectId as string;

  const links = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-neutral-300" />,
      href: `/portal/${projectId}`,
    },
    {
      title: "Tasks",
      icon: <FolderKanban className="h-full w-full text-neutral-300" />,
      href: `/portal/${projectId}/tasks`,
    },
    {
      title: "Files",
      icon: <Files className="h-full w-full text-neutral-300" />,
      href: `/portal/${projectId}/files`,
    },
    {
      title: "Artifacts",
      icon: <Files className="h-full w-full text-neutral-300" />,
      href: `/portal/${projectId}/artifacts`,
    },
    {
      title: "Settings",
      icon: <Settings className="h-full w-full text-neutral-300" />,
      href: `/portal/${projectId}/settings`,
    },
  ];

  return (
    <div className="relative min-h-screen bg-black overflow-hidden font-sans antialiased">
      {/* Aurora Background as the 'Stage' atmosphere */}
      <AuroraBackground className="fixed inset-0 z-0 opacity-40 h-full w-full" />
      
      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen pb-32">
        {/* Top Header / Status bar area */}
        <header className="px-8 py-6 flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-light tracking-widest text-white uppercase italic">
              C0KPIT <span className="text-blue-500">Stage</span>
            </h1>
            <p className="text-[10px] text-white/40 tracking-[0.2em] font-mono">
              PROJECTID: {projectId?.toUpperCase()}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
          </div>
        </header>

        <div className="px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Floating Dock - Navigation Rule L54 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <FloatingDock items={links} />
      </div>
    </div>
  );
}
