import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "./users";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  },
  providers: [
    // ── Credentials (email + password) ──────────────────────────────────────
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        const user = findUserByEmail(email);
        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
      },
    }),

    // ── Google OAuth ─────────────────────────────────────────────────────────
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Auto-create Google users on first login
      if (account?.provider === "google" && user.email) {
        const existing = findUserByEmail(user.email);
        if (!existing) {
          createUser({
            name: user.name ?? "Student",
            email: user.email,
            passwordHash: null,
            image: user.image ?? null,
            provider: "google",
            role: "student",
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "student";
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = (token.role as string) ?? "student";
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});
