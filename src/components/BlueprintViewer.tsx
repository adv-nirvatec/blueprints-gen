"use client";

import { useState } from "react";

const SECTION_META: Record<string, { color: string; icon: string }> = {
  frontend: { color: "#8b5cf6", icon: "🎨" },
  backend: { color: "#06b6d4", icon: "⚙️" },
  database: { color: "#f97316", icon: "🗄️" },
  infrastructure: { color: "#f59e0b", icon: "☁️" },
  integrations: { color: "#10b981", icon: "🔌" },
};

export function TechStackView({ techStack }: { techStack: any }) {
  if (!techStack) return null;
  const ts = techStack.techStack;
  if (!ts) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[#c4c4d8] leading-relaxed">{ts.summarySentence}</p>
      {(["frontend", "backend", "database", "infrastructure", "integrations"] as const).map((section) => {
        const items = ts[section];
        if (!items || items.length === 0) return null;
        const meta = SECTION_META[section] || { color: "#9090a8", icon: "📦" };
        return (
          <div key={section}>
            <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: meta.color }}>
              {meta.icon} {section}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.map((item: any, i: number) => (
                <div key={i} className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f]/60 px-4 py-3">
                  <p className="text-xs text-[#9090a8]">{item.layer}</p>
                  <p className="text-sm font-semibold text-white">{item.tech}</p>
                  <p className="text-xs text-[#606080] mt-0.5">{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="grid grid-cols-3 gap-4 rounded-xl bg-[#0a0a0f]/50 border border-[#1e1e2e] p-4">
        <div className="text-center">
          <p className="text-xs text-[#606080]">MVP Cost</p>
          <p className="text-lg font-bold text-[#10b981]">{ts.mvpCost || "N/A"}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#606080]">At Scale</p>
          <p className="text-lg font-bold text-[#f59e0b]">{ts.scaleUpCost || "N/A"}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#606080]">Time to MVP</p>
          <p className="text-lg font-bold text-[#6C63FF]">{ts.timeToMvp || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export function BlueprintDocsList({ docs, hasFull }: { docs: any[]; hasFull: boolean }) {
  if (!docs || docs.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📄</span>
        <h4 className="text-sm font-semibold text-white">Blueprint Documents</h4>
        <StatusBadge hasFull={hasFull} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {docs.map((doc: any, i: number) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f]/60 px-4 py-3">
            <div className="w-7 h-7 rounded-md bg-[#1e1e2e] flex items-center justify-center shrink-0 mt-0.5">
              {hasFull ? (
                <svg className="w-3.5 h-3.5 text-[#10b981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5 text-[#606080]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white">{doc.title}</p>
              <p className="text-[10px] text-[#606080] mt-0.5">{doc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ hasFull }: { hasFull: boolean }) {
  if (hasFull) {
    return (
      <span className="ml-auto rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-2 py-0.5 text-[10px] font-medium text-[#10b981]">
        Complete
      </span>
    );
  }
  return (
    <span className="ml-auto rounded-full border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-2 py-0.5 text-[10px] font-medium text-[#f59e0b]">
      Pending
    </span>
  );
}

export function FullBlueprintTabs({ blueprint }: { blueprint: any }) {
  const [tab, setTab] = useState<string>("architecture");

  const tabs = [
    { key: "architecture", label: "🏗️ Architecture", content: blueprint.architecture },
    { key: "schema", label: "🗄️ Database", content: blueprint.databaseSchema },
    { key: "api", label: "🔌 API", content: blueprint.apiDesign },
    { key: "phases", label: "📋 Build", content: blueprint.mvpPhases },
    { key: "scale", label: "📈 Scale", content: blueprint.scaleUpPhases },
    { key: "costs", label: "💰 Costs", content: blueprint.costBreakdown },
    { key: "security", label: "🔐 Security", content: blueprint.securityCompliance },
    { key: "gtm", label: "🚀 GTM", content: blueprint.goToMarket },
  ].filter((t) => t.content);

  if (tabs.length === 0) return null;

  const active = tabs.find((t) => t.key === tab) || tabs[0];

  return (
    <div className="rounded-xl border border-[#6C63FF]/20 overflow-hidden">
      <div className="flex overflow-x-auto border-b border-[#1e1e2e] bg-[#0a0a0f]/50">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 px-3 sm:px-4 py-2.5 text-xs font-medium transition-all whitespace-nowrap ${
              tab === t.key
                ? "text-[#a5a0ff] border-b-2 border-[#6C63FF] bg-[#6C63FF]/5"
                : "text-[#606080] hover:text-[#9090a8]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="p-5 max-h-[500px] overflow-y-auto">
        {active.key === "architecture" && <ArchitectureTab content={active.content} />}
        {active.key === "schema" && <SchemaTab content={active.content} />}
        {active.key === "api" && <ApiTab content={active.content} />}
        {active.key === "phases" && <PhasesTab content={active.content} />}
        {active.key === "scale" && <ScaleTab content={active.content} />}
        {active.key === "costs" && <CostsTab content={active.content} />}
        {active.key === "security" && <SecurityTab content={active.content} />}
        {active.key === "gtm" && <GtmTab content={active.content} />}
      </div>
    </div>
  );
}

/* ─── Architecture Tab ─── */

function ArchitectureTab({ content }: { content: any }) {
  const overview = content.overview || "";
  const diagram = content.diagram || "";

  const paragraphs = overview.split("\n").filter(Boolean);
  const mainText = paragraphs.filter((p: string) => !p.match(/^[┌└│├─┐┘┴┬┤┼]/));

  return (
    <div className="space-y-5">
      <div className="text-sm text-[#c4c4d8] leading-relaxed">
        {mainText.slice(0, 2).map((line: string, i: number) => (
          <p key={i} className="mb-2">{line}</p>
        ))}
      </div>

      <ArchitectureSvg overview={overview} diagram={diagram} />

      {mainText.length > 2 && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#0a0a0f]/60 p-4">
          <h4 className="text-xs font-semibold text-[#9090a8] mb-3 uppercase tracking-wider">Details</h4>
          <div className="text-xs text-[#9090a8] leading-relaxed space-y-2">
            {mainText.slice(2).map((line: string, i: number) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      )}

      {diagram && (
        <details className="mt-2">
          <summary className="text-[10px] text-[#606080] cursor-pointer hover:text-[#9090a8]">View raw diagram</summary>
          <pre className="mt-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] p-4 text-[10px] font-mono text-[#10b981] overflow-x-auto leading-tight">
            {diagram}
          </pre>
        </details>
      )}
    </div>
  );
}

/* ─── Architecture Layer Parser + Visual Diagram ─── */

/* ─── Architecture Component Parser ─── */

interface ArchNode {
  id: string;
  label: string;
  sublabel: string;
  type: "entry" | "proxy" | "app" | "database" | "service" | "external" | "infra" | "auth" | "queue" | "storage" | "ai";
  color: string;
  icon: string;
}

interface ArchEdge {
  from: string;
  to: string;
  label?: string;
}

const NODE_STYLES: Record<string, { color: string; icon: string; shape: string }> = {
  entry:    { color: "#6C63FF", icon: "🌐", shape: "rounded" },
  proxy:    { color: "#10b981", icon: "🔀", shape: "hexagon" },
  app:      { color: "#8b5cf6", icon: "🖥️", shape: "rounded" },
  database: { color: "#f97316", icon: "🗄️", shape: "cylinder" },
  service:  { color: "#06b6d4", icon: "⚙️", shape: "pill" },
  external: { color: "#ec4899", icon: "☁️", shape: "cloud" },
  infra:    { color: "#6366f1", icon: "🐳", shape: "dashed" },
  auth:     { color: "#f59e0b", icon: "🔐", shape: "rounded" },
  queue:    { color: "#ef4444", icon: "📨", shape: "pill" },
  storage:  { color: "#eab308", icon: "📦", shape: "cylinder" },
  ai:       { color: "#d946ef", icon: "🧠", shape: "cloud" },
};

function parseArchitecture(overview: string, diagram: string): { nodes: ArchNode[]; edges: ArchEdge[] } {
  const allText = (overview + "\n" + diagram).toLowerCase();
  const nodes: ArchNode[] = [];
  const edges: ArchEdge[] = [];
  let nodeIdx = 0;

  const addNode = (type: ArchNode["type"], label: string, sublabel: string = "") => {
    // Deduplicate by label prefix
    if (nodes.some(n => n.label === label)) return;
    const style = NODE_STYLES[type];
    nodes.push({ id: `n${nodeIdx++}`, label, sublabel, type, color: style.color, icon: style.icon });
  };

  const addEdge = (fromLabel: string, toLabel: string, edgeLabel?: string) => {
    const fromN = nodes.find(n => n.label === fromLabel);
    const toN = nodes.find(n => n.label === toLabel);
    if (fromN && toN && !edges.some(e => e.from === fromN.id && e.to === toN.id)) {
      edges.push({ from: fromN.id, to: toN.id, label: edgeLabel });
    }
  };

  // Detect components from text
  const hasText = (words: string[]) => words.some(w => allText.includes(w));

  // Infrastructure shell
  addNode("infra", "Tencent Lighthouse", "Ubuntu 24.04");

  // Entry: Nginx / proxy
  if (hasText(["nginx", "reverse proxy", "proxy"])) {
    addNode("entry", "Nginx Reverse Proxy", "SSL • HTTPS • Routing");
  } else {
    addNode("entry", "HTTPS Entry", "SSL Termination");
  }

  // App: Next.js / web framework
  if (hasText(["next.js", "nextjs", "next"])) {
    addNode("app", "Next.js App", "SSR • Pages • API");
  } else if (hasText(["react", "vue", "svelte"])) {
    addNode("app", "Web Application", "Frontend + API");
  } else {
    addNode("app", "Application Server", "Business Logic");
  }

  // Database
  if (hasText(["postgresql", "postgres", "pg"])) {
    addNode("database", "PostgreSQL", "Primary Database");
  } else if (hasText(["mysql", "mariadb"])) {
    addNode("database", "MySQL", "Primary Database");
  } else if (hasText(["mongodb", "mongo"])) {
    addNode("database", "MongoDB", "Document Store");
  } else if (hasText(["sqlite"])) {
    addNode("database", "SQLite", "Embedded Database");
  } else if (hasText(["database", "db", "data"])) {
    addNode("database", "Database", "Data Storage");
  }

  // Auth
  if (hasText(["nextauth", "clerk", "auth0", "oauth", "jwt", "bcrypt", "password"])) {
    addNode("auth", "Authentication", "JWT • Sessions • OAuth");
  }

  // Background jobs / queue
  if (hasText(["inngest", "bull", "queue", "background", "cron"])) {
    addNode("queue", "Background Jobs", "Queues • Cron • Events");
  } else if (hasText(["resend", "email", "notification"])) {
    addNode("queue", "Email Service", "Transactional • Notifications");
  }

  // External APIs
  if (hasText(["stripe", "payment"])) {
    addNode("external", "Stripe", "Payments");
  }
  if (hasText(["amadeus", "sabre", "travelport"])) {
    addNode("external", "Amadeus API", "Flights • Hotels");
  }
  if (hasText(["mapbox", "google maps", "leaflet"])) {
    addNode("external", "Maps API", "Geolocation");
  }
  if (hasText(["twilio", "sendgrid", "resend"])) {
    addNode("external", "Email / SMS API", "Notifications");
  }
  if (hasText(["openai", "deepseek", "anthropic", "gpt", "llm"])) {
    addNode("ai", "AI / LLM API", "GPT • Claude • DeepSeek");
  }
  if (hasText(["s3", "r2", "cloudflare", "cdn", "upload"])) {
    addNode("storage", "Object Storage", "S3 • R2 • CDN");
  }

  // Fill component details from the actual text
  for (const node of nodes) {
    const nameLower = node.label.toLowerCase();
    const matchingLines = allText.split("\n").filter(l => l.toLowerCase().includes(nameLower.split(" ")[0]));
    if (matchingLines.length > 0) {
      // Use the most descriptive line
      const best = matchingLines.sort((a, b) => b.length - a.length)[0];
      const cleaned = best.replace(/^[┌└│├─┐┘┴┬┤┼\s]+/, "").trim().slice(0, 50);
      if (cleaned.length > node.label.length + 3) {
        node.sublabel = cleaned;
      }
    }
  }

  // Build edges: flow from entry → proxy → app → database + external
  const entryNode = nodes.find(n => n.type === "entry" || n.type === "infra");
  const proxyNode = nodes.find(n => n.type === "entry");
  const appNode = nodes.find(n => n.type === "app");
  const dbNode = nodes.find(n => n.type === "database");
  const infraNode = nodes.find(n => n.type === "infra");
  const authNode = nodes.find(n => n.type === "auth");
  const queueNode = nodes.find(n => n.type === "queue");

  // Core flow
  if (infraNode && proxyNode) addEdge(infraNode.label, proxyNode.label, "routes");
  if (proxyNode && appNode) addEdge(proxyNode.label, appNode.label, "proxies");
  if (appNode && dbNode) addEdge(appNode.label, dbNode.label, "queries");
  if (appNode && authNode) addEdge(appNode.label, authNode.label, "authenticates");
  if (appNode && queueNode) addEdge(appNode.label, queueNode.label, "enqueues");

  // External integrations
  for (const node of nodes) {
    if (node.type === "external" || node.type === "ai" || node.type === "storage") {
      if (appNode) addEdge(appNode.label, node.label, "calls");
    }
  }

  // Fallback: parse from diagram ASCII structure
  if (nodes.length <= 1 && diagram) {
    const lines = diagram.split("\n").filter(l => {
      const t = l.replace(/[┌└│├─┐┘┴┬┤┼\s]+/g, "").trim();
      return t.length > 2;
    });
    lines.slice(0, 10).forEach((line, i) => {
      const cleaned = line.replace(/^[^a-zA-Z0-9]+/, "").trim().slice(0, 30);
      if (cleaned) addNode("service", cleaned);
    });
  }

  return { nodes, edges };
}

/* ─── SVG Architecture Diagram ─── */

function ArchitectureSvg({ overview, diagram }: { overview: string; diagram: string }) {
  const { nodes, edges } = parseArchitecture(overview, diagram);

  if (nodes.length === 0) {
    return diagram ? (
      <pre className="rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] p-5 text-[10px] sm:text-xs font-mono text-[#10b981] overflow-x-auto leading-tight">
        {diagram}
      </pre>
    ) : null;
  }

  // Layout: vertical stack with connections
  const PADDING_X = 20;
  const PADDING_Y = 20;
  const NODE_W = 170;
  const NODE_H = 62;
  const GAP = 20;
  const EDGE_LABEL_OFFSET = 16;

  // Group nodes by type for layout
  const layout = computeLayout(nodes, edges);
  const { positions, svgW, svgH } = layout;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="w-full"
        style={{ minWidth: Math.min(svgW, 600), maxWidth: svgW }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          {nodes.map(n => (
            <linearGradient key={`g-${n.id}`} id={`grad-${n.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={n.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={n.color} stopOpacity="0.08" />
            </linearGradient>
          ))}
          {/* Arrow marker */}
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#404060" />
          </marker>
          {/* Shadow filter */}
          <filter id="nodeShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = positions[edge.from];
          const to = positions[edge.to];
          if (!from || !to) return null;
          return (
            <g key={`e-${i}`}>
              <line
                x1={from.x + NODE_W / 2}
                y1={from.y + NODE_H}
                x2={to.x + NODE_W / 2}
                y2={to.y}
                stroke="#303050"
                strokeWidth="2"
                strokeDasharray={edge.label === "calls" ? "6 3" : "0"}
                markerEnd={edge.label ? "url(#arrowhead)" : undefined}
              />
              {edge.label && (
                <text
                  x={to.x + NODE_W / 2}
                  y={to.y - EDGE_LABEL_OFFSET / 2}
                  textAnchor="middle"
                  className="text-[9px]"
                  fill="#606080"
                  fontFamily="monospace"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(n => {
          const pos = positions[n.id];
          if (!pos) return null;
          const style = NODE_STYLES[n.type];
          return <ArchNodeShape key={n.id} node={n} pos={pos} w={NODE_W} h={NODE_H} />;
        })}
      </svg>
    </div>
  );
}

function computeLayout(nodes: ArchNode[], edges: ArchEdge[]) {
  // Sort nodes: infra → entry → proxy → app → auth/db → services → external
  const order = ["infra", "entry", "proxy", "app", "auth", "database", "queue", "service", "storage", "external", "ai"];
  const sorted = [...nodes].sort((a, b) => order.indexOf(a.type) - order.indexOf(b.type));

  const NODE_W = 170;
  const NODE_H = 62;
  const PAD = 20;
  const GAP = 24;

  // Group nodes into rows by type
  const rows: ArchNode[][] = [];
  const seen = new Set<string>();
  for (const t of order) {
    const group = sorted.filter(n => n.type === t && !seen.has(n.id));
    group.forEach(n => seen.add(n.id));
    if (group.length > 0) rows.push(group);
  }
  // Catch any unplaced
  const remaining = sorted.filter(n => !seen.has(n.id));
  if (remaining.length > 0) rows.push(remaining);

  const positions: Record<string, { x: number; y: number }> = {};
  let y = PAD;
  const maxRowWidth = Math.max(...rows.map(r => r.length * NODE_W + (r.length - 1) * GAP));
  const svgW = maxRowWidth + PAD * 2;

  for (const row of rows) {
    const totalW = row.length * NODE_W + (row.length - 1) * GAP;
    let x = (svgW - totalW) / 2;
    for (const node of row) {
      positions[node.id] = { x, y };
      x += NODE_W + GAP;
    }
    y += NODE_H + GAP;
  }

  const svgH = y - GAP + PAD;
  return { positions, svgW, svgH };
}

function ArchNodeShape({ node, pos, w, h }: { node: ArchNode; pos: { x: number; y: number }; w: number; h: number }) {
  const { x, y } = pos;
  const rx = 10;
  const style = NODE_STYLES[node.type];
  const isCylinder = style.shape === "cylinder";
  const isCloud = style.shape === "cloud";
  const isDashed = style.shape === "dashed";
  const isPill = style.shape === "pill";
  const pillRx = isPill ? h / 2 : rx;

  return (
    <g filter="url(#nodeShadow)">
      {/* Node body */}
      {isCloud ? (
        <CloudShape x={x} y={y} w={w} h={h} color={node.color} />
      ) : isCylinder ? (
        <>
          <ellipse cx={x + w / 2} cy={y + 8} rx={w / 2} ry={8} fill={`${node.color}15`} stroke={node.color} strokeWidth="1.5" strokeOpacity="0.4" />
          <rect x={x} y={y + 8} width={w} height={h - 16} fill={`url(#grad-${node.id})`} stroke={node.color} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray={isDashed ? "4 3" : "0"} />
          <ellipse cx={x + w / 2} cy={y + h - 8} rx={w / 2} ry={8} fill={`${node.color}12`} stroke={node.color} strokeWidth="1.5" strokeOpacity="0.4" />
          <path d={`M ${x} ${y + 8} A ${w / 2} 8 0 0 0 ${x + w} ${y + 8}`} fill="none" stroke={node.color} strokeWidth="1" strokeOpacity="0.3" />
        </>
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={pillRx}
          fill={`url(#grad-${node.id})`}
          stroke={node.color}
          strokeWidth="1.5"
          strokeOpacity="0.4"
          strokeDasharray={isDashed ? "5 3" : "0"}
        />
      )}

      {/* Icon */}
      <text x={x + 14} y={y + h / 2 + 2} fontSize="16" textAnchor="middle" dominantBaseline="middle">
        {node.icon}
      </text>

      {/* Label */}
      <text x={x + 34} y={y + h / 2 - 6} fontSize="11" fontWeight="600" fill="#e4e4ec" fontFamily="system-ui, sans-serif">
        {node.label.length > 20 ? node.label.slice(0, 18) + "…" : node.label}
      </text>

      {/* Sublabel */}
      {node.sublabel && (
        <text x={x + 34} y={y + h / 2 + 10} fontSize="9" fill="#606080" fontFamily="system-ui, sans-serif">
          {node.sublabel.length > 24 ? node.sublabel.slice(0, 22) + "…" : node.sublabel}
        </text>
      )}
    </g>
  );
}

function CloudShape({ x, y, w, h, color }: { x: number; y: number; w: number; h: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={`${color}10`} stroke={color} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 3" />
    </g>
  );
}

/* ─── Schema Tab ─── */

function SchemaTab({ content }: { content: any }) {
  const tables = content.tables || [];
  return (
    <div className="space-y-4">
      {tables.map((table: any, i: number) => (
        <div key={i} className="rounded-lg border border-[#1e1e2e] overflow-hidden">
          <div className="bg-[#0a0a0f]/80 px-4 py-2 border-b border-[#1e1e2e] flex items-center justify-between">
            <span className="text-sm font-semibold text-white">{table.name}</span>
            <span className="text-[10px] text-[#9090a8]">{table.purpose}</span>
          </div>
          <pre className="p-4 text-[10px] sm:text-xs font-mono text-[#10b981] overflow-x-auto bg-[#0a0a0f]/40">
            {table.sql}
          </pre>
        </div>
      ))}
    </div>
  );
}

/* ─── API Tab ─── */

function ApiTab({ content }: { content: any }) {
  const endpoints = content.endpoints || [];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#1e1e2e]">
            <th className="text-left py-2 px-3 text-[#9090a8] font-medium w-[60px]">Method</th>
            <th className="text-left py-2 px-3 text-[#9090a8] font-medium">Path</th>
            <th className="text-left py-2 px-3 text-[#9090a8] font-medium">Purpose</th>
            <th className="text-left py-2 px-3 text-[#9090a8] font-medium w-[50px]">Auth</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map((ep: any, i: number) => (
            <tr key={i} className="border-b border-[#1e1e2e]/50 hover:bg-[#0a0a0f]/30">
              <td className="py-2 px-3">
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${
                  ep.method === "GET" ? "bg-[#10b981]/10 text-[#10b981]" :
                  ep.method === "POST" ? "bg-[#6C63FF]/10 text-[#a5a0ff]" :
                  ep.method === "PUT" || ep.method === "PATCH" ? "bg-[#f59e0b]/10 text-[#f59e0b]" :
                  "bg-[#ef4444]/10 text-[#ef4444]"
                }`}>
                  {ep.method}
                </span>
              </td>
              <td className="py-2 px-3 font-mono text-[10px] text-[#c4c4d8]">{ep.path}</td>
              <td className="py-2 px-3 text-[#9090a8]">{ep.purpose}</td>
              <td className="py-2 px-3 text-[#606080]">{ep.auth}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── Phases Tab ─── */

function PhasesTab({ content }: { content: any }) {
  const phases = Array.isArray(content) ? content : [];
  return (
    <div className="space-y-4">
      {phases.map((phase: any, i: number) => (
        <div key={i} className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f]/60 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="w-7 h-7 rounded-lg bg-[#6C63FF] flex items-center justify-center text-xs font-bold text-white">
              {phase.phase || i + 1}
            </span>
            <div>
              <h5 className="text-sm font-semibold text-white">{phase.name}</h5>
              <p className="text-[10px] text-[#9090a8]">{phase.weeks} — {phase.goal}</p>
            </div>
          </div>
          <ul className="space-y-1 ml-10">
            {(phase.items || []).map((item: string, j: number) => (
              <li key={j} className="text-xs text-[#9090a8] flex items-start gap-2">
                <span className="text-[#10b981] mt-0.5">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ─── Scale Tab ─── */

function ScaleTab({ content }: { content: any }) {
  const phases = Array.isArray(content) ? content : [];
  return (
    <div className="space-y-4">
      {phases.map((phase: any, i: number) => (
        <div key={i} className="rounded-lg border border-[#1e1e2e] bg-[#0a0a0f]/60 p-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg">{i === 0 ? "📈" : "🚀"}</span>
            <div>
              <h5 className="text-sm font-semibold text-white">{phase.name}</h5>
              <p className="text-[10px] text-[#f59e0b]">Trigger: {phase.trigger}</p>
            </div>
          </div>
          <ul className="space-y-1 ml-9">
            {(phase.changes || []).map((change: string, j: number) => (
              <li key={j} className="text-xs text-[#9090a8] flex items-start gap-2">
                <span className="text-[#f59e0b] mt-0.5">→</span> {change}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

/* ─── Costs Tab ─── */

function CostsTab({ content }: { content: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h5 className="text-xs font-semibold text-[#10b981] mb-3">💚 MVP Costs</h5>
        <div className="space-y-2">
          {(content.mvp || []).map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[#0a0a0f]/60 px-3 py-2">
              <span className="text-xs text-[#9090a8]">{item.item}</span>
              <span className="text-xs font-mono font-bold text-[#10b981]">{item.monthly}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h5 className="text-xs font-semibold text-[#f59e0b] mb-3">⚡ At Scale</h5>
        <div className="space-y-2">
          {(content.scaleUp || []).map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between rounded-lg bg-[#0a0a0f]/60 px-3 py-2">
              <span className="text-xs text-[#9090a8]">{item.item}</span>
              <span className="text-xs font-mono font-bold text-[#f59e0b]">{item.monthly}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Security Tab ─── */

function SecurityTab({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div>
        <h5 className="text-xs font-semibold text-[#6C63FF] mb-2">🛡️ Security Measures</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {(content.measures || []).map((m: string, i: number) => (
            <div key={i} className="rounded-lg bg-[#0a0a0f]/60 px-3 py-2 text-xs text-[#9090a8] flex items-start gap-2">
              <span className="text-[#10b981] shrink-0">✓</span> {m}
            </div>
          ))}
        </div>
      </div>
      {content.complianceFrameworks?.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-[#6C63FF] mb-2">📋 Compliance</h5>
          <div className="flex flex-wrap gap-2">
            {content.complianceFrameworks.map((f: string, i: number) => (
              <span key={i} className="rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/20 px-3 py-1 text-[11px] text-[#a5a0ff]">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── GTM Tab ─── */

function GtmTab({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-[#0a0a0f]/60 p-4">
        <h5 className="text-xs font-semibold text-[#6C63FF] mb-2">Strategy</h5>
        <p className="text-sm text-[#c4c4d8] leading-relaxed">{content.launchStrategy}</p>
      </div>
      {content.targetChannels?.length > 0 && (
        <div>
          <h5 className="text-xs font-semibold text-[#6C63FF] mb-2">Target Channels</h5>
          <div className="flex flex-wrap gap-2">
            {content.targetChannels.map((ch: string, i: number) => (
              <span key={i} className="rounded-lg bg-[#0a0a0f]/60 border border-[#1e1e2e] px-3 py-1.5 text-xs text-[#9090a8]">
                {ch}
              </span>
            ))}
          </div>
        </div>
      )}
      {content.monetization && (
        <div className="rounded-lg bg-[#0a0a0f]/60 p-4">
          <h5 className="text-xs font-semibold text-[#6C63FF] mb-2">Monetization</h5>
          <p className="text-sm text-[#c4c4d8]">{content.monetization}</p>
        </div>
      )}
    </div>
  );
}
