"use client";

import { motion } from "framer-motion";
import { User, Mail, MapPin, Home, LogOut, Edit2, Shield } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-slate-400">Your Account Information</p>
        </div>
        <Link href="/dashboard">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition"
          >
            <Home size={24} />
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Avatar & Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <GlassCard className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
            >
              <User size={48} className="text-white" />
            </motion.div>

            <h2 className="text-2xl font-bold text-white mb-1">
              {user.displayName || "User"}
            </h2>
            <p className="text-slate-400 text-sm mb-6">Account Owner</p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition flex items-center justify-center gap-2"
              >
                <Edit2 size={18} />
                Edit Profile
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full py-2 px-4 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium transition flex items-center justify-center gap-2 border border-red-600/50"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Account Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Account Details
            </h2>

            <div className="space-y-4">
              {/* Email */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className="text-blue-400" />
                  <span className="text-slate-400 text-sm">Email Address</span>
                </div>
                <p className="text-white font-mono ml-9">
                  {user.email || "Not provided"}
                </p>
              </div>

              {/* User ID */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Shield size={18} className="text-green-400" />
                  <span className="text-slate-400 text-sm">User ID</span>
                </div>
                <p className="text-white font-mono text-sm ml-9 break-all">
                  {user.uid}
                </p>
              </div>

              {/* Account Status */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Account Status</p>
                    <p className="text-white font-medium">Active</p>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-3 h-3 rounded-full bg-green-400"
                  />
                </div>
              </div>

              {/* Email Verification */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">Email Verified</p>
                    <p className={`font-medium ${user.emailVerified ? "text-green-400" : "text-yellow-400"}`}>
                      {user.emailVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      user.emailVerified ? "bg-green-400" : "bg-yellow-400"
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
        className="mt-6"
      >
        <GlassCard className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Preferences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notifications */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Dark Mode */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Dark Mode</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Real-time Updates */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Real-time Updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Data Analytics */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Data Analytics</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
