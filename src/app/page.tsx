"use client";

import { useState, useRef } from "react";
import Link from "next/link";

/* ─── Types ─── */

interface TechLayer {
  layer: string;
  tech: string;
  reason: string;
}

interface TechStack {
  frontend: TechLayer[];
  backend: TechLayer[];
  database: TechLayer[];
  infrastructure: TechLayer[];
  integrations: TechLayer[];
  mvpCost: string;
  scaleUpCost: string;
  timeToMvp: string;
  summarySentence: string;
}

interface BlueprintDoc {
  title: string;
  description: string;
}

interface BlueprintResult {
  blueprintId: string;
  techStack: TechStack;
  blueprintDocuments: BlueprintDoc[];
  featureMap?: FeatureMapEntry[];
}

interface FeatureMapEntry {
  feature: string;
  icon: string;
  techNodes: string[];
  flow: string;
}

/* ─── Color Palette ─── */
const COLORS = {
  bg: "bg-[#0a0a0f]",
  card: "bg-[#111118]",
  cardHover: "hover:bg-[#161622]",
  border: "border-[#1e1e2e]",
  text: "text-[#e4e4ec]",
  muted: "text-[#9090a8]",
  accent: "#a855f7",
  accentHover: "#c084fc",
  accentBg: "bg-[#a855f7]/10",
  accentBorder: "border-[#a855f7]/30",
  accentText: "text-[#a855f7]",
  pink: "#ec4899",
  pinkBg: "bg-[#ec4899]/10",
  pinkText: "text-[#ec4899]",
  gold: "#f59e0b",
  goldBg: "bg-[#f59e0b]/10",
  green: "#10b981",
  greenBg: "bg-[#10b981]/10",
  greenText: "text-[#10b981]",
  red: "#ef4444",
  redBg: "bg-[#ef4444]/10",
  orange: "#f97316",
  orangeBg: "bg-[#f97316]/10",
};

const SECTION_COLORS: Record<string, string> = {
  frontend: COLORS.accent,
  backend: COLORS.pink,
  database: COLORS.orange,
  infrastructure: COLORS.gold,
  integrations: COLORS.green,
};

const SECTION_ICONS: Record<string, string> = {
  frontend: "🎨",
  backend: "⚙️",
  database: "🗄️",
  infrastructure: "☁️",
  integrations: "🔌",
};

/* ─── Main Page ─── */

export default function LandingPage() {
  return (
    <div className={`min-h-screen ${COLORS.bg} ${COLORS.text}`}>
      <Nav />
      <Hero />
      <HowItWorks />
      <GeneratorSection />
      <Footer />
    </div>
  );
}

/* ─── Navigation ─── */

