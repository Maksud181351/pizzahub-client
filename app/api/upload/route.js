import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export const runtime = "nodejs";
const ALLOWED = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" };
const MAX = 5 * 1024 * 1024;

export async function POST(request) {
  let file;
  try {
    file = (await request.formData()).get("image");
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  if (!file || typeof file === "string") return NextResponse.json({ error: "No image provided" }, { status: 400 });
  if (!ALLOWED[file.type]) return NextResponse.json({ error: "Only JPG, PNG, WebP or GIF images are allowed" }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "Image must be smaller than 5 MB" }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const key = (process.env.IMGBB_API_KEY || "").trim().replace(/^["']|["']$/g, "");

  // No ImgBB key: LOCAL TESTING ONLY. Save the file under public/uploads
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Image uploads are not configured" }, { status: 500 });
    }
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const name = `${randomUUID()}.${ALLOWED[file.type]}`;
    await writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ url: `${new URL(request.url).origin}/uploads/${name}` });
  }

  // ImgBB upload (production)
  const body = new FormData();
  body.append("image", bytes.toString("base64"));
  try {
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(key)}`, { method: "POST", body });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.data?.url) {
      const detail = json?.error?.message || `ImgBB returned status ${res.status}`;
      console.error("[ImgBB upload failed]", res.status, detail);
      return NextResponse.json({ error: `Image upload failed: ${detail}` }, { status: 502 });
    }
    return NextResponse.json({ url: json.data.display_url || json.data.url });
  } catch (err) {
    console.error("[ImgBB unreachable]", err?.cause?.code || err?.message);
    return NextResponse.json({ error: "Image service is unreachable. Check your internet and try again" }, { status: 502 });
  }
}