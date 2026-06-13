import { NextRequest, NextResponse } from "next/server";
import { withSecurity, FeedbackSchema } from "@/lib/security/validate";
import fs from "fs";
import path from "path";

const FEEDBACK_FILE = path.join(process.cwd(), "data", "feedback.json");

interface FeedbackEntry {
  id: string;
  type: string;
  message: string;
  page?: string;
  rating?: number;
  email?: string;
  createdAt: string;
  ip: string;
}

export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "feedback", FeedbackSchema);
  if (error) return error;

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const entry: FeedbackEntry = {
      id: crypto.randomUUID(),
      ...data,
      ip,
      createdAt: new Date().toISOString(),
    };

    // Append to feedback file
    const dir = path.dirname(FEEDBACK_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let existing: FeedbackEntry[] = [];
    try {
      existing = JSON.parse(fs.readFileSync(FEEDBACK_FILE, "utf-8"));
    } catch {
      // file doesn't exist yet
    }
    existing.push(entry);
    fs.writeFileSync(FEEDBACK_FILE, JSON.stringify(existing, null, 2));

    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    console.error("Feedback error:", err);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
