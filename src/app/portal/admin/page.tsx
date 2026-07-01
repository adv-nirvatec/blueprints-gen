"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TechStackView, BlueprintDocsList, FullBlueprintTabs } from "@/components/BlueprintViewer";

interface Blueprint {
  id: string;
  client_name: string | null;
  client_email: string | null;
  app_name: string;
  app_description: string;
  industry: string | null;
  status: string;
  assigned_to: string | null;
  created_at: string;
  tech_stack?: any;
  full_blueprint?: any;
  has_full_blueprint: boolean;
}

interface Client {
  id: string;
  email: string;
  display_name: string | null;
  company: string | null;
  created_at: string;
  last_login: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"blueprints" | "clients">("blueprints");
  const [assigning, setAssigning] = useState<string | null>(null);
  const [assignEmail, setAssignEmail] = useState("");
  const [newClient, setNewClient] = useState({ email: "", password: "", displayName: "", company: "" });
  const [creating, setCreating] = useState(false);
  const [createMsg, setCreateMsg] = useState("");
  const [sendingCreds, setSendingCreds] = useState<string | null>(null);
  const [credsMsg, setCredsMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [bpRes, clRes] = await Promise.all([
        fetch("/api/admin/blueprints"),
        fetch("/api/admin/clients"),
      ]);
      if (bpRes.status === 403) { router.push("/portal/login"); return; }
      setBlueprints(await bpRes.json());
      setClients(await clRes.json());
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAssign = async (blueprintId: string) => {
    if (!assignEmail) return;
    try {
      const res = await fetch("/api/admin/blueprints", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId, clientEmail: assignEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAssigning(null);
      setAssignEmail("");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSendCredentials = async (blueprintId: string) => {
    setSendingCreds(blueprintId);
    setCredsMsg(null);
    try {
      const res = await fetch("/api/admin/send-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCredsMsg({ id: blueprintId, text: `✅ Email sent to ${data.clientEmail}`, ok: true });
      fetchData();
    } catch (err: any) {
      setCredsMsg({ id: blueprintId, text: `❌ ${err.message}`, ok: false });
    } finally {
      setSendingCreds(null);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateMsg("");
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCreateMsg("Client created successfully!");
      setNewClient({ email: "", password: "", displayName: "", company: "" });
      fetchData();
    } catch (err: any) {
      setCreateMsg(err.message);
    } finally {
      setCreating(false);
    }
  };

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
      <header className="border-b border-[#1e1e2e] bg-[#111118]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧬</span>
            <div>
              <h1 className="text-lg font-bold text-white">Blueprint Admin</h1>
              <p className="text-xs text-[#9090a8]">Super Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/portal/client" className="text-sm text-[#9090a8] hover:text-white transition-colors">Client View</Link>
            <Link href="/" className="text-sm text-[#9090a8] hover:text-white transition-colors">Generator</Link>
            <button onClick={handleLogout} className="text-sm text-[#606080] hover:text-[#ef4444] transition-colors">Sign Out</button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-1 mb-8 rounded-xl bg-[#111118] border border-[#1e1e2e] p-1 w-fit">
          <button onClick={() => setTab("blueprints")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "blueprints" ? "bg-[#a855f7] text-white" : "text-[#9090a8] hover:text-white"}`}>
            📋 Blueprints ({blueprints.length})
          </button>
          <button onClick={() => setTab("clients")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === "clients" ? "bg-[#a855f7] text-white" : "text-[#9090a8] hover:text-white"}`}>
            👥 Clients ({clients.length})
          </button>
        </div>

        {tab === "blueprints" && (
          <div>
            {blueprints.length === 0 ? (
              <div className="text-center py-16 text-[#9090a8]">
                <p className="text-lg">No blueprints yet</p>
                <p className="text-sm mt-1">Generated blueprints will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {blueprints.map((bp) => {
                  const isExpanded = expanded === bp.id;
                  const ts = bp.tech_stack;
                  const fullBp = bp.full_blueprint;
                  const docs = ts?.blueprintDocuments;

                  return (
                    <div key={bp.id} className="rounded-xl border border-[#1e1e2e] bg-[#111118] overflow-hidden">
                      {/* Summary Row */}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : bp.id)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#161622] transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-base font-semibold text-white">{bp.app_name}</h3>
                            <StatusBadge bp={bp} />
                          </div>
                          <p className="text-sm text-[#9090a8] line-clamp-1">{bp.app_description}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-[#606080] flex-wrap">
                            {bp.industry && <span>🏭 {bp.industry}</span>}
                            {bp.client_email && <span>📧 {bp.client_email}</span>}
                            {bp.client_name && <span>👤 {bp.client_name}</span>}
                            <span>🕐 {new Date(bp.created_at).toLocaleDateString()}</span>
                            {bp.assigned_to && <span className="text-[#10b981]">✓ Assigned</span>}
                          </div>
                        </div>
                        <svg className={`w-5 h-5 text-[#606080] transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="border-t border-[#1e1e2e] px-6 py-5 space-y-6">
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {bp.client_email && (
                              sendingCreds === bp.id ? (
                                <span className="px-3 py-1.5 rounded-lg bg-[#f59e0b]/10 text-[#f59e0b] text-xs flex items-center gap-1">
                                  <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                  </svg>
                                  Sending...
                                </span>
                              ) : (
                                <button onClick={() => handleSendCredentials(bp.id)}
                                  className="px-3 py-1.5 rounded-lg bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-medium hover:bg-[#10b981]/20 transition-all">
                                  📧 Send Login
                                </button>
                              )
                            )}
                            <button onClick={() => setAssigning(bp.id)}
                              className="px-3 py-1.5 rounded-lg border border-[#a855f7]/30 text-[#d8b4fe] text-xs font-medium hover:bg-[#a855f7]/10 transition-all">
                              {bp.assigned_to ? "Reassign" : "Assign to Client"}
                            </button>
                          </div>

                          {credsMsg?.id === bp.id && (
                            <div className={`rounded-lg px-3 py-2 text-xs ${credsMsg.ok ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#ef4444]/10 text-[#ef4444]"}`}>
                              {credsMsg.text}
                            </div>
                          )}

                          {assigning === bp.id && (
                            <div className="flex items-center gap-2">
                              <select value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)}
                                className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-1.5 text-xs text-white flex-1 max-w-xs">
                                <option value="">Select client...</option>
                                {clients.filter(c => c.email !== "admin@failfast.online").map((c) => (
                                  <option key={c.id} value={c.email}>{c.email} {c.display_name ? `(${c.display_name})` : ""}</option>
                                ))}
                              </select>
                              <button onClick={() => handleAssign(bp.id)} className="px-3 py-1.5 rounded-lg bg-[#10b981] text-white text-xs font-medium">Assign</button>
                              <button onClick={() => setAssigning(null)} className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-[#9090a8] text-xs">Cancel</button>
                            </div>
                          )}

                          {/* Tech Stack */}
                          {ts && <TechStackView techStack={ts} />}

                          {/* Blueprint Documents */}
                          {docs && <BlueprintDocsList docs={docs} hasFull={!!fullBp} />}

                          {/* Full Blueprint Tabs */}
                          {fullBp && <FullBlueprintTabs blueprint={fullBp} />}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "clients" && (
          <div className="space-y-8">
            <div className="rounded-xl border border-[#1e1e2e] bg-[#111118] p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Create New Client</h3>
              <form onSubmit={handleCreateClient} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#9090a8] mb-1">Email *</label>
                    <input type="email" required value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50"
                      placeholder="client@company.com" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9090a8] mb-1">Password *</label>
                    <input type="password" required value={newClient.password} onChange={(e) => setNewClient({ ...newClient, password: e.target.value })}
                      className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50"
                      placeholder="••••••••" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9090a8] mb-1">Display Name</label>
                    <input type="text" value={newClient.displayName} onChange={(e) => setNewClient({ ...newClient, displayName: e.target.value })}
                      className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs text-[#9090a8] mb-1">Company</label>
                    <input type="text" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                      className="w-full rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 text-sm text-white placeholder:text-[#606080] focus:outline-none focus:border-[#a855f7]/50"
                      placeholder="Acme Corp" />
                  </div>
                </div>
                {createMsg && <p className={`text-sm ${createMsg.includes("success") ? "text-[#10b981]" : "text-[#ef4444]"}`}>{createMsg}</p>}
                <button type="submit" disabled={creating} className="px-5 py-2 rounded-lg text-white text-sm font-medium transition-all" style={{ background: "linear-gradient(135deg, #a855f7, #c084fc)" }}>
                  {creating ? "Creating..." : "Create Client"}
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Existing Clients</h3>
              {clients.length === 0 ? (
                <p className="text-sm text-[#9090a8]">No clients yet.</p>
              ) : (
                <div className="grid gap-2">
                  {clients.map((c) => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-[#1e1e2e] bg-[#111118] px-4 py-3">
                      <div>
                        <p className="text-sm text-white font-medium">
                          {c.display_name || c.email}
                          {c.email === "admin@failfast.online" && (
                            <span className="ml-2 text-[10px] bg-[#a855f7]/20 text-[#d8b4fe] px-1.5 py-0.5 rounded">Admin</span>
                          )}
                        </p>
                        <p className="text-xs text-[#606080]">{c.email} {c.company ? `· ${c.company}` : ""}</p>
                      </div>
                      <div className="text-xs text-[#606080]">
                        {c.last_login ? `Last login: ${new Date(c.last_login).toLocaleDateString()}` : "Never logged in"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ bp }: { bp: Blueprint }) {
  if (bp.has_full_blueprint || bp.status === "full") {
    return (
      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-[#a855f7]/10 text-[#d8b4fe] border border-[#a855f7]/20">
        Complete
      </span>
    );
  }
  if (bp.status === "assigned") {
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
