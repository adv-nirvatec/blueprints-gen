import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

async function callDeepSeek(prompt: string, systemPrompt: string) {
  const key = DEEPSEEK_API_KEY;
  if (!key || key.startsWith("***")) {
    // Try fallback from hardcoded env pattern
    const envKey = process.env.DEEPSEEK_API_KEY;
    if (!envKey || envKey.startsWith("***")) throw new Error("DeepSeek API key not configured");
  }

  const apiKey = DEEPSEEK_API_KEY;
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
      max_tokens: 8000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || "";
}

function extractBrandDNA(html: string, domain: string): {
  primaryColor: string;
  secondaryColor: string;
  isDark: boolean;
  logoUrl: string;
  fontFamily: string;
  tone: string;
} {
  // Defaults
  let primaryColor = "#2563eb";
  let secondaryColor = "#7c3aed";
  let isDark = false;
  let logoUrl = "";
  let fontFamily = "system-ui, sans-serif";
  let tone = "professional";

  // Extract CSS color hints
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const allStyles = styleMatches.join("");

  // Find the most-used hex color (excluding #fff, #000, grays)
  const hexColors = allStyles.match(/#[0-9a-fA-F]{6}/g) || [];
  const colorCounts: Record<string, number> = {};
  hexColors.forEach((c) => {
    const lower = c.toLowerCase();
    if (lower === "#ffffff" || lower === "#000000" || lower === "#333333" ||
        lower === "#666666" || lower === "#999999" || lower === "#cccccc") return;
    colorCounts[lower] = (colorCounts[lower] || 0) + 1;
  });
  const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);
  if (sorted.length > 0) primaryColor = sorted[0][0];
  if (sorted.length > 1) secondaryColor = sorted[1][0];

  // Detect dark mode
  const bgMatches = allStyles.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/gi) || [];
  const bodyBg = allStyles.match(/body\s*\{[^}]*background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i);
  if (bodyBg) {
    const bg = bodyBg[1].toLowerCase();
    isDark = bg === "#000000" || bg === "#111111" || bg === "#0a0a0f" || bg === "#1a1a1a" || bg === "#121212";
  }

  // Extract logo URL
  const logoMatch = html.match(/<img[^>]*src=["']([^"']*(?:logo|brand|icon)[^"']*\.(?:png|svg|jpg|jpeg|webp))["']/i) ||
                    html.match(/<link[^>]*rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/i);
  if (logoMatch) logoUrl = logoMatch[1];

  // Extract font family
  const fontMatch = allStyles.match(/font-family\s*:\s*([^;};]+)/i) ||
                    html.match(/<link[^>]*href=["'][^"']*fonts\.googleapis\.com[^"']*family=([^&"']+)/i);
  if (fontMatch) {
    fontFamily = fontMatch[1].replace(/['"]/g, "").split(",")[0].trim();
    if (fontFamily.includes("+")) fontFamily = fontFamily.replace(/\+/g, " ");
  }

  // Tone detection from content
  const text = html.replace(/<[^>]+>/g, " ").toLowerCase();
  if (text.includes("free") || text.includes("try") || text.includes("start")) tone = "conversion-focused";
  if (text.includes("enterprise") || text.includes("solution") || text.includes("platform")) tone = "enterprise";
  if (text.includes("luxury") || text.includes("premium") || text.includes("exclusive")) tone = "premium";
  if (text.includes("creative") || text.includes("design") || text.includes("studio")) tone = "creative";
  if (text.includes("learn") || text.includes("teach") || text.includes("course")) tone = "educational";

  return { primaryColor, secondaryColor, isDark, logoUrl, fontFamily, tone };
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

    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    // Fetch the target website
    let htmlContent = "";
    let fetchError = "";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const pageRes = await fetch(fetchUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; FailFast/1.0; +https://failfast.online)",
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

    const domain = new URL(fetchUrl).hostname.replace("www.", "");
    const siteName = domain.split(".")[0];

    // Extract brand DNA from the original site
    const brand = extractBrandDNA(htmlContent, domain);
    const stripped = stripHtml(htmlContent);

    // Build the AI prompt — preserve original brand, enhance layout
    const systemPrompt = `You are a senior web designer at FailFast. You enhance existing websites by preserving their brand identity while applying modern design patterns.

CRITICAL RULE: You MUST use the original brand's color scheme when provided. Do NOT override it with our colors. The brand identity is sacred — only the layout, spacing, and modern UI patterns should be enhanced.

DESIGN RULES:
- Output ONLY complete, valid HTML with inline CSS. No markdown, no code block wrappers.
- The output must be a fully self-contained HTML document starting with <!DOCTYPE html>.
- PRESERVE the primary and secondary brand colors. Use them for accents, CTAs, gradients, and card borders.
- Match the original site's dark/light preference.
- Apply modern layout: glassmorphism (backdrop-blur, translucent cards), generous spacing, clean typography.
- Use the provided font family if available, otherwise system font stack.
- Structure: sticky nav, hero, features/services cards (3-4), stats bar, CTA section, footer.
- The footer must include: "Enhanced by FailFast" with a link to https://failfast.online — subtle, small, not prominent.
- Make the page responsive with a max-width container.
- Keep it under 10KB output size.
- Do NOT include any JavaScript frameworks or external dependencies.
- Match the tone of the original content (professional, playful, premium, etc).`;

    const userPrompt = `Enhance the landing page for ${siteName} (${fetchUrl}).

ORIGINAL BRAND DNA (extracted from their site):
- Primary color: ${brand.primaryColor}
- Secondary color: ${brand.secondaryColor}
- Dark mode preference: ${brand.isDark ? "YES — use dark background" : "NO — use light background"}
- Font family: ${brand.fontFamily}
- Brand tone: ${brand.tone}
- Logo URL (if found): ${brand.logoUrl || "None — use the site name as text"}

ORIGINAL PAGE CONTENT:
${stripped.slice(0, 4000)}

${fetchError ? `NOTE: The original site had loading issues. Build a fresh page for "${siteName}" using the brand colors above.` : ""}

INSTRUCTIONS:
1. Use the PRIMARY COLOR (${brand.primaryColor}) for: buttons, CTAs, gradient accents, section headers, link highlights.
2. Use the SECONDARY COLOR (${brand.secondaryColor}) for: hover states, secondary cards, subtle accents.
3. Stick to ${brand.isDark ? "DARK" : "LIGHT"} mode throughout.
4. Structure the page with: nav → hero → features cards → stats → CTA → footer.
5. The CTA should read "Get Started" or be industry-appropriate.
6. Output ONLY the complete HTML — no explanation.`;

    const aiHtml = await callDeepSeek(userPrompt, systemPrompt);

    // Extract HTML
    let cleanHtml = aiHtml;
    const htmlMatch = aiHtml.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    if (htmlMatch) {
      cleanHtml = htmlMatch[0];
    } else {
      const codeMatch = aiHtml.match(/```html?\s*([\s\S]*?)```/);
      if (codeMatch) cleanHtml = codeMatch[1].trim();
      if (!cleanHtml.startsWith("<!DOCTYPE")) {
        cleanHtml = `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>${siteName}</title>\n<style>body{margin:0;padding:0;}</style>\n</head>\n<body>${cleanHtml}</body>\n</html>`;
      }
    }

    // Sanitize
    cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    cleanHtml = cleanHtml.replace(/<script\b[^>]*\/>/gi, "");

    return NextResponse.json({
      success: true,
      html: cleanHtml,
      originalUrl: fetchUrl,
      siteName,
      brandDNA: { primaryColor: brand.primaryColor, secondaryColor: brand.secondaryColor, isDark: brand.isDark },
    });
  } catch (error: any) {
    console.error("Enhance error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to enhance website" },
      { status: 500 }
    );
  }
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

  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 1)
    .join("\n");

  return cleaned.slice(0, 5000);
}
