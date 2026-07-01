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
      <Hero />
      <HowItWorks />
      <GeneratorSection />
      <Footer />
    </div>
  );
}

/* ─── Hero ─── */

function Hero() {
  return (
    <header className="relative overflow-hidden border-b border-[#1e1e2e]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#a855f7]/5 via-transparent to-[#ec4899]/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#ec4899]/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#10b981]/20 bg-[#10b981]/5 text-sm text-[#10b981] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            Validate before you build
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-white">Fail fast</span>
            <br />
            <span className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">
              before you build slow.
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#9090a8] leading-relaxed max-w-2xl">
            Turn your app idea into a practical MVP blueprint, usable by agentic AI to build a lean, 
            testable version fast. FailFast helps you validate product-market fit before spending weeks 
            overbuilding something the market may not want.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a
              href="#generate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#a855f7]/20"
              style={{ background: "linear-gradient(135deg, #a855f7, #c084fc)" }}
            >
              Create My MVP Blueprint
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <Link
              href="/portal/login"
              className="px-6 py-3 rounded-xl border border-[#1e1e2e] text-[#9090a8] hover:text-white hover:border-[#a855f7]/30 transition-all duration-200 font-medium"
            >
              Client Portal →
            </Link>
          </div>
        </div>
      </div>
    </header>
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
      desc: "Describe your idea, audience, core features, budget, timeline, and platform. FailFast generates:",
      outputs: ["MVP scope", "Tech stack", "Core modules", "Database plan", "User flows", "Build sequence", "Scale-up notes"],
    },
    {
      num: "02",
      title: "Build with Agentic AI",
      icon: "🤖",
      color: "#f59e0b",
      desc: "Your blueprint becomes an agent-ready implementation brief. AI can generate the core pieces — or our team builds it for you.",
      outputs: ["Frontend", "Backend", "Database schema", "Auth flow", "Admin panel", "Deployment path", "Product screens"],
    },
    {
      num: "03",
      title: "Test Product-Market Fit",
      icon: "🎯",
      color: "#10b981",
      desc: "Use the MVP to test real demand before investing more. Validate what matters:",
      outputs: ["Do users understand it?", "Do they sign up?", "Do they complete the core action?", "Do they return?", "Do they pay?", "Which features matter?"],
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h2>
        <p className="text-[#9090a8] text-lg">Three steps from idea to validated product.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((step) => (
          <div key={step.num} className="relative group">
            <div
              className={`rounded-2xl border ${COLORS.border} ${COLORS.card} p-6 h-full transition-all duration-300 ${COLORS.cardHover}`}
              style={{ borderTopColor: step.color, borderTopWidth: 3 }}
            >
              <div className="text-3xl mb-4">{step.icon}</div>
              <div className="text-xs font-bold mb-2" style={{ color: step.color }}>{step.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-[#9090a8] leading-relaxed mb-4">{step.desc}</p>
              <div className="border-t border-[#1e1e2e] pt-4">
                <ul className="space-y-1.5">
                  {step.outputs.map((item) => (
                    <li key={item} className="text-xs text-[#606080] flex items-start gap-2">
                      <span className="mt-0.5 shrink-0" style={{ color: step.color }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
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
    targetUsers: "",
    features: "",
    budget: "",
    timeline: "",
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
          targetUsers: form.targetUsers || undefined,
          coreFeatures: features.length > 0 ? features : undefined,
          constraints: {
            budget: form.budget || undefined,
            timeline: form.timeline || undefined,
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

            <div className="grid grid-cols-2 gap-4">
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
                <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Target Users</label>
                <input
                  type="text"
                  maxLength={500}
                  placeholder="e.g. Small business owners"
                  value={form.targetUsers}
                  onChange={(e) => setForm({ ...form, targetUsers: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50 transition-all`}
                />
              </div>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Budget</label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white bg-[#111118] focus:outline-none focus:border-[#a855f7]/50 transition-all appearance-none`}
                >
                  <option value="">Select budget range</option>
                  <option value="Bootstrap (<$5k)">Bootstrap (&lt;$5k)</option>
                  <option value="Seed ($5k-$25k)">Seed ($5k-$25k)</option>
                  <option value="Funded ($25k-$100k)">Funded ($25k-$100k)</option>
                  <option value="Enterprise ($100k+)">Enterprise ($100k+)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Timeline</label>
                <select
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white bg-[#111118] focus:outline-none focus:border-[#a855f7]/50 transition-all appearance-none`}
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP (2-4 weeks)">ASAP (2-4 weeks)</option>
                  <option value="1-2 months">1-2 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
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
                    {p === "web" ? "🌐 Web" : p === "mobile" ? "📱 Mobile" : "🔄 Both"}
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
  const { techStack, blueprintDocuments } = result;
  const sections = Object.entries(techStack)
    .filter(([key]) => Array.isArray(techStack[key as keyof TechStack]))
    .map(([key, value]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      icon: SECTION_ICONS[key] || "📦",
      color: SECTION_COLORS[key] || COLORS.gold,
      items: value as TechLayer[],
    }));

  return (
    <div className="space-y-6">
      {/* Tech Stack Card */}
      <div className={`rounded-2xl border overflow-hidden ${COLORS.border}`} style={{ background: "linear-gradient(135deg, #111118, #0d0d18)" }}>
        {/* Header */}
        <div className="px-6 sm:px-8 py-6 border-b border-[#1e1e2e]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#a855f7] to-[#ec4899] flex items-center justify-center text-lg">
              🧬
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{form.appName}</h3>
              <p className="text-xs text-[#9090a8]">Tech Stack Blueprint</p>
            </div>
          </div>
          <p className="text-sm text-[#c4c4d8] leading-relaxed">{techStack.summarySentence}</p>
        </div>

        {/* SVG Tech Stack Diagram */}
        <div className="px-4 sm:px-6 py-5">
          <TechStackSvg sections={sections} />
        </div>

        {/* Stats Bar */}
        <div className="px-6 sm:px-8 py-5 border-t border-[#1e1e2e] bg-[#0a0a0f]/50">
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
          {blueprintDocuments.map((doc, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 rounded-xl border ${COLORS.border} bg-[#0a0a0f]/50 px-4 py-3`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#1e1e2e] flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-[#606080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-white">{doc.title}</h4>
                <p className="text-xs text-[#606080] mt-0.5">{doc.description}</p>
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

/* ─── SVG Tech Stack Diagram ─── */

function TechStackSvg({ sections }: { sections: { key: string; label: string; icon: string; color: string; items: { layer: string; tech: string; reason: string }[] }[] }) {
  if (sections.length === 0) return null;

  const NODE_W = 180;
  const NODE_H = 64;
  const GAP_X = 14;
  const GAP_Y = 32;
  const PAD = 14;
  const LABEL_W = 82;
  const LABEL_X = LABEL_W;

  // Calculate SVG dimensions
  const maxItems = Math.max(...sections.map(s => s.items.length));
  const svgW = Math.max(640, maxItems * NODE_W + (maxItems - 1) * GAP_X + PAD * 2 + LABEL_W);
  const svgH = sections.length * NODE_H + (sections.length - 1) * GAP_Y + PAD * 2;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 520 }}>
        <defs>
          {sections.map(s => (
            <linearGradient key={`g-${s.key}`} id={`tsgrad-${s.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.06" />
            </linearGradient>
          ))}
          <filter id="ts-shadow">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Vertical guide lines for each section */}
        {sections.map((section, row) => {
          const labelCy = PAD + row * (NODE_H + GAP_Y) + NODE_H / 2;
          return (
            <line key={`guide-${row}`} x1={PAD} y1={labelCy + 8} x2={svgW - PAD} y2={labelCy + 8}
              stroke={`${section.color}08`} strokeWidth="1" />
          );
        })}

        {sections.map((section, row) => {
          const y = PAD + row * (NODE_H + GAP_Y);
          const isCylinder = section.key === "database";
          const isCloud = section.key === "infrastructure" || section.key === "integrations";
          const labelCy = y + NODE_H / 2;

          return (
            <g key={section.key}>
              {/* Section label with background pill for readability */}
              <rect x={PAD - 2} y={labelCy - 12} width={LABEL_W - 8} height={24} rx={8} fill={`${section.color}0A`} />
              <text x={PAD + LABEL_W / 2 - 6} y={labelCy + 1} fontSize="10" fontWeight="700" fill={section.color}
                fontFamily="system-ui, sans-serif" textAnchor="middle" dominantBaseline="middle" letterSpacing="0.05em">
                {section.label.toUpperCase()}
              </text>

              {/* Tech items */}
              {section.items.map((item, col) => {
                const x = LABEL_X + col * (NODE_W + GAP_X);
                const rx = isCloud ? NODE_H / 2 : 10;

                return (
                  <g key={`${section.key}-${col}`} filter="url(#ts-shadow)">
                    {/* Node body */}
                    {isCylinder ? (
                      <>
                        <ellipse cx={x + NODE_W / 2} cy={y + 8} rx={NODE_W / 2} ry={8} fill={`${section.color}14`} stroke={section.color} strokeWidth="1" strokeOpacity="0.35" />
                        <rect x={x} y={y + 8} width={NODE_W} height={NODE_H - 16} fill={`url(#tsgrad-${section.key})`} stroke={section.color} strokeWidth="1" strokeOpacity="0.35" />
                        <path d={`M ${x} ${y + 8} A ${NODE_W / 2} 8 0 0 0 ${x + NODE_W} ${y + 8}`} fill="none" stroke={section.color} strokeWidth="0.5" strokeOpacity="0.2" />
                        <ellipse cx={x + NODE_W / 2} cy={y + NODE_H - 8} rx={NODE_W / 2} ry={8} fill={`${section.color}0C`} stroke={section.color} strokeWidth="1" strokeOpacity="0.35" />
                        <path d={`M ${x} ${y + NODE_H - 8} A ${NODE_W / 2} 8 0 0 0 ${x + NODE_W} ${y + NODE_H - 8}`} fill="none" stroke={section.color} strokeWidth="0.5" strokeOpacity="0.2" />
                      </>
                    ) : (
                      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={rx} fill={`url(#tsgrad-${section.key})`} stroke={section.color} strokeWidth="1.2" strokeOpacity="0.35" />
                    )}

                    {/* Layer label */}
                    <text x={x + 12} y={y + 18} fontSize="8.5" fill="#606080" fontFamily="system-ui, sans-serif" fontWeight="500">
                      {item.layer.length > 24 ? item.layer.slice(0, 22) + "…" : item.layer}
                    </text>

                    {/* Tech name */}
                    <text x={x + 12} y={y + 35} fontSize="11.5" fontWeight="700" fill="#e4e4ec" fontFamily="system-ui, sans-serif">
                      {item.tech.length > 26 ? item.tech.slice(0, 24) + "…" : item.tech}
                    </text>

                    {/* Reason tooltip-ish sublabel */}
                    <text x={x + 12} y={y + 52} fontSize="8.5" fill="#505060" fontFamily="system-ui, sans-serif">
                      {item.reason.length > 32 ? item.reason.slice(0, 30) + "…" : item.reason}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
