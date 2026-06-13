import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SimuLearn — AI-Powered Interactive Learning",
  description:
    "Learn any concept through interactive simulations, real-world examples, and AI-generated explanations. Physics, Chemistry, Maths, Biology, CS and more.",
  keywords: ["education", "interactive learning", "simulations", "JEE", "NEET", "AI tutor"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-surface text-white min-h-screen`}>
        <SessionWrapper>
          <Navbar />
          <main className="pb-20 md:pb-0">{children}</main>
        </SessionWrapper>
      </body>
    </html>
  );
}

