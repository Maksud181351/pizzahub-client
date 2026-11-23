import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// TEMPORARY diagnostic route. Delete after the database problem is fixed.
export async function GET() {
  const uri = process.env.MONGODB_URI || "";
  const info = {
    hasUri: !!uri,
    scheme: uri.split(":")[0] || null,
    host: ((uri.match(/@([^/?]+)/) || [])[1] || "").split(",")[0] || null,
    uriHasOddChars: /["'<>\s]/.test(uri),
    db: process.env.MONGODB_DB || null,
    secretLength: (process.env.BETTER_AUTH_SECRET || "").length,
    authUrl: process.env.BETTER_AUTH_URL || null,
  };
  if (!uri) return NextResponse.json({ ok: false, error: "MONGODB_URI is empty on this deployment", ...info }, { status: 500 });

  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
  try {
    await client.connect();
    const users = await client.db(process.env.MONGODB_DB || "pizzahub").collection("users").countDocuments();
    return NextResponse.json({ ok: true, users, ...info });
  } catch (e) {
    const msg = `${e.name}: ${e.message}`.replace(/\/\/[^@\s]*@/g, "//***@").slice(0, 600);
    return NextResponse.json({ ok: false, error: msg, ...info }, { status: 500 });
  } finally {
    await client.close().catch(() => {});
  }
}