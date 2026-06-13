/**
 * Simple file-based user store (dev-friendly, zero config).
 * Replace with Prisma/Supabase for production.
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string | null; // null for OAuth users
  image: string | null;
  provider: "credentials" | "google" | "guest";
  role: "student" | "teacher" | "admin";
  xp: number;
  createdAt: string;
}

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readUsers(): StoredUser[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]): void {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function findUserByEmail(email: string): StoredUser | null {
  return readUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function findUserById(id: string): StoredUser | null {
  return readUsers().find((u) => u.id === id) ?? null;
}

export function createUser(data: Omit<StoredUser, "id" | "createdAt" | "xp">): StoredUser {
  const users = readUsers();
  const user: StoredUser = {
    ...data,
    id: crypto.randomUUID(),
    xp: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  return user;
}

export function updateUserXP(id: string, xp: number): void {
  const users = readUsers();
  const user = users.find((u) => u.id === id);
  if (user) {
    user.xp += xp;
    writeUsers(users);
  }
}
