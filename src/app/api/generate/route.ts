import { NextRequest, NextResponse } from "next/server";
import { generateBlueprint, generateFullBlueprint } from "@/lib/blueprint-generator";
import { initDB } from "@/lib/db";
import pool from "@/lib/db";
import { ensureAdmin, hashPassword } from "@/lib/auth";
import crypto from "crypto";

let initialized = false;

async function ensureInitialized() {
  if (initialized) return;
  await initDB();
  await ensureAdmin();
  initialized = true;
}

export async function POST(req: NextRequest) {
  await ensureInitialized();

  try {
    const body = await req.json();
    const {
      appName,
      appDescription,
      industry,
      targetUsers,
      coreFeatures,
      constraints,
      clientName,
      clientEmail,
    } = body;

    if (!appName || !appDescription) {
      return NextResponse.json(
        { error: "appName and appDescription are required" },
        { status: 400 }
      );
    }

    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateKey = ip.split(",")[0].trim();
    const maxPerHour = parseInt(process.env.RATE_LIMIT_PER_HOUR || "5");

    const windowStart = new Date(Date.now() - 60 * 60 * 1000);
    await pool.query(
      `INSERT INTO rate_limits (ip_address, action, window_start, count) 
       VALUES ($1, 'generate', NOW(), 1)
       ON CONFLICT (ip_address, action, window_start) DO UPDATE SET count = rate_limits.count + 1`,
      [rateKey]
    );

    await pool.query("DELETE FROM rate_limits WHERE window_start < $1", [windowStart]);

    const rateResult = await pool.query(
      "SELECT SUM(count) as total FROM rate_limits WHERE ip_address = $1 AND window_start >= $2",
      [rateKey, windowStart]
    );
    const totalGenerations = parseInt(rateResult.rows[0]?.total || "0");

    if (totalGenerations > maxPerHour) {
      return NextResponse.json(
        { error: `Rate limit exceeded. Max ${maxPerHour} generations per hour. Please try again later.` },
        { status: 429 }
      );
    }

    // Sanitize inputs
    const sanitizedInput = {
      appName: (appName as string).slice(0, 100),
      appDescription: (appDescription as string).slice(0, 2000),
      industry: (industry as string)?.slice(0, 100) || undefined,
      targetUsers: (targetUsers as string)?.slice(0, 500) || undefined,
      coreFeatures: Array.isArray(coreFeatures) ? coreFeatures.slice(0, 10).map((f: string) => f.slice(0, 200)) : undefined,
      constraints: constraints ? {
        budget: (constraints.budget as string)?.slice(0, 100),
        timeline: (constraints.timeline as string)?.slice(0, 100),
        compliance: Array.isArray(constraints.compliance) ? constraints.compliance.slice(0, 5) : undefined,
        platform: (constraints.platform as string)?.slice(0, 100),
        scale: (constraints.scale as string)?.slice(0, 100),
      } : undefined,
    };

    const sanitizedEmail = (clientEmail as string)?.slice(0, 200)?.trim()?.toLowerCase() || null;
    const sanitizedName = (clientName as string)?.slice(0, 100)?.trim() || null;

    // Step 1: Generate tech stack (visible to user immediately)
    const result = await generateBlueprint(sanitizedInput);

    // Step 2: Auto-generate full blueprint in background
    let fullBlueprintJson = null;
    try {
      fullBlueprintJson = await generateFullBlueprint(sanitizedInput, result.techStack);
    } catch (e) {
      console.error("Full blueprint generation failed (non-blocking):", e);
    }

    // Step 3: Auto-create client account if email provided
    let clientId: string | null = null;
    let tempPassword: string | null = null;

    if (sanitizedEmail) {
      const existingClient = await pool.query("SELECT id FROM clients WHERE email = $1", [sanitizedEmail]);
      
      if (existingClient.rows.length > 0) {
        clientId = existingClient.rows[0].id;
      } else {
        // Create new client with a random temp password
        tempPassword = crypto.randomBytes(8).toString("hex");
        const passwordHash = hashPassword(tempPassword);

        const newClient = await pool.query(
          `INSERT INTO clients (email, password_hash, display_name, company) 
           VALUES ($1, $2, $3, $4) 
           ON CONFLICT (email) DO UPDATE SET display_name = $3
           RETURNING id`,
          [sanitizedEmail, passwordHash, sanitizedName, null]
        );
        clientId = newClient.rows[0].id;
      }
    }

    // Step 4: Store blueprint with full data and client assignment
    const insertResult = await pool.query(
      `INSERT INTO blueprints (client_name, client_email, app_name, app_description, industry, target_users, 
        core_features, constraints, tech_stack, full_blueprint, assigned_to, status, ip_address, rate_limit_key)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id`,
      [
        sanitizedName,
        sanitizedEmail,
        sanitizedInput.appName,
        sanitizedInput.appDescription.slice(0, 1000),
        sanitizedInput.industry || null,
        sanitizedInput.targetUsers || null,
        sanitizedInput.coreFeatures || null,
        JSON.stringify(sanitizedInput.constraints || {}),
        JSON.stringify(result),
        fullBlueprintJson ? JSON.stringify(fullBlueprintJson) : null,
        clientId,
        clientId ? "full" : "partial",
        rateKey,
        rateKey,
      ]
    );

    return NextResponse.json({
      success: true,
      blueprintId: insertResult.rows[0].id,
      techStack: result.techStack,
      blueprintDocuments: result.blueprintDocuments,
      featureMap: result.featureMap || [],
      hasFullBlueprint: !!fullBlueprintJson,
      clientCreated: !!clientId && !!tempPassword,
      accountReady: !!clientId,
    });
  } catch (error: any) {
    console.error("Blueprint generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate blueprint" },
      { status: 500 }
    );
  }
}
