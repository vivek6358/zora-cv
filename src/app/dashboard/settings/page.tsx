"use client";

import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Shield, Bell, Palette, LogOut, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(session?.user?.name || "");

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully!");
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Account Settings</h1>
        <p className="text-slate-505 text-lg">Manage your profile and preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Settings Navigation */}
        <motion.div variants={item} className="col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={item} className="col-span-1 md:col-span-2 relative min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Public Profile</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                      {session?.user?.name?.charAt(0) || "U"}
                    </div>
                    <div>
                      <button 
                        onClick={() => toast.info("Image upload coming soon.")}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-xl font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Change Avatar
                      </button>
                      <p className="text-xs text-slate-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        defaultValue={session?.user?.email || ""} 
                        className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Verified via NextAuth
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <button 
                        onClick={handleSaveProfile}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors active:scale-95"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-rose-500/5 rounded-3xl border border-rose-100 dark:border-rose-500/10 p-8">
                  <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-2">Danger Zone</h2>
                  <p className="text-rose-600/70 dark:text-rose-400/70 text-sm mb-6">
                    These actions are permanent and cannot be undone.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors active:scale-95"
                    >
                      <LogOut className="w-4 h-4" /> Sign out of all devices
                    </button>
                    <button 
                      onClick={() => toast.error("Account deletion requires admin contact during beta.")}
                      className="flex items-center justify-center gap-2 w-full bg-rose-600 text-white py-2.5 rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 active:scale-95"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            )}



            {["security", "notifications", "appearance"].includes(activeTab) && (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  {activeTab === "security" && <Shield className="w-8 h-8 text-slate-400" />}
                  {activeTab === "notifications" && <Bell className="w-8 h-8 text-slate-400" />}
                  {activeTab === "appearance" && <Palette className="w-8 h-8 text-slate-400" />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 capitalize">{activeTab} Settings</h3>
                <p className="text-slate-500">This feature is currently rolling out in beta. Check back soon.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}
