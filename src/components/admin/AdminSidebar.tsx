"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Plus,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "All Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-6 left-6 z-50 lg:hidden w-10 h-10 rounded-lg bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isCollapsed ? -320 : 0,
        }}
        className="fixed left-0 top-0 h-screen w-80 bg-white/5 backdrop-blur-2xl border-r border-white/10 z-40 flex flex-col p-6"
      >
        {/* Logo */}
        <div className="mb-10">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-light text-white">
              C0KPIT <span className="text-blue-400">ADMIN</span>
            </h1>
          </Link>
          <p className="text-white/40 text-xs mt-1">Management Portal</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-white/60 hover:bg-white/10 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Create Project Button */}
        <Link href="/admin/project/new">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all"
          >
            <Plus className="w-5 h-5" />
            New Project
          </motion.button>
        </Link>

        {/* Logout */}
        <button
          onClick={() => {
            console.log("Logging out...");
            window.location.href = "/";
          }}
          className="w-full px-4 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 font-medium flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </motion.aside>

      {/* Main Content Spacer */}
      <div className="ml-80 hidden lg:block" />
    </>
  );
}
