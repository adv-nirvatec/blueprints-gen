import { NextRequest, NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import pool from "@/lib/db";
import { verifyPassword, createSession, ensureAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await initDB();
  await ensureAdmin();

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const result = await pool.query("SELECT * FROM clients WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const client = result.rows[0];
    if (!verifyPassword(password, client.password_hash)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check if this is the admin (any admin-prefixed email)
    const isAdmin = email.startsWith("admin@");
    const token = await createSession(client.id, isAdmin);

    // Update last login
    await pool.query("UPDATE clients SET last_login = NOW() WHERE id = $1", [client.id]);

    const response = NextResponse.json({
      success: true,
      isAdmin,
      displayName: client.display_name,
    });

    response.cookies.set("blueprints_session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
