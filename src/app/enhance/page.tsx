"use client";

import { useState } from "react";
import Link from "next/link";

export default function EnhancePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enhancedHtml, setEnhancedHtml] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEnhancedHtml(null);
    setLoading(true);

    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enhancement failed");
      setEnhancedHtml(data.html);
      setSiteName(data.siteName || "");
      setOriginalUrl(data.originalUrl || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e4e4ec]">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.04] bg-[#0a0a0f]/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/logo-horizontal.png" alt="FailFast" className="h-7 sm:h-8 w-auto object-contain" />
          </Link>
          <Link
            href="/"
            className="text-sm text-[#9090a8] hover:text-white transition-colors"
          >
            ← Back to Generator
          </Link>
        </div>
      </nav>

      {/* Main */}
      <div className="pt-20 sm:pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ec4899]/20 bg-[#ec4899]/5 text-sm text-[#f472b6] mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#ec4899] animate-pulse" />
              Website Enhancer
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              See your website{" "}
              <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
                reimagined
              </span>
            </h1>
            <p className="text-[#9090a8] text-lg max-w-xl mx-auto">
              Drop any URL and our AI will redesign it with modern aesthetics — same content, fresh look.
            </p>
          </div>

          {/* URL Input */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-10">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#606080]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="e.g. https://stripe.com"
                  className="w-full rounded-2xl border border-[#1e1e2e] bg-[#111118] pl-12 pr-5 py-4 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#ec4899]/50 focus:ring-1 focus:ring-[#ec4899]/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:shadow-[#ec4899]/20 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enhancing...
                  </span>
                ) : (
                  "✨ Enhance"
                )}
              </button>
            </div>
            {error && (
              <div className="mt-4 rounded-xl border border-[#ef4444]/20 bg-[#ef4444]/5 px-4 py-3 text-sm text-[#ef4444]">
                {error}
              </div>
            )}
          </form>

          {/* Preview */}
          {loading && (
            <div className="rounded-3xl border border-[#1e1e2e] bg-[#111118] p-10 text-center">
              <div className="animate-pulse space-y-4 max-w-2xl mx-auto">
                <div className="h-6 w-32 bg-[#1e1e2e] rounded-lg mx-auto" />
                <div className="h-4 w-64 bg-[#1e1e2e] rounded-lg mx-auto" />
                <div className="h-80 bg-[#1e1e2e] rounded-2xl" />
              </div>
              <p className="text-sm text-[#9090a8] mt-6">
                Analyzing and redesigning{" "}
                <span className="text-[#f472b6]">{url}</span>...
              </p>
            </div>
          )}

          {enhancedHtml && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    {siteName || "Website"} — Enhanced Preview
                  </h3>
                  <p className="text-xs text-[#606080]">
                    Original: {originalUrl || url}
                  </p>
                </div>
                <span className="rounded-full border border-[#10b981]/20 bg-[#10b981]/5 px-3 py-1 text-xs text-[#10b981]">
                  AI Enhanced
                </span>
              </div>

              {/* Iframe preview */}
              <div className="rounded-2xl border border-[#1e1e2e] overflow-hidden bg-white">
                <div className="bg-[#111118] border-b border-[#1e1e2e] px-4 py-2 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ef4444]/60" />
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b]/60" />
                    <span className="w-3 h-3 rounded-full bg-[#10b981]/60" />
                  </div>
                  <span className="text-[10px] text-[#606080] ml-3">Enhanced Preview</span>
                </div>
                <iframe
                  srcDoc={enhancedHtml}
                  className="w-full border-0"
                  style={{ height: "600px" }}
                  sandbox="allow-same-origin"
                  title="Enhanced Website Preview"
                />
              </div>

              {/* Consult CTA */}
              <div className="rounded-2xl border border-[#ec4899]/20 bg-gradient-to-br from-[#ec4899]/5 to-[#a855f7]/5 p-7 sm:p-8 text-center mt-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ec4899]/20 to-[#a855f7]/20 flex items-center justify-center text-2xl mb-4 mx-auto">
                  📞
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Like what you see?</h3>
                <p className="text-sm text-[#9090a8] max-w-md mx-auto mb-5">
                  Let our team build this for real. Get a custom website that actually converts — we handle design, development, and deployment.
                </p>
                <a
                  href="https://calendly.com/adv-nirvatec/failfast"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#ec4899]/20 hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}
                >
                  Book a Consult
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
                <p className="text-xs text-[#606080] mt-4">
                  Or skip the queue — <Link href="/" className="text-[#d8b4fe] hover:text-[#a855f7] underline underline-offset-2 transition-colors">generate a blueprint</Link> first
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
