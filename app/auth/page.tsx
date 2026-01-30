"use client";

import { useState } from "react";
import { themeByAQI } from "@/lib/theme";
import { data as mockData } from "@/lib/mock";
import { useRouter } from 'next/navigation'

export default function AuthPage({ onSuccess }: { onSuccess: () => void }) {
  const theme = themeByAQI(mockData.aqi);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    if (!isLogin && password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard") 
      // Simulate success
      onSuccess();
    }, 1000);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
      onSuccess();
    }, 1000);
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center px-6 md:px-16 bg-gradient-to-br ${theme.bg} text-white`}
    >
      <div className="max-w-md w-full rounded-2xl bg-white/10 backdrop-blur-xl p-8 md:p-12 space-y-6 border border-white/10 shadow-lg">
        <h1 className={`text-3xl sm:text-4xl font-bold text-center ${theme.accent}`}>
          {isLogin ? "Login" : "Sign Up"}
        </h1>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder:text-neutral-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder:text-neutral-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            required
          />

          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/20 placeholder:text-neutral-300 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              required
            />
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-400/30 hover:bg-emerald-400/50 transition font-semibold"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center gap-4 my-2">
          <hr className="border-white/20 flex-1" />
          <span className="text-xs text-neutral-400 uppercase">or</span>
          <hr className="border-white/20 flex-1" />
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition font-medium text-black"
        >
          <img
            src="/images/google-icon.svg"
            alt="Google"
            className="w-5 h-5"
          />
          {loading ? "Processing..." : "Continue with Google"}
        </button>

        {/* Toggle Link */}
        <p className="text-center text-neutral-300 text-sm mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
            className={`underline font-medium ${theme.accent}`}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {/* Message */}
        {message && (
          <p className="text-center mt-2 text-sm text-rose-400">{message}</p>
        )}
      </div>
    </main>
  );
}
