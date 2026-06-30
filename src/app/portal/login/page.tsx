"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      if (data.isAdmin) {
        router.push("/portal/admin");
      } else {
        router.push("/portal/client");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[#6C63FF] font-bold text-xl">
            <span className="text-2xl">🧬</span>
            Blueprint Portal
          </Link>
          <p className="text-sm text-[#9090a8] mt-2">Sign in to view your assigned blueprints</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#1e1e2e] bg-[#111118] p-6 sm:p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 px-4 py-3 text-sm text-[#ef4444]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #6C63FF, #7b73ff)" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-xs text-[#606080]">
            Don&apos;t have an account?{" "}
            <span className="text-[#9090a8]">
              A FailFast team member will create one for you during your consult.
            </span>
          </p>
        </form>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#606080] hover:text-[#a5a0ff] transition-colors">
            ← Back to Blueprint Generator
          </Link>
        </div>
      </div>
    </div>
  );
}
