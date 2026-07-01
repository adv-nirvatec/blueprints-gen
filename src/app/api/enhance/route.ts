import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "sk-placeholder";
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

// Vision model for screenshot analysis (uses the agent's configured vision provider)
const VISION_API_KEY = process.env.OPENAI_API_KEY || "";
const VISION_BASE_URL = process.env.VISION_BASE_URL || "https://api.openai.com/v1";

async function callDeepSeek(prompt: string, systemPrompt: string, maxTokens = 8000) {
  const apiKey = DEEPSEEK_API_KEY;
  if (!apiKey || apiKey.length < 10) throw new Error("DeepSeek API key not configured");

  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek error: ${res.status} - ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || "";
}

async function callVision(base64Image: string, prompt: string): Promise<string> {
  // Try OpenAI API first, fall back to DeepSeek
  const visionKey = VISION_API_KEY;
  if (!visionKey) {
    // No vision key available — return empty analysis, code will fall back to text-only
    return "";
  }

  try {
    const res = await fetch(`${VISION_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${visionKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${base64Image}`,
                  detail: "low",
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!res.ok) return "";
    const data = await res.json();
    return data.choices[0]?.message?.content || "";
  } catch {
    return "";
  }
}

async function takeScreenshot(url: string): Promise<string | null> {
  const encoded = encodeURIComponent(url);
  
  // Browserless / screenshot API options — try multiple
  const sources = [
    // sshot.ru — free, simple
    `https://sshot.ru/api/v1/screenshot?url=${encoded}&width=1024&height=768&format=png`,
    // mini.s-shot.ru — alternative
    `https://mini.s-shot.ru/1024x768/PNG/1024/${encoded}`,
  ];
  
  for (const source of sources) {
    try {
      console.log(`[takeScreenshot] Trying: ${source.slice(0, 80)}...`);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(source, { signal: controller.signal });
      clearTimeout(timeout);
      
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        if (buffer.length > 1000) {
          console.log(`[takeScreenshot] Success: ${buffer.length} bytes`);
          return buffer.toString("base64");
        }
      }
      console.log(`[takeScreenshot] HTTP ${res.status} from source, len=${(await res.text().catch(()=>'')).length}`);
    } catch (e: any) {
      console.log(`[takeScreenshot] Error: ${e.message}`);
    }
  }
  
  console.log(`[takeScreenshot] All sources failed for ${url}`);
  return null;
}

