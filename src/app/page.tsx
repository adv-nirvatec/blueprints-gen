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
  accent: "#6C63FF",
  accentHover: "#7b73ff",
  accentBg: "bg-[#6C63FF]/10",
  accentBorder: "border-[#6C63FF]/30",
  accentText: "text-[#6C63FF]",
  gold: "#f59e0b",
  goldBg: "bg-[#f59e0b]/10",
  green: "#10b981",
  greenBg: "bg-[#10b981]/10",
  greenText: "text-[#10b981]",
  red: "#ef4444",
  redBg: "bg-[#ef4444]/10",
  purple: "#8b5cf6",
  purpleBg: "bg-[#8b5cf6]/10",
  cyan: "#06b6d4",
  cyanBg: "bg-[#06b6d4]/10",
  orange: "#f97316",
  orangeBg: "bg-[#f97316]/10",
};

const SECTION_COLORS: Record<string, string> = {
  frontend: COLORS.purple,
  backend: COLORS.cyan,
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
      {/* Gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/5 via-transparent to-[#06b6d4]/5" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-[#6C63FF]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#06b6d4]/10 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 py-20 sm:py-28 lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6C63FF]/20 bg-[#6C63FF]/5 text-sm text-[#a5a0ff] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#6C63FF] animate-pulse" />
            Powered by AI
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            <span className="text-white">Your App Idea,</span>
            <br />
            <span className="bg-gradient-to-r from-[#6C63FF] to-[#06b6d4] bg-clip-text text-transparent">
              Blueprinted in Minutes
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-[#9090a8] leading-relaxed max-w-2xl">
            Describe your app. Our AI solution architect generates a detailed tech stack, 
            architecture plan, and build roadmap — so you can go from idea to MVP with clarity.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <a
              href="#generate"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200"
              style={{ background: "linear-gradient(135deg, #6C63FF, #7b73ff)" }}
            >
              Generate My Blueprint
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <Link
              href="/portal/login"
              className="px-6 py-3 rounded-xl border border-[#1e1e2e] text-[#9090a8] hover:text-white hover:border-[#6C63FF]/30 transition-all duration-200 font-medium"
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
    { num: "01", title: "Describe Your App", desc: "Tell us what it does, who it's for, and what features you need. Plain English — no tech jargon required.", icon: "✍️" },
    { num: "02", title: "AI Generates Blueprint", desc: "Our solution architect AI picks the right tech stack for your specific needs. MVP first, scale later.", icon: "🧠" },
    { num: "03", title: "Get Clarity", desc: "See exactly what to build, how much it costs, and how long it takes. Enough detail to start development.", icon: "📋" },
    { num: "04", title: "Talk to Us", desc: "Want the full blueprint docs + expert guidance? Book a consult. We'll help you build it right.", icon: "🤝" },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">How It Works</h2>
        <p className="text-[#9090a8] text-lg">Four steps from idea to build-ready plan.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => (
          <div key={step.num} className="relative group">
            <div className={`rounded-2xl border ${COLORS.border} ${COLORS.card} p-6 h-full transition-all duration-300 ${COLORS.cardHover}`}>
              <div className="text-3xl mb-4">{step.icon}</div>
              <div className="text-xs font-bold text-[#6C63FF] mb-2">{step.num}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-[#9090a8] leading-relaxed">{step.desc}</p>
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
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/20 transition-all`}
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
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 focus:ring-1 focus:ring-[#6C63FF]/20 transition-all resize-none`}
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
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all`}
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
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all`}
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
                className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all resize-none`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#e4e4ec] mb-1.5">Budget</label>
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white bg-[#111118] focus:outline-none focus:border-[#6C63FF]/50 transition-all appearance-none`}
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
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white bg-[#111118] focus:outline-none focus:border-[#6C63FF]/50 transition-all appearance-none`}
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
                        ? `border-[#6C63FF]/50 bg-[#6C63FF]/10 text-white`
                        : `${COLORS.border} ${COLORS.card} text-[#9090a8] hover:text-white hover:border-[#6C63FF]/30`
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
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all`}
                />
                <input
                  type="email"
                  maxLength={200}
                  placeholder="your@email.com"
                  value={form.clientEmail}
                  onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                  className={`w-full rounded-xl border ${COLORS.border} ${COLORS.card} px-4 py-3 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#6C63FF]/50 transition-all`}
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
              className="w-full py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#6C63FF]/20"
              style={{
                background: loading
                  ? "#1e1e2e"
                  : "linear-gradient(135deg, #6C63FF, #7b73ff)",
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
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6C63FF]/20 to-[#06b6d4]/20 flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-[#6C63FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        Analyzing: <span className="text-[#a5a0ff]">{form.appName || "your app"}</span>
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#06b6d4] flex items-center justify-center text-lg">
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
              <p className="text-lg font-bold text-[#6C63FF]">{techStack.timeToMvp}</p>
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
        <div className={`mt-6 rounded-xl border border-[#6C63FF]/20 bg-gradient-to-br from-[#6C63FF]/10 to-[#06b6d4]/5 p-5 sm:p-6 text-center`}>
          <h4 className="text-lg font-bold text-white mb-2">Want the Full Blueprint?</h4>
          <p className="text-sm text-[#a5a0ff] mb-4 max-w-md mx-auto">
            Get complete architecture docs, database schema, API design, build phases, and expert guidance 
            from the FailFast team.
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
                style={{ background: "linear-gradient(135deg, #6C63FF, #7b73ff)" }}
              >
                {sendingConsult ? "Sending..." : "📧 Request a Consult"}
              </button>
            )}
            <span className="text-sm text-[#9090a8]">
              or{" "}
              <Link href="/portal/login" className="text-[#6C63FF] hover:text-[#a5a0ff] underline underline-offset-2">
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
          <span className="text-[#6C63FF] font-bold">FailFast</span>
          <span>Blueprints</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#606080]">
          <Link href="/portal/login" className="hover:text-[#a5a0ff] transition-colors">
            Client Portal
          </Link>
          <a href="mailto:admin@failfast.online" className="hover:text-[#a5a0ff] transition-colors">
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

  const NODE_W = 155;
  const NODE_H = 58;
  const GAP_X = 16;
  const GAP_Y = 16;
  const PAD = 12;
  const LABEL_X = 50;

  // Calculate SVG dimensions
  const maxItems = Math.max(...sections.map(s => s.items.length));
  const svgW = Math.max(600, maxItems * NODE_W + (maxItems - 1) * GAP_X + PAD * 2 + LABEL_X);
  const svgH = sections.length * NODE_H + (sections.length - 1) * GAP_Y + PAD * 2;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: 500 }}>
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

        {sections.map((section, row) => {
          const y = PAD + row * (NODE_H + GAP_Y);
          const isCylinder = section.key === "database";
          const isCloud = section.key === "infrastructure" || section.key === "integrations";

          return (
            <g key={section.key}>
              {/* Section label */}
              <text x={PAD} y={y + NODE_H / 2 + 1} fontSize="11" fontWeight="600" fill={section.color} fontFamily="system-ui, sans-serif" textAnchor="start" dominantBaseline="middle">
                {section.label}
              </text>

              {/* Connecting line from label to first node */}
              <line x1={LABEL_X - 12} y1={y + NODE_H / 2} x2={LABEL_X + 4} y2={y + NODE_H / 2} stroke={`${section.color}30`} strokeWidth="1.5" />

              {/* Tech items */}
              {section.items.map((item, col) => {
                const x = LABEL_X + 8 + col * (NODE_W + GAP_X);
                const rx = isCylinder ? 8 : isCloud ? NODE_H / 2 : 10;

                return (
                  <g key={`${section.key}-${col}`} filter="url(#ts-shadow)">
                    {/* Node body */}
                    {isCylinder ? (
                      <>
                        <ellipse cx={x + NODE_W / 2} cy={y + 6} rx={NODE_W / 2} ry={6} fill={`${section.color}12`} stroke={section.color} strokeWidth="1" strokeOpacity="0.3" />
                        <rect x={x} y={y + 6} width={NODE_W} height={NODE_H - 12} fill={`url(#tsgrad-${section.key})`} stroke={section.color} strokeWidth="1" strokeOpacity="0.3" />
                        <ellipse cx={x + NODE_W / 2} cy={y + NODE_H - 6} rx={NODE_W / 2} ry={6} fill={`${section.color}0A`} stroke={section.color} strokeWidth="1" strokeOpacity="0.3" />
                      </>
                    ) : (
                      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={rx} fill={`url(#tsgrad-${section.key})`} stroke={section.color} strokeWidth="1" strokeOpacity="0.3" />
                    )}

                    {/* Layer label */}
                    <text x={x + 10} y={y + 18} fontSize="9" fill="#606080" fontFamily="system-ui, sans-serif">
                      {item.layer.length > 20 ? item.layer.slice(0, 18) + "…" : item.layer}
                    </text>

                    {/* Tech name */}
                    <text x={x + 10} y={y + 34} fontSize="12" fontWeight="600" fill="#e4e4ec" fontFamily="system-ui, sans-serif">
                      {item.tech.length > 22 ? item.tech.slice(0, 20) + "…" : item.tech}
                    </text>

                    {/* Reason tooltip-ish sublabel */}
                    <text x={x + 10} y={y + 48} fontSize="9" fill="#505060" fontFamily="system-ui, sans-serif">
                      {item.reason.length > 26 ? item.reason.slice(0, 24) + "…" : item.reason}
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
