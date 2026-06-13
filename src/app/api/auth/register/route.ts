import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/lib/auth/users";
import { withSecurity, SignUpSchema } from "@/lib/security/validate";

export async function POST(request: NextRequest) {
  const { data, error } = await withSecurity(request, "auth", SignUpSchema);
  if (error) return error;

  // Check if email already taken
  if (findUserByEmail(data.email)) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  createUser({
    name: data.name,
    email: data.email,
    passwordHash,
    image: null,
    provider: "credentials",
    role: "student",
  });

  return NextResponse.json({ success: true });
}
