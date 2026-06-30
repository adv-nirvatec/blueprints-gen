import { NextRequest, NextResponse } from "next/server";

const SMTP_HOST = "smtp.hostinger.com";
const SMTP_PORT = 465;
const SMTP_USER = "admin@failfast.online";
const SMTP_PASS = "Qv^5aj34pYD";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { appName, appDescription, industry, clientName, clientEmail, blueprintId } = body;

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.default.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px 16px; background: #0a0a0f; color: #e4e4ec;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="font-size: 28px;">🧬</span>
          <h2 style="font-size: 18px; color: #6C63FF; margin: 6px 0 0;">New Blueprint Consult Request</h2>
        </div>
        
        <div style="background: #111118; border: 1px solid #1e1e2e; border-radius: 12px; padding: 20px;">
          <div style="margin-bottom: 16px;">
            <p style="font-size: 12px; color: #606080; margin: 0 0 4px;">App</p>
            <p style="font-size: 16px; font-weight: 700; color: #fff; margin: 0;">${appName || "Unknown"}</p>
            ${industry ? `<p style="font-size: 12px; color: #9090a8; margin: 2px 0 0;">${industry}</p>` : ""}
          </div>

          <div style="margin-bottom: 16px;">
            <p style="font-size: 12px; color: #606080; margin: 0 0 4px;">Description</p>
            <p style="font-size: 13px; color: #c4c4d8; margin: 0; line-height: 1.5;">${appDescription?.slice(0, 300) || "N/A"}</p>
          </div>

          <div style="background: #0a0a0f; border-radius: 8px; padding: 12px; margin-bottom: 16px;">
            ${clientName ? `<p style="font-size: 13px; margin: 0 0 4px;"><strong style="color: #e4e4ec;">Client:</strong> <span style="color: #a5a0ff;">${clientName}</span></p>` : ""}
            ${clientEmail ? `<p style="font-size: 13px; margin: 0;"><strong style="color: #e4e4ec;">Email:</strong> <span style="color: #a5a0ff;">${clientEmail}</span></p>` : "<p style=\"font-size: 13px; color: #ef4444; margin: 0;\">No contact info provided</p>"}
          </div>

          <a href="https://failfast.online/portal/admin" style="display: block; text-align: center; background: linear-gradient(135deg, #6C63FF, #7b73ff); color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 10px; font-weight: 600; font-size: 14px;">
            View in Admin Dashboard →
          </a>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"FailFast Notifications" <admin@failfast.online>`,
      to: "admin@failfast.online",
      subject: `🔔 New Consult: ${appName || "Blueprint Request"}`,
      html,
    });

    return NextResponse.json({ success: true, message: "Notification sent" });
  } catch (error: any) {
    console.error("Notify consult error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
