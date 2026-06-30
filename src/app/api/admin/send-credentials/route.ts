import { NextRequest, NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import pool from "@/lib/db";
import { validateSession, hashPassword } from "@/lib/auth";
import crypto from "crypto";

// Hostinger SMTP config
const SMTP_HOST = "smtp.hostinger.com";
const SMTP_PORT = 465;
const SMTP_USER = "admin@failfast.online";
const SMTP_PASS = "Qv^5aj34pYD";

async function sendEmail(to: string, subject: string, html: string) {
  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.default.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FailFast Blueprints" <admin@failfast.online>`,
    to,
    subject,
    html,
  });
}

export async function POST(req: NextRequest) {
  await initDB();

  const session = await validateSession(req);
  if (!session.authenticated || !session.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { blueprintId } = await req.json();
    if (!blueprintId) {
      return NextResponse.json({ error: "blueprintId required" }, { status: 400 });
    }

    // Get blueprint and client info
    const bpResult = await pool.query(
      `SELECT b.*, c.email as client_account_email, c.display_name 
       FROM blueprints b 
       LEFT JOIN clients c ON b.assigned_to = c.id 
       WHERE b.id = $1`,
      [blueprintId]
    );

    if (bpResult.rows.length === 0) {
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });
    }

    const bp = bpResult.rows[0];
    const clientEmail = bp.client_email || bp.client_account_email;

    if (!clientEmail) {
      return NextResponse.json({ error: "No client email on this blueprint" }, { status: 400 });
    }

    // Generate a new temporary password
    const tempPassword = crypto.randomBytes(10).toString("hex");
    const passwordHash = hashPassword(tempPassword);

    // Update or create the client account with the new password
    const clientResult = await pool.query(
      `INSERT INTO clients (email, password_hash, display_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET password_hash = $2
       RETURNING id`,
      [clientEmail, passwordHash, bp.client_name || bp.display_name || null]
    );

    const clientId = clientResult.rows[0].id;

    // Assign blueprint to client
    await pool.query(
      "UPDATE blueprints SET assigned_to = $1, status = 'full', updated_at = NOW() WHERE id = $2",
      [clientId, blueprintId]
    );

    // Send the email
    const loginUrl = "https://failfast.online/portal/login";
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 16px; background: #0a0a0f; color: #e4e4ec;">
        <div style="text-align: center; margin-bottom: 28px;">
          <span style="font-size: 32px;">🧬</span>
          <h1 style="font-size: 22px; font-weight: 700; color: #6C63FF; margin: 8px 0 0;">FailFast Blueprints</h1>
        </div>
        
        <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 16px; padding: 28px;">
          <h2 style="font-size: 18px; color: #fff; margin: 0 0 8px;">Your Blueprint is Ready!</h2>
          <p style="color: #9090a8; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
            We've completed the full blueprint for <strong style="color: #a5a0ff;">${bp.app_name}</strong>. 
            Your complete architecture docs, database schema, API design, build phases, and more are ready to view.
          </p>

          <div style="background: #0a0a0f; border: 1px solid #1e1e2e; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="font-size: 12px; color: #606080; margin: 0 0 8px;">Your login credentials:</p>
            <p style="font-size: 14px; margin: 4px 0;"><strong style="color: #e4e4ec;">Email:</strong> <span style="color: #a5a0ff;">${clientEmail}</span></p>
            <p style="font-size: 14px; margin: 4px 0;"><strong style="color: #e4e4ec;">Password:</strong> <code style="background: #1e1e2e; color: #10b981; padding: 2px 8px; border-radius: 4px; font-size: 13px;">${tempPassword}</code></p>
          </div>

          <a href="${loginUrl}" style="display: block; text-align: center; background: linear-gradient(135deg, #6C63FF, #7b73ff); color: #fff; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 600; font-size: 15px;">
            View Your Blueprint →
          </a>

          <p style="color: #606080; font-size: 11px; margin: 20px 0 0; text-align: center;">
            You can change your password after logging in.<br>
            Questions? Reply to this email and a team member will get back to you.
          </p>
        </div>

        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #404050; font-size: 11px;">
            FailFast Blueprints
          </p>
        </div>
      </div>
    `;

    await sendEmail(clientEmail, `Your ${bp.app_name} Blueprint is Ready`, emailHtml);

    return NextResponse.json({
      success: true,
      message: `Credentials sent to ${clientEmail}`,
      clientEmail,
    });
  } catch (error: any) {
    console.error("Send credentials error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send credentials" },
      { status: 500 }
    );
  }
}