function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/[0.04] bg-[#0a0a0f]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-14 sm:h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <img
            src="/logo-horizontal.png"
            alt="FailFast"
            className="h-7 sm:h-8 w-auto object-contain"
          />
        </a>
        <div className="flex items-center gap-3">
          <a
            href="#how-it-works"
            className="hidden sm:inline-flex text-sm text-[#9090a8] hover:text-white transition-colors"
          >
            How It Works
          </a>
          <a
            href="#generate"
            className="rounded-full text-sm font-medium text-white transition-all duration-300 hover:shadow-lg px-4 py-2 sm:px-5 sm:py-2.5"
            style={{
              background: "linear-gradient(135deg, #a855f7, #c084fc)",
            }}
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ─── */

function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-28 lg:pt-36 pb-20 sm:pb-28 lg:pb-36">
      {/* Background layers */}
      <div className="absolute inset-0 -z-20">
        {/* Generated hero background image */}
        <img
          src="/hero-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-100"
          aria-hidden="true"
        />
        {/* Fallback gradient overlay (visible while image loads, and as blend) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f]/0 via-[#0a0a0f]/30 to-[#0a0a0f]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_30%,rgba(168,85,247,0.08),transparent_50%),radial-gradient(ellipse_60%_80%_at_30%_70%,rgba(236,72,153,0.06),transparent_50%)]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-3xl">
          {/* Pipeline badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#a855f7]/20 bg-[#a855f7]/5 text-sm text-[#d8b4fe] mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-pulse" />
            Validate your ideas first
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6">
            <span className="text-white">Test before you</span>
            <br />
            <span
              className="bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#c084fc] bg-clip-text text-transparent"
              style={{
                backgroundSize: "200% 100%",
              }}
            >
              invest.
            </span>
          </h1>

          {/* Subhead */}
          <p className="text-lg sm:text-xl text-[#9090a8] leading-relaxed max-w-xl mb-10">
            Turn your app idea into a practical MVP blueprint, usable by agentic AI to build a lean,
            testable version fast. FailFast helps you validate product-market fit before spending weeks
            overbuilding something the market may not want.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-12">
            <a
              href="#generate"
              className="group inline-flex items-center gap-2.5 px-7 py-4 rounded-2xl text-white font-semibold text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                boxShadow: "0 4px 24px rgba(168,85,247,0.25)",
              }}
            >
              <span className="text-lg">🧬</span>
              Generate Blueprint
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-2xl border border-white/[0.08] text-[#c4c4d8] font-medium text-sm hover:text-white hover:border-[#a855f7]/30 hover:bg-[#a855f7]/5 transition-all duration-300"
            >
              How It Works
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs text-[#606080]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">48h</p>
                <p>Average turn</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#ec4899]/10 border border-[#ec4899]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#ec4899]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI-Powered</p>
                <p>DeepSeek-driven</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 border border-[#10b981]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Full Stack</p>
                <p>Lighthouse-ready</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#c084fc]/10 border border-[#c084fc]/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#c084fc]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Free</p>
                <p>No card required</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to next section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent -z-10" />
    </section>
  );
}

/* ─── How It Works ─── */

function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Blueprint the MVP",
      icon: "🧬",
      color: "#a855f7",
      glow: "rgba(168,85,247,0.15)",
      desc: "Describe your idea, audience, core features, budget, timeline, and platform. FailFast generates:",
      outputs: ["MVP scope", "Tech stack", "Core modules", "Database plan", "User flows", "Build sequence", "Scale-up notes"],
    },
    {
      num: "02",
      title: "Build with Agentic AI",
      icon: "🤖",
      color: "#ec4899",
      glow: "rgba(236,72,153,0.15)",
      desc: "Your blueprint becomes an agent-ready implementation brief. AI can generate the core pieces — or our team builds it for you.",
      outputs: ["Frontend", "Backend", "Database schema", "Auth flow", "Admin panel", "Deployment path", "Product screens"],
    },
    {
      num: "03",
      title: "Test Product-Market Fit",
      icon: "🎯",
      color: "#10b981",
      glow: "rgba(16,185,129,0.15)",
      desc: "Use the MVP to test real demand before investing more. Validate what matters:",
      outputs: ["Do users understand it?", "Do they sign up?", "Do they complete the core action?", "Do they return?", "Do they pay?", "Which features matter?"],
    },
  ];

  return (
    <section id="how-it-works" className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 overflow-hidden">
      {/* Section background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[#a855f7]/5 blur-[150px]" />
      </div>

      {/* Section header */}
      <div className="text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a855f7] mb-4">How It Works</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          Three steps from idea to{" "}
          <span className="bg-gradient-to-r from-[#a855f7] via-[#ec4899] to-[#10b981] bg-clip-text text-transparent">
            validated product
          </span>
        </h2>
        <p className="text-[#9090a8] text-lg max-w-xl mx-auto">
          Stop guessing. Start building with a proven process that takes you from concept to market validation.
        </p>
      </div>

      {/* Step cards with glassmorphism */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 relative">
        {/* Connecting line (desktop) */}
        <div className="hidden lg:block absolute top-1/3 left-[18%] right-[18%] h-px bg-gradient-to-r from-[#a855f7]/0 via-[#ec4899]/40 to-[#10b981]/0 z-0" />

        {steps.map((step, i) => (
          <div key={step.num} className="relative group z-10">
            {/* Card glow behind */}
            <div
              className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"
              style={{ background: `radial-gradient(600px circle at 50% 50%, ${step.glow}, transparent 70%)` }}
            />

            {/* Glassmorphism card */}
            <div className="relative rounded-3xl overflow-hidden h-full transition-all duration-500 group-hover:-translate-y-1">
              {/* Glass background */}
              <div
                className="absolute inset-0 backdrop-blur-xl border border-white/[0.06]"
                style={{
                  background: `linear-gradient(135deg, ${step.color}08 0%, rgba(17,17,24,0.7) 40%, rgba(17,17,24,0.6) 100%)`,
                }}
              />
              {/* Subtle inner border glow */}
              <div
                className="absolute inset-px rounded-[23px] opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, ${step.color}20, transparent 50%)`,
                }}
              />

              {/* Content */}
              <div className="relative p-7 sm:p-8">
                {/* Step number + icon */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl backdrop-blur-sm border border-white/[0.06]"
                      style={{
                        background: `linear-gradient(135deg, ${step.color}1a, ${step.color}08)`,
                        boxShadow: `0 0 20px ${step.color}10`,
                      }}
                    >
                      {step.icon}
                    </div>
                    <span
                      className="text-2xl font-bold tracking-tight"
                      style={{ color: step.color, fontFamily: "var(--font-space), monospace" }}
                    >
                      {step.num}
                    </span>
                  </div>

                  {/* Arrow connector (except last) */}
                  {i < 2 && (
                    <div className="hidden lg:flex items-center">
                      <svg className="w-5 h-5 opacity-30 group-hover:opacity-60 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: step.color }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-[#9090a8] leading-relaxed mb-6">{step.desc}</p>

                {/* Outputs */}
                <div
                  className="rounded-2xl p-5 space-y-2.5 backdrop-blur-sm border border-white/[0.04]"
                  style={{ background: `rgba(10,10,15,0.5)` }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#606080] mb-3">Deliverables</p>
                  <ul className="space-y-2">
                    {step.outputs.map((item, j) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm transition-all duration-300 group-hover:translate-x-0.5">
                        <span
                          className="mt-1 w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-offset-1 ring-offset-[#0a0a0f]"
                          style={{
                            background: step.color,
                            boxShadow: `0 0 6px ${step.color}60`,
                            transitionDelay: `${j * 50}ms`,
                          }}
                        />
                        <span className="text-[#c4c4d8] leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="flex justify-center mt-14">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#a855f7]/30 to-transparent" />
      </div>
    </section>
  );
}

/* ─── Generator Section ─── */

function GeneratorSection() {
  const [form, setForm] = useState({
    appName: "",
    appDescription: "",
    industry: "",
    features: "",
    platform: "web",
    clientName: "",
    clientEmail: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BlueprintResult | null>(null);
  const [error, setError] = useState("");
  const [consultSent, setConsultSent] = useState(false);
  const [sendingConsult, setSendingConsult] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const features = form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: form.appName,
          appDescription: form.appDescription,
          industry: form.industry || undefined,
          targetUsers: undefined,
          coreFeatures: features.length > 0 ? features : undefined,
          constraints: {
            platform: form.platform || undefined,
          },
          clientName: form.clientName || undefined,
          clientEmail: form.clientEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConsultRequest = async () => {
    if (!result) return;
    setSendingConsult(true);
    try {
      await fetch("/api/notify-consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: form.appName,
          appDescription: form.appDescription,
          industry: form.industry || undefined,
          clientName: form.clientName || undefined,
          clientEmail: form.clientEmail || undefined,
          blueprintId: result.blueprintId,
        }),
      });
      setConsultSent(true);
    } catch {
      // silent fail — mailto fallback available
    } finally {
      setSendingConsult(false);
    }
  };

  return (
    <section id="generate" className="max-w-6xl mx-auto px-6 py-20 sm:py-24 border-t border-[#1e1e2e]">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Generate Your Blueprint</h2>
        <p className="text-[#9090a8] text-lg max-w-2xl mx-auto">
          Tell us about your app. The more detail you provide, the better your blueprint.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">
                App Name <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder='e.g. "TaskFlow", "PetCare Pro"'
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/20 transition-all`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">
                What does your app do? <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                required
                maxLength={2000}
                rows={4}
                placeholder="Describe the problem your app solves, how it works, and what makes it unique..."
                value={form.appDescription}
                onChange={(e) => setForm({ ...form, appDescription: e.target.value })}
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 focus:ring-1 focus:ring-[#a855f7]/20 transition-all resize-none`}
              />
              <p className="text-xs text-[#606080] mt-1">{form.appDescription.length}/2000</p>
            </div>

            {/* Industry — full width */}
            <div>
              <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Industry</label>
              <input
                type="text"
                maxLength={100}
                placeholder="e.g. Healthcare, Fintech"
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 transition-all`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">
                Core Features <span className="text-[#606080] font-normal">(one per line)</span>
              </label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder={"User registration & login\nDashboard with analytics\nPayment processing\nReal-time notifications"}
                value={form.features}
                onChange={(e) => setForm({ ...form, features: e.target.value })}
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 transition-all resize-none`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Platform</label>
              <div className="flex gap-3">
                {["web", "mobile", "both"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setForm({ ...form, platform: p })}
                    className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      form.platform === p
                        ? `border-[#a855f7]/50 bg-[#a855f7]/10 text-white`
                        : `${COLORS.border} ${COLORS.card} text-[#9090a8] hover:text-white hover:border-[#a855f7]/30`
                    }`}
                  >
                    {p === "web" ? "🌐 Web" : p === "mobile" ? "📱 Mobile (PWA)" : "🔄 Both"}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#1e1e2e] pt-5">
              <p className="text-sm text-[#9090a8] mb-4">
                📬 Optional — leave your name and email if you want us to reach out with more details.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  maxLength={100}
                  placeholder="Your name"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 transition-all`}
                />
                <input
                  type="email"
                  maxLength={200}
                  placeholder="your@email.com"
                  value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 transition-all`}
                />
              </div>
            </div>

            {error && (
              <div className={`rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 px-4 py-3 text-sm text-[#ef4444]`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#a855f7]/20"
              style={{
                background: loading
                  ? "#1e1e2e"
                  : "linear-gradient(135deg, #a855f7, #c084fc)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating Blueprint...
                </span>
              ) : (
                "⚡ Generate Blueprint"
              )}
            </button>
          </form>
        </div>

        {/* Preview / Result */}
        <div className="lg:col-span-3" ref={resultRef}>
          {!result && !loading && <EmptyPreview />}
          {loading && <LoadingPreview form={form} />}
          {result && <BlueprintResultCard result={result} form={form} consultSent={consultSent} sendingConsult={sendingConsult} onConsultRequest={handleConsultRequest} />}
        </div>
      </div>
    </section>
  );
}

/* ─── Empty Preview ─── */

function EmptyPreview() {
  return (
    <div className={`rounded-2xl border ${COLORS.border} ${COLORS.card} p-8 sm:p-10 h-full flex flex-col items-center justify-center text-center min-h-[500px]`}>
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#a855f7]/20 to-[#ec4899]/20 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[#a855f7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">Your Blueprint Appears Here</h3>
      <p className="text-[#9090a8] max-w-md">
        Fill out the form and hit generate. You'll see a visual tech stack breakdown 
        tailored to your specific app idea.
      </p>
      <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-sm">
        {["Framework", "Database", "Hosting", "API Layer"].map((label) => (
          <div key={label} className={`rounded-xl border ${COLORS.border} px-4 py-3 text-sm text-[#606080] text-center`}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Loading Preview ─── */

function LoadingPreview({ form }: { form: any }) {
  return (
    <div className={`rounded-2xl border ${COLORS.border} ${COLORS.card} p-8 sm:p-10 min-h-[500px]`}>
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1e1e2e]" />
          <div>
            <div className="h-5 w-32 bg-[#1e1e2e] rounded-lg mb-1" />
            <div className="h-3 w-48 bg-[#1e1e2e] rounded-lg" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl bg-[#1e1e2e]" />
          ))}
        </div>
        <div className="flex justify-center">
          <div className="h-4 w-48 bg-[#1e1e2e] rounded-lg" />
        </div>
      </div>
      <p className="text-center text-[#9090a8] text-sm mt-8">
        Analyzing: <span className="text-[#d8b4fe]">{form.appName || "your app"}</span>
      </p>
    </div>
  );
}

/* ─── Blueprint Result ─── */

function BlueprintResultCard({ result, form, consultSent, sendingConsult, onConsultRequest }: { result: BlueprintResult; form: any; consultSent: boolean; sendingConsult: boolean; onConsultRequest: () => void }) {
  const { techStack, blueprintDocuments, featureMap } = result;

  return (
    <div className="space-y-6">
      {/* App Summary Card */}
      <div className={`rounded-2xl border overflow-hidden ${COLORS.border}`} style={{ background: "linear-gradient(135deg, #111118, #0d0d18)" }}>
        <div className="px-6 sm:px-8 py-6 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-lg">
              🧬
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{form.appName}</h3>
              <p className="text-xs text-[#d8b4fe]">Tech Stack Blueprint</p>
            </div>
          </div>
          <p className="text-sm text-[#c4c4d8] leading-relaxed">{techStack.summarySentence}</p>
        </div>

        {/* Stats Bar */}
        <div className="px-6 sm:px-8 py-4 border-b border-[#1e1e2e] bg-[#0a0a0f]/50">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-[#606080] mb-0.5">MVP Cost</p>
              <p className="text-lg font-bold text-[#10b981]">{techStack.mvpCost}</p>
            </div>
            <div>
              <p className="text-xs text-[#606080] mb-0.5">At Scale</p>
              <p className="text-lg font-bold text-[#f59e0b]">{techStack.scaleUpCost}</p>
            </div>
            <div>
              <p className="text-xs text-[#606080] mb-0.5">Time to MVP</p>
              <p className="text-lg font-bold text-[#a855f7]">{techStack.timeToMvp}</p>
            </div>
          </div>
        </div>

        {/* Feature-to-Tech Map */}
        {featureMap && featureMap.length > 0 ? (
          <FeatureTechMap featureMap={featureMap} />
        ) : (
          <div className="px-6 sm:px-8 py-5">
            <SimpleTechStack techStack={techStack} />
          </div>
        )}
      </div>

      {/* Blueprint Documents (Titles Only) */}
      <div className={`rounded-2xl border ${COLORS.border} ${COLORS.card} p-6 sm:p-8`}>
        <div className="flex items-center gap-2 mb-5">
          <span className="text-lg">📄</span>
          <h3 className="text-base font-semibold text-white">Complete Blueprint Documents</h3>
          <span className="ml-auto rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2.5 py-0.5 text-[10px] font-medium text-[#f59e0b]">
            Locked
          </span>
        </div>
        <div className="space-y-3">
          {blueprintDocuments.slice(0, 2).map((doc, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-[#10b981]/20 bg-[#10b981]/5 px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white">{doc.title}</h4>
                <p className="text-xs text-[#9090a8] mt-0.5">{doc.description}</p>
              </div>
            </div>
          ))}
          {blueprintDocuments.slice(2).map((doc, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f]/50 px-4 py-3 opacity-50">
              <div className="w-8 h-8 rounded-lg bg-[#1e1e2e] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#606080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-[#606080]">{doc.title}</h4>
                <p className="text-xs text-[#404060] mt-0.5">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={`mt-6 rounded-xl border border-[#a855f7]/20 bg-gradient-to-br from-[#a855f7]/10 to-[#ec4899]/5 p-5 sm:p-6 text-center`}>
          <h4 className="text-lg font-bold text-white mb-2">Ready to Build?</h4>
          <p className="text-sm text-[#d8b4fe] mb-4 max-w-md mx-auto">
            Get the full agent-ready blueprint. Our team can use it to build your MVP with AI — 
            or you can take it to your own development workflow.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {consultSent ? (
              <div className="rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 px-5 py-3 text-sm text-[#10b981] font-medium">
                ✅ Request sent! We will reach out within 1–2 business days.
              </div>
            ) : (
              <button
                onClick={onConsultRequest}
                disabled={sendingConsult}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #a855f7, #c084fc)" }}
              >
                {sendingConsult ? "Sending..." : "📧 Request a Consult"}
              </button>
            )}
            <span className="text-sm text-[#9090a8]">
              or{" "}
              <Link href="/portal/login" className="text-[#a855f7] hover:text-[#d8b4fe] underline underline-offset-2">
                Sign in to Client Portal
              </Link>
            </span>
          </div>
          <p className="text-xs text-[#606080] mt-3">
            Our team will reach out within 1-2 business days with full blueprint access.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature → Tech Map ─── */

const FEATURE_ACCENTS = [
  { color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "#a855f7" },
  { color: "#ec4899", bg: "rgba(236,72,153,0.08)", border: "#ec4899" },
  { color: "#10b981", bg: "rgba(16,185,129,0.08)", border: "#10b981" },
  { color: "#06b6d4", bg: "rgba(6,182,212,0.08)", border: "#06b6d4" },
  { color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "#f59e0b" },
  { color: "#f97316", bg: "rgba(249,115,22,0.08)", border: "#f97316" },
];

function FeatureTechMap({ featureMap }: { featureMap: FeatureMapEntry[] }) {
  const allTech = Array.from(new Set(featureMap.flatMap((f) => f.techNodes)));
  const techToFeatures: Record<string, number[]> = {};
  allTech.forEach((tech) => {
    techToFeatures[tech] = featureMap.map((f, i) => (f.techNodes.includes(tech) ? i : -1)).filter((i) => i >= 0);
  });

  return (
    <div className="px-4 sm:px-6 py-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="w-6 h-6 rounded-md bg-[#a855f7]/10 border border-[#a855f7]/20 flex items-center justify-center text-xs">🔗</span>
        <h4 className="text-sm font-semibold text-white">How Your Features Map to the Stack</h4>
      </div>

      {/* Feature rows — each feature gets a full card with embedded tech tags */}
      <div className="space-y-4 mb-6">
        {featureMap.map((entry, i) => {
          const accent = FEATURE_ACCENTS[i % FEATURE_ACCENTS.length];
          return (
            <div
              key={i}
              className="relative rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group"
              style={{ borderColor: `${accent.color}15`, background: `linear-gradient(135deg, ${accent.color}06, rgba(17,17,24,0.4))` }}
            >
              {/* Accent line on left */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl" style={{ background: accent.color }} />

              <div className="p-4 sm:p-5">
                {/* Feature header */}
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background: `${accent.color}18`, border: `1px solid ${accent.color}25` }}
                  >
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-bold text-white mb-0.5">{entry.feature}</h5>
                    <p className="text-xs text-[#9090a8] leading-relaxed">{entry.flow}</p>
                  </div>
                </div>

                {/* Tech chips for this feature */}
                <div className="flex flex-wrap gap-1.5 ml-12">
                  {entry.techNodes.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200"
                      style={{
                        background: `${accent.color}12`,
                        border: `1px solid ${accent.color}25`,
                        color: accent.color,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tech summary — all unique technologies at a glance */}
      <div className="rounded-2xl border border-[#1e1e2e]/40 bg-[#0a0a0f]/30 p-5">
        <p className="text-[10px] font-medium uppercase tracking-wider text-[#606080] mb-3">
          All Technologies — {allTech.length} total
        </p>
        <div className="flex flex-wrap gap-2">
          {allTech.map((tech) => {
            const featureCount = (techToFeatures[tech] || []).length;
            const primaryAccent = FEATURE_ACCENTS[
              ((techToFeatures[tech] || [])[0] || 0) % FEATURE_ACCENTS.length
            ];
            return (
              <div
                key={tech}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 cursor-default"
                style={{
                  background: `${primaryAccent.color}10`,
                  border: `1px solid ${primaryAccent.color}20`,
                  color: primaryAccent.color,
                }}
              >
                {tech}
                {featureCount > 1 && (
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold"
                    style={{ background: primaryAccent.color, color: "#0a0a0f" }}
                  >
                    {featureCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Simple Tech Stack (fallback) ─── */

function SimpleTechStack({ techStack }: { techStack: TechStack }) {
  const sections = Object.entries(techStack)
    .filter(([key]) => Array.isArray(techStack[key as keyof TechStack]))
    .map(([key, value]) => ({
      key, label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: SECTION_ICONS[key] || "📦", color: SECTION_COLORS[key] || COLORS.gold,
      items: value as TechLayer[],
    }));
  if (sections.length === 0) return null;
  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.key}>
          <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: section.color }}>
            {section.icon} {section.label}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {section.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f]/60 px-4 py-3">
                <p className="text-xs text-[#9090a8]">{item.layer}</p>
                <p className="text-sm font-semibold text-white">{item.tech}</p>
                <p className="text-xs text-[#606080] mt-0.5">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Footer ─── */

function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-[#9090a8]">
          <span className="text-[#a855f7] font-bold">FailFast</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#606080]">
          <Link href="/portal/login" className="hover:text-[#d8b4fe] transition-colors">
            Client Portal
          </Link>
          <a href="mailto:admin@failfast.online" className="hover:text-[#d8b4fe] transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