function extractBrandDNA(html: string, domain: string): {
  primaryColor: string; secondaryColor: string; isDark: boolean;
  logoUrl: string; fontFamily: string; tone: string;
} {
  let primaryColor = "#2563eb";
  let secondaryColor = "#7c3aed";
  let isDark = false;
  let logoUrl = "";
  let fontFamily = "system-ui, sans-serif";
  let tone = "professional";

  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const allStyles = styleMatches.join("");
  const allHtml = html.toLowerCase();

  const hexColors = allStyles.match(/#[0-9a-fA-F]{6}/g) || [];
  const colorCounts: Record<string, number> = {};
  hexColors.forEach((c) => {
    const lower = c.toLowerCase();
    if (lower === "#ffffff" || lower === "#000000" || lower === "#333333" ||
        lower === "#666666" || lower === "#999999" || lower === "#cccccc" ||
        lower === "#f0f0f0" || lower === "#eeeeee" || lower === "#dddddd") return;
    colorCounts[lower] = (colorCounts[lower] || 0) + 1;
  });
  const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) primaryColor = sorted[0][0];
  if (sorted.length > 1) secondaryColor = sorted[1][0];

  const bodyBg = allStyles.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i);
  if (bodyBg) {
    const bg = bodyBg[1].toLowerCase();
    isDark = bg === "#000000" || bg === "#111111" || bg === "#0a0a0f" || bg === "#1a1a1a" || bg === "#121212" || bg === "#0d0d0d";
  }

  const logoMatch = html.match(/<img[^>]*src=["']([^"']*(?:logo|brand|icon)[^"']*\.(?:png|svg|jpg|jpeg|webp))["']/i) ||
                    html.match(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i);
  if (logoMatch) logoUrl = logoMatch[1];

  const fontMatch = allStyles.match(/font-family\s*:\s*([^;};]+)/i) ||
                    html.match(/<link[^>]*href=["'][^"']*fonts\.googleapis\.com[^"']*family=([^&"']+)/i);
  if (fontMatch) {
    fontFamily = fontMatch[1].replace(/['"]/g, "").split(",")[0].trim();
    if (fontFamily.includes("+")) fontFamily = fontFamily.replace(/\+/g, " ");
  }

  const text = allHtml;
  if (text.includes("free") || text.includes("try") || text.includes("start")) tone = "conversion-focused";
  if (text.includes("enterprise") || text.includes("solution") || text.includes("platform")) tone = "enterprise";
  if (text.includes("luxury") || text.includes("premium") || text.includes("exclusive")) tone = "premium";
  if (text.includes("creative") || text.includes("design") || text.includes("studio")) tone = "creative";
  if (text.includes("learn") || text.includes("teach") || text.includes("course")) tone = "educational";

  return { primaryColor, secondaryColor, isDark, logoUrl, fontFamily, tone };
}

function isFacebookUrl(url: string): boolean {
  return url.includes("facebook.com") || url.includes("fb.com") || url.includes("fb.me");
}

function extractFacebookIntelFromUrl(url: string): { pageName: string; rawSlug: string } {
  let pageName = "Local Business";
  let rawSlug = "";
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    if (pathParts.length > 0) {
      rawSlug = pathParts[0];
      if (rawSlug === "profile.php") {
        pageName = "Business";
      } else {
        // Convert slug to readable name
        // "southsmiledcc" → detect "south", "smile", "dcc" = Dental Care Center
        pageName = rawSlug.replace(/-/g, " ").replace(/\./g, " ");
        // Smart abbreviation expansion
        pageName = pageName
          .replace(/\bdcc\b/gi, "Dental Care Center")
          .replace(/\bdental\b/gi, "Dental")
          .replace(/\bclinic\b/gi, "Clinic")
          .replace(/\bcare\b/gi, "Care");
        // Title case each word
        pageName = pageName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        // Fix camelCase from collapsed words: "Southsmiledental..." → space before caps
        pageName = pageName.replace(/([a-z])([A-Z])/g, "$1 $2");
        // Clean double spaces
        pageName = pageName.replace(/\s+/g, " ").trim();
      }
    }
  } catch {}
  return { pageName, rawSlug };
}

function extractFacebookIntel(html: string, url: string): {
  pageName: string; category: string; about: string; services: string[];
  location: string; contactInfo: string; postHighlights: string[];
} {
  const text = html.replace(/<[^>]+>/g, " ");
  const lower = text.toLowerCase();

  // Extract page name from title or meta
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i);
  const pageName = ogTitle?.[1] || titleMatch?.[1]?.split("|")[0]?.split("–")[0]?.trim() || "Local Business";

  // Category detection
  let category = "Local Business";
  const catMatch = text.match(/(?:category|type)\s*[:\-]\s*([^.\n]{5,80})/i);
  if (catMatch) category = catMatch[1].trim();
  if (lower.includes("restaurant")) category = "Restaurant";
  if (lower.includes("salon") || lower.includes("barber") || lower.includes("spa")) category = "Beauty & Wellness";
  if (lower.includes("shop") || lower.includes("store") || lower.includes("boutique")) category = "Retail";
  if (lower.includes("real estate") || lower.includes("property")) category = "Real Estate";
  if (lower.includes("gym") || lower.includes("fitness")) category = "Fitness";
  if (lower.includes("doctor") || lower.includes("clinic") || lower.includes("medical")) category = "Healthcare";
  if (lower.includes("lawyer") || lower.includes("legal") || lower.includes("attorney")) category = "Legal Services";
  if (lower.includes("plumb") || lower.includes("electric") || lower.includes("contractor") || lower.includes("repair")) category = "Home Services";

  // About text
  const aboutMatch = text.match(/(?:about|description|story|our mission)[:\s]*([^\n]{40,300})/i);
  const about = aboutMatch?.[1]?.trim() || metaDesc?.[1] || `Welcome to ${pageName} — your local ${category.toLowerCase()} provider.`;

  // Services
  const services: string[] = [];
  const serviceKeywords = ["service", "offer", "provide", "specializ", "expertise"];
  serviceKeywords.forEach((kw) => {
    const re = new RegExp(`${kw}\\s*(?:include)?[:\\s]+([^.!?]{10,120})`, "gi");
    let m;
    while ((m = re.exec(text)) !== null) {
      services.push(m[1].trim());
    }
  });
  if (services.length === 0) {
    // Extract from page content
    const bulletMatch = text.match(/(?:•|›|→|\-)\s*([^•›→\-.\n]{10,80})/g);
    if (bulletMatch) {
      bulletMatch.slice(0, 6).forEach((b) => {
        const clean = b.replace(/[•›→\-]\s*/, "").trim();
        if (clean.length > 10) services.push(clean);
      });
    }
  }

  // Location
  let location = "";
  const locMatch = text.match(/(?:address|location|based in|located in)\s*[:\s]+([^.\n]{10,100})/i);
  if (locMatch) location = locMatch[1].trim();

  // Contact info
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s\-])?\(?\d{2,4}\)?[\s\-]\d{2,4}[\s\-]\d{2,4}/);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const contactInfo = [phoneMatch?.[0], emailMatch?.[0]].filter(Boolean).join(" | ");

  // Post highlights
  const postHighlights: string[] = [];
  const postPattern = /<div[^>]*class="[^"]*userContent[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  let postMatch;
  while ((postMatch = postPattern.exec(html)) !== null && postHighlights.length < 5) {
    const clean = postMatch[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (clean.length > 20 && clean.length < 300) postHighlights.push(clean);
  }

  return { pageName, category, about, services: services.slice(0, 4), location, contactInfo, postHighlights };
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let fetchUrl = url.trim();
    if (!fetchUrl.startsWith("http://") && !fetchUrl.startsWith("https://")) {
      fetchUrl = "https://" + fetchUrl;
    }

    // Check if Facebook URL — skip fetch entirely, Facebook blocks all server requests
    const mode = isFacebookUrl(fetchUrl) ? "facebook" : "website";
    
    if (mode === "facebook") {
      const fbIntel = extractFacebookIntelFromUrl(fetchUrl);
      
      const systemPrompt = `You are a senior web designer at FailFast. You build beautiful, modern professional websites for businesses that only have a Facebook page.

CRITICAL: Output ONLY complete, valid HTML with inline CSS. No markdown, no code blocks. Start with <!DOCTYPE html>.

DESIGN RULES:
- Research what this business does based on the page name. Deduce the industry.
- Choose colors appropriate for the industry.
- Structure: sticky nav → hero with CTA → services cards → about → contact → footer.
- Apply glassmorphism: backdrop-blur, translucent card backgrounds, subtle borders.
- Modern typography, generous spacing, responsive max-width container (max-width: 1100px).
- CRITICAL: For card grids, use CSS Grid NOT flexbox. This MUST be responsive:
  .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
  This ensures 2/3/4 cards all lay out perfectly with no orphaned single cards below.
- Include "Built by FailFast" footer link to https://failfast.online.
- Keep it under 12KB.`;

      const userPrompt = `Build a complete professional landing page for this business based on their Facebook page URL:

FACEBOOK URL: ${fetchUrl}
PAGE NAME (from URL): ${fbIntel.pageName}
SLUG: ${fbIntel.rawSlug}

Deduce what this business does from the name. Be generous with deducing services and industry. Create a modern, professional, industry-appropriate website. Include contact section explaining they can reach the business via Facebook for now.

Output ONLY the complete HTML.`;

      const aiHtml = await callDeepSeek(userPrompt, systemPrompt);
      let cleanHtml = cleanAiHtml(aiHtml, fbIntel.pageName);
      cleanHtml = sanitizeHtml(cleanHtml);
      
      return NextResponse.json({
        success: true, html: cleanHtml, originalUrl: fetchUrl,
        siteName: fbIntel.pageName, mode: "facebook",
        brandDNA: { primaryColor: "#0ea5e9", secondaryColor: "#0891b2", isDark: false },
        fbIntel: { name: fbIntel.pageName, category: "Business", location: "" },
        note: "Generated from Facebook page URL.",
      });
    }

    // Standard website — fetch and enhance
    let htmlContent = "";
    let fetchError = "";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const pageRes = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      clearTimeout(timeout);

      if (!pageRes.ok) {
        fetchError = `Could not fetch URL (HTTP ${pageRes.status})`;
      } else {
        htmlContent = await pageRes.text();
      }
    } catch (e: any) {
      fetchError = e.message || "Failed to fetch URL";
    }

    if (fetchError && !htmlContent) {
      return NextResponse.json({ error: fetchError }, { status: 422 });
    }

    const domain = new URL(fetchUrl).hostname.replace("www.", "").replace("m.", "");
    const siteName = domain.split(".")[0];

    // ─── Standard website → enhanced version ───

    // Extract brand DNA
    const brand = extractBrandDNA(htmlContent, domain);
    const stripped = stripHtml(htmlContent);

    // Attempt screenshot for visual analysis
    let visualAnalysis = "";
    const screenshot = await takeScreenshot(fetchUrl);
    if (screenshot) {
      visualAnalysis = await callVision(screenshot,
        "Analyze this webpage screenshot. Describe: 1) Overall layout structure 2) Color scheme 3) What looks outdated or broken 4) What should be preserved 5) Visual hierarchy and readability issues. Be concise — 5-8 bullet points."
      );
    }

    const systemPrompt = `You are a senior web designer at FailFast. You enhance existing websites by preserving their brand identity while applying modern design patterns.

CRITICAL: You MUST use the original brand's color scheme. Do NOT override it with our colors. The brand identity is sacred — only the layout, spacing, and modern UI patterns should be enhanced.

DESIGN RULES:
- Output ONLY complete, valid HTML with inline CSS. No markdown, no code block wrappers. Start with <!DOCTYPE html>.
- PRESERVE the primary and secondary brand colors. Use them for accents, CTAs, gradients, and card borders.
- Match the original site's dark/light preference.
- Apply modern layout: glassmorphism (backdrop-blur, translucent cards), generous spacing, clean typography.
- Use the provided font family if available, otherwise system font stack.
- Structure: sticky nav, hero, features/services cards (3-4), stats bar, CTA section, footer.
- CRITICAL: For card grids, use CSS Grid NOT flexbox:
  .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
  This ensures 2/3/4 cards all lay out perfectly with no orphaned cards on their own row.
- The footer must include: "Enhanced by" original URL and "by FailFast" linking to https://failfast.online — subtle, small.
- Make the page responsive with a max-width container (max-width: 1100px).
- Keep it under 12KB output size.
- Do NOT include any JavaScript frameworks or external dependencies.
- Match the tone of the original content.`;

    const userPrompt = `Enhance the landing page for ${siteName} (${fetchUrl}).

ORIGINAL BRAND DNA (extracted from their site):
- Primary color: ${brand.primaryColor}
- Secondary color: ${brand.secondaryColor}
- Dark mode: ${brand.isDark ? "YES — use dark background" : "NO — use light background"}
- Font family: ${brand.fontFamily}
- Brand tone: ${brand.tone}
- Logo: ${brand.logoUrl || "Use site name as text"}

${visualAnalysis ? `SCREENSHOT ANALYSIS:\n${visualAnalysis}\n` : ""}

ORIGINAL PAGE CONTENT:
${stripped.slice(0, 4000)}

${fetchError ? `NOTE: Site had loading issues. Build a fresh page using brand colors.` : "Site loaded successfully. Enhance while keeping brand identity."}

INSTRUCTIONS:
1. PRIMARY COLOR (${brand.primaryColor}) for: buttons, CTAs, gradient accents, section headers, link highlights.
2. SECONDARY COLOR (${brand.secondaryColor}) for: hover states, secondary cards, subtle accents.
3. Use ${brand.isDark ? "DARK" : "LIGHT"} mode throughout.
4. Structure: nav → hero → features cards → stats → CTA → footer.
5. Output ONLY the HTML — no explanation.`;

    const aiHtml = await callDeepSeek(userPrompt, systemPrompt);

    let cleanHtml = cleanAiHtml(aiHtml, siteName);
    cleanHtml = sanitizeHtml(cleanHtml);

    return NextResponse.json({
      success: true,
      html: cleanHtml,
      originalUrl: fetchUrl,
      siteName,
      mode: "website",
      brandDNA: { primaryColor: brand.primaryColor, secondaryColor: brand.secondaryColor, isDark: brand.isDark },
      visualAnalyzed: !!visualAnalysis,
    });
  } catch (error: any) {
    console.error("Enhance error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance website" },
      { status: 500 }
    );
  }
}

