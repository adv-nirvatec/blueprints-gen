import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY!;
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1";

const FALLBACK_KEY = "***";

async function callDeepSeek(prompt: string, systemPrompt: string) {
  const key = DEEPSEEK_API_KEY || FALLBACK_KEY;
  if (!key || key === "***") throw new Error("DeepSeek API key not configured");

  const res = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`,
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

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Basic URL validation
    let fetchUrl = url.trim();
    if (!fetchUrl.startsWith("http://") && !fetchUrl.startsWith("https://")) {
      fetchUrl = "https://" + fetchUrl;
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateKey = ip.split(",")[0].trim();

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

    // Extract meaningful content from HTML
    const stripped = stripHtml(htmlContent);
    const domain = new URL(fetchUrl).hostname.replace("www.", "");
    const siteName = domain.split(".")[0];

    // Build the AI prompt
    const systemPrompt = `You are a senior web designer at FailFast. You transform outdated or basic website HTML into modern, stunning landing pages.

DESIGN RULES:
- Output ONLY complete, valid HTML with inline CSS. No markdown, no code block wrappers.
- The output must be a fully self-contained HTML document starting with <!DOCTYPE html>.
- Use a dark theme with deep charcoal (#0a0a0f) background.
- Primary accent: #a855f7 (vivid purple), secondary: #ec4899 (hot pink).
- Apply glassmorphism: backdrop-blur, translucent card backgrounds, subtle borders.
- Use modern typography: system font stack, bold headlines, clean spacing.
- Include a sticky nav, hero section, cards section, CTA section, footer.
- Preserve the original site's: logo/brand name, core messaging, color personality where possible.
- Make it look premium, modern, and conversion-focused.
- All CSS must be inline or in a <style> block within the <head>.
- Do NOT include any JavaScript frameworks or external dependencies.
- Make the page responsive with a max-width container.
- Keep it under 8KB output size.`;

    const userPrompt = `Here is the stripped content and structure of ${url}:

SITE NAME: ${siteName}
DOMAIN: ${domain}
ORIGINAL URL: ${fetchUrl}

PAGE CONTENT (stripped):
${stripped.slice(0, 4000)}

IMPROVEMENT NOTES: 
${fetchError ? `Note: The original site had loading issues (${fetchError}). Build a fresh landing page for "${siteName}" based on context clues.` : "The original site loaded successfully. Reimagine it with modern design while keeping its core identity."}

Create a redesigned landing page for ${siteName}. Include:
1. A sticky nav with the brand name
2. A hero section with a compelling headline and CTA
3. A features/services section with 3-4 cards
4. A stats/metrics bar
5. An "enhanced by FailFast" footer with a link to https://failfast.online
6. Output ONLY the HTML — no explanation text.`;

    const aiHtml = await callDeepSeek(userPrompt, systemPrompt);

    // Extract HTML if wrapped in code blocks
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

    // Sanitize: remove any script tags for safety
    cleanHtml = cleanHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
    cleanHtml = cleanHtml.replace(/<script\b[^>]*\/>/gi, "");

    return NextResponse.json({
      success: true,
      html: cleanHtml,
      originalUrl: fetchUrl,
      siteName,
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
  // Remove scripts, styles, and non-content tags
  let cleaned = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // Extract text content with basic structure markers
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

  // Clean up whitespace
  cleaned = cleaned
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 1)
    .join("\n");

  return cleaned.slice(0, 5000);
}
