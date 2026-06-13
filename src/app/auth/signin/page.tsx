"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Atom, Mail, Lock, Chrome, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push(callbackUrl);
    }
  };

  const handleGoogle = () => {
    setLoading(true);
    signIn("google", { callbackUrl });
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    // Guest mode: sign in with guest credentials (auto-created account)
    const res = await signIn("credentials", {
      email: "guest@simulearn.app",
      password: "guest-access-2024",
      redirect: false,
    });
    setGuestLoading(false);
    if (res?.ok) {
      router.push(callbackUrl);
    } else {
      router.push("/"); // fallback: just go home
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-surface-100 border border-surface-200 rounded-2xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-400 to-purple-500 rounded-2xl mb-4 shadow-lg">
              <Atom className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-surface-300 mt-1 text-sm">Sign in to continue learning</p>
          </div>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white/5 hover:bg-white/10 border border-surface-200 hover:border-surface-300 rounded-xl text-white font-medium transition-all mb-4 disabled:opacity-50"
          >
            <Chrome className="w-5 h-5 text-blue-400" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400">or sign in with email</span>
            <div className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleCredentials} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-surface-200 border border-surface-300 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-surface-400 focus:outline-none focus:border-brand-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-surface-200 border border-surface-300 rounded-xl py-3 pl-10 pr-12 text-white placeholder:text-surface-400 focus:outline-none focus:border-brand-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-brand-500/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Guest */}
          <button
            onClick={handleGuest}
            disabled={guestLoading}
            className="w-full mt-3 py-3 bg-surface-200/50 hover:bg-surface-200 border border-dashed border-surface-300 text-surface-300 hover:text-white rounded-xl transition-all text-sm font-medium flex items-center justify-center gap-2"
          >
            {guestLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Continue as Guest (no account needed)
          </button>

          {/* Sign up link */}
          <p className="text-center text-sm text-surface-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-brand-400 hover:text-brand-300 font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-400" /></div>}>
      <SignInForm />
    </Suspense>
  );
}
