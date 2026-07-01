"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TechStackView, BlueprintDocsList, FullBlueprintTabs } from "@/components/BlueprintViewer";

interface Blueprint {
  id: string;
  app_name: string;
  app_description: string;
  industry: string | null;
  status: string;
  tech_stack: any;
  full_blueprint: any;
  created_at: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/client/blueprints");
        if (res.status === 401) {
          router.push("/portal/login");
          return;
        }
        if (!res.ok) throw new Error("Failed to load blueprints");
        setBlueprints(await res.json());
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/portal/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-[#a855f7] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="border-b border-[#1e1e2e] bg-[#111118]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <div>
              <h1 className="text-lg font-bold text-white">My Blueprints</h1>
              <p className="text-xs text-[#9090a8]">Client Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-[#9090a8] hover:text-white transition-colors">
              Generator
            </Link>
            <button onClick={handleLogout} className="text-sm text-[#606080] hover:text-[#ef4444] transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {error && (
          <div className="rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/5 px-4 py-3 text-sm text-[#ef4444] mb-6">
            {error}
          </div>
        )}

        {blueprints.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-[#1e1e2e] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#606080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No Blueprints Assigned Yet</h2>
            <p className="text-[#9090a8] max-w-md mx-auto">
              Your blueprints will appear here once a Nirvatec team member assigns them to your account.
              This usually happens after your consult.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl text-white text-sm font-medium"
              style={{ background: "linear-gradient(135deg, #a855f7, #c084fc)" }}
            >
              Generate a Blueprint
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {blueprints.map((bp) => {
              const ts = bp.tech_stack?.techStack;
              const docs = bp.tech_stack?.blueprintDocuments;
              const fullBp = bp.full_blueprint;
              const isExpanded = expanded === bp.id;

              return (
                <div
                  key={bp.id}
                  className="rounded-2xl border border-[#1e1e2e] bg-[#111118] overflow-hidden"
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : bp.id)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#161622] transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-semibold text-white">{bp.app_name}</h3>
                        <StatusBadge status={bp.status} fullBlueprint={!!fullBp} />
                      </div>
                      <p className="text-sm text-[#9090a8] line-clamp-1">{bp.app_description}</p>
                      {ts && (
                        <div className="flex items-center gap-3 mt-2 text-xs text-[#606080]">
                          <span>💰 {ts.mvpCost}</span>
                          <span>⏱ {ts.timeToMvp}</span>
                          <span>🕐 {new Date(bp.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    <svg
                      className={`w-5 h-5 text-[#606080] transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && ts && (
                    <div className="border-t border-[#1e1e2e] px-6 py-6 space-y-6">
                      <TechStackView techStack={bp.tech_stack} />
                      {docs && <BlueprintDocsList docs={docs} hasFull={!!fullBp} />}
                      {fullBp && <FullBlueprintTabs blueprint={fullBp} />}

                      {/* Build CTA */}
                      {fullBp && (
                        <div className="rounded-xl border border-[#10b981]/20 bg-gradient-to-br from-[#10b981]/5 to-[#a855f7]/5 p-5 text-center">
                          <h4 className="text-base font-bold text-white mb-2">🚀 Ready to Build?</h4>
                          <p className="text-sm text-[#9090a8] mb-4 max-w-md mx-auto">
                            Our AI agent Katsu can take this blueprint and build the MVP.
                            The Nirvatec team will configure the Lighthouse server and deploy your app.
                          </p>
                          <a
                            href={`mailto:adv@nirvatec.com?subject=Build My MVP: ${encodeURIComponent(bp.app_name)}&body=I'd like to proceed with building the MVP for ${bp.app_name} (Blueprint ID: ${bp.id}). Please reach out to discuss timeline and pricing.`}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-200"
                            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
                          >
                            🔨 Request MVP Build
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status, fullBlueprint }: { status: string; fullBlueprint: boolean }) {
  if (status === "full" || fullBlueprint) {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#a855f7]/10 text-[#d8b4fe] border border-[#a855f7]/20">
        Complete
      </span>
    );
  }
  if (status === "assigned") {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20">
        Assigned
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20">
      Partial
    </span>
  );
}
