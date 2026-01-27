"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { MOCK_USER } from "@/lib/mock-data";
import { User, Moon, Sun, Bell, Globe, LogOut as LogOutIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("en");

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/");
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-light text-white mb-2">
            Settings
          </h1>
          <p className="text-white/40 text-sm">
            Manage your preferences and account
          </p>
        </div>

        {/* Settings Grid */}
        <div className="space-y-6">
          
          {/* Profile Section */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center gap-4 mb-6">
              <User className="w-5 h-5 text-white/60" />
              <h2 className="text-xl font-light text-white">Profile</h2>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {MOCK_USER.name.charAt(0)}
                </span>
              </div>
              
              <div className="flex-1">
                <p className="text-white font-medium text-lg mb-1">
                  {MOCK_USER.name}
                </p>
                <p className="text-white/60 text-sm mb-3">
                  {MOCK_USER.email}
                </p>
                <p className="text-white/40 text-xs uppercase tracking-wider">
                  {MOCK_USER.role}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Appearance Section */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center gap-4 mb-6">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-white/60" />
              ) : (
                <Sun className="w-5 h-5 text-white/60" />
              )}
              <h2 className="text-xl font-light text-white">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Theme Mode
                  </p>
                  <p className="text-white/40 text-xs">
                    Choose your preferred color scheme
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setTheme("light")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "light"
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Sun className="w-4 h-4 inline mr-2" />
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "dark"
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <Moon className="w-4 h-4 inline mr-2" />
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      theme === "system"
                        ? "bg-white/20 text-white border border-white/30"
                        : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    Auto
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Notifications Section */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center gap-4 mb-6">
              <Bell className="w-5 h-5 text-white/60" />
              <h2 className="text-xl font-light text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Email Notifications
                  </p>
                  <p className="text-white/40 text-xs">
                    Receive updates about your projects
                  </p>
                </div>
                
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? "bg-blue-500" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Language Section */}
          <GlassCard className="p-6" hover>
            <div className="flex items-center gap-4 mb-6">
              <Globe className="w-5 h-5 text-white/60" />
              <h2 className="text-xl font-light text-white">Language</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium mb-1">
                    Preferred Language
                  </p>
                  <p className="text-white/40 text-xs">
                    Select your display language
                  </p>
                </div>
                
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="en" className="bg-zinc-900">English</option>
                  <option value="ja" className="bg-zinc-900">日本語</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Logout Section */}
          <GlassCard className="p-6 border-red-500/30 bg-red-500/5" hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <LogOutIcon className="w-5 h-5 text-red-400" />
                <div>
                  <h2 className="text-xl font-light text-white mb-1">
                    Logout
                  </h2>
                  <p className="text-white/40 text-xs">
                    Sign out of your account
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm font-medium transition-all hover:scale-105 flex items-center gap-2"
              >
                Logout
              </button>
            </div>
          </GlassCard>
        </div>
      </motion.div>
    </div>
  );
}
