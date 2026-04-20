"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Home, LogOut, Edit2, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { Navbar } from "@/components/ui/Navbar";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ProfilePage() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen p-4 sm:p-6 transition-all duration-700 bg-[#050505] relative overflow-hidden"
    >
      <BackgroundGradient />

      <div className="space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Profile</h1>
            <p className="text-white/40 text-sm">Your Account Information</p>
          </div>
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white transition"
            >
              <Home size={24} />
            </motion.button>
          </Link>
        </motion.div>

        {/* Profile & Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 h-fit">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
                >
                  <User size={40} className="text-black" />
                </motion.div>

                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {user.displayName || "User"}
                </h2>
                <p className="text-white/40 text-xs sm:text-sm mb-6">Account Owner</p>

                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full py-2 px-4 rounded-lg bg-primary text-black font-medium text-sm transition flex items-center justify-center gap-2 hover:opacity-90"
                  >
                    <Edit2 size={16} />
                    Edit
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="w-full py-2 px-4 rounded-lg bg-accent/10 border border-accent/30 text-accent font-medium text-sm transition flex items-center justify-center gap-2 hover:bg-accent/20"
                  >
                    <LogOut size={16} />
                    Logout
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* Account Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Account Details
              </h2>

              <div className="space-y-4">
                {/* Email */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail size={18} className="text-primary flex-shrink-0" />
                    <span className="text-white/40 text-sm">Email</span>
                  </div>
                  <p className="text-white font-mono text-xs sm:text-sm break-all">
                    {user.email || "Not provided"}
                  </p>
                </div>

                {/* User ID */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={18} className="text-secondary flex-shrink-0" />
                    <span className="text-white/40 text-sm">User ID</span>
                  </div>
                  <p className="text-white font-mono text-xs sm:text-sm break-all">
                    {user.uid}
                  </p>
                </div>

                {/* Account Status */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-sm mb-1">Status</p>
                      <p className="text-white font-medium text-sm">Active</p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-3 h-3 rounded-full bg-primary"
                    />
                  </div>
                </div>

                {/* Email Verification */}
                <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/40 text-sm mb-1">Email Verified</p>
                      <p className={`font-medium text-sm ${user.emailVerified ? "text-primary" : "text-yellow-400"}`}>
                        {user.emailVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        user.emailVerified ? "bg-primary" : "bg-yellow-400"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Preferences Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Preferences
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Notifications */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                <span className="text-white font-medium text-sm">Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary/20 transition"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition"></span>
                </label>
              </div>

              {/* Dark Mode */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                <span className="text-white font-medium text-sm">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary/20 transition"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition"></span>
                </label>
              </div>

              {/* Real-time Updates */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                <span className="text-white font-medium text-sm">Real-time Updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary/20 transition"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition"></span>
                </label>
              </div>

              {/* Data Analytics */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                <span className="text-white font-medium text-sm">Data Analytics</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:bg-primary/20 transition"></div>
                  <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-4 transition"></span>
                </label>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <Navbar />
      </div>
    </main>
  );
}