function cleanAiHtml(aiHtml: string, fallbackName: string): string {
  const htmlMatch = aiHtml.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
  if (htmlMatch) return fixCardLayout(htmlMatch[0]);

  const codeMatch = aiHtml.match(/```html?\s*([\s\S]*?)```/);
  let clean = codeMatch ? codeMatch[1].trim() : aiHtml;

  if (!clean.startsWith("<!DOCTYPE")) {
    clean = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${fallbackName}</title>\n<style>body{margin:0;padding:0;}</style>\n</head>\n<body>${clean}</body>\n</html>`;
  }

  return fixCardLayout(clean);
}

function fixCardLayout(html: string): string {
  // Post-process AI-generated HTML to fix card layout issues.
  // Replace flex-wrap card containers with CSS Grid for proper responsive layout.
  
  // STEP 1: Fix <style> blocks — replace flex-wrap card layouts with CSS Grid
  html = html.replace(
    /(<style[^>]*>[\s\S]*?<\/style>)/gi,
    (styleBlock) => {
      // Find CSS rules that use flex-wrap:wrap and have gap (card containers)
      let fixed = styleBlock.replace(
        /([^{]*\{[^}]*)flex-wrap:\s*wrap([^}]*\})/gi,
        (match, before, after) => {
          // Only fix if not nav/header and has gap or cards-related selector
          if (match.includes("nav") || match.includes("header") || match.includes("footer")) return match;
          let result = before.replace(/display:\s*flex[^;]*;?\s*/gi, "")
            .replace(/flex-wrap:\s*wrap[^;]*;?\s*/gi, "")
            .replace(/justify-content:\s*(center|space-between|space-around)[^;]*;?\s*/gi, "")
            .replace(/align-items:\s*center[^;]*;?\s*/gi, "");
          result += "display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;";
          result += after;
          return result;
        }
      );
      return fixed;
    }
  );

  // STEP 2: Fix inline style flex-wrap containers
  html = html.replace(
    /style="([^"]*display:\s*flex[^"]*flex-wrap:\s*wrap[^"]*)"/gi,
    (match, content) => {
      if (content.includes("nav") || content.includes("header")) return match;
      let fixed = content
        .replace(/display:\s*flex[^;]*;?\s*/gi, "")
        .replace(/flex-wrap:\s*wrap[^;]*;?\s*/gi, "")
        .replace(/justify-content:\s*(center|space-between|space-around)[^;]*;?\s*/gi, "");
      fixed += "display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;";
      return `style="${fixed}"`;
    }
  );

  // STEP 3: Fix calc width percentages that cause orphaned cards
  html = html.replace(
    /width:\s*calc\((\d+)%\s*-\s*\d+px\)/g,
    "width: 100%"
  );

  return html;
}

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<script\b[^>]*\/>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
}

function stripHtml(html: string): string {
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  cleaned = cleaned
    .replace(/<h[1-6][^>]*>/gi, "\n## ")
    .replace(/<\/h[1-6]>/gi, "\n")
    .replace(/<li[^>]*>/gi, "\n- ")
    .replace(/<\/li>/gi, "")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<div[^>]*>/gi, "\n")
    .replace(/<\/div>/gi, "")
    .replace(/<[^>]+>/g, "");

  cleaned = cleaned.split("\n").map((line) => line.trim()).filter((line) => line.length > 1).join("\n");
  return cleaned.slice(0, 5000);
}
