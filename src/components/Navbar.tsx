"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Atom, Home, Compass, LayoutDashboard, Gamepad2, BookOpen, LogIn, LogOut, User, ChevronDown, MessageSquare, Target, Beaker } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/subjects", label: "Subjects", icon: BookOpen },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/simulations", label: "Simulations", icon: Beaker },
  { href: "/mock-test", label: "Mock Test", icon: Target },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/world", label: "World", icon: Gamepad2 },
  { href: "/feedback", label: "Feedback", icon: MessageSquare },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "?";
  const isLoading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-purple-500 rounded-lg flex items-center justify-center">
              <Atom className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Simu<span className="text-brand-400">Learn</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-brand-500/10 text-brand-400" : "text-surface-300 hover:text-white hover:bg-surface-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side: status + auth */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-full border border-surface-200">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-surface-300">AI Active</span>
            </div>

            {/* Auth section */}
            {isLoading ? (
              <div className="w-9 h-9 rounded-full bg-surface-200 animate-pulse" />
            ) : session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-surface-100 border border-surface-200 hover:border-brand-400/50 transition-colors"
                >
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-7 h-7 bg-gradient-to-br from-brand-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {userInitial}
                    </div>
                  )}
                  <span className="hidden sm:block text-sm text-white font-medium max-w-[100px] truncate">
                    {session.user?.name?.split(" ")[0] ?? "Student"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-surface-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface-100 border border-surface-200 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-surface-200">
                      <p className="text-sm font-semibold text-white truncate">{session.user?.name}</p>
                      <p className="text-xs text-surface-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-surface-300 hover:text-white hover:bg-surface-200 transition-colors">
                      <User className="w-4 h-4" /> My Dashboard
                    </Link>
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors">
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-surface-200 z-50">
        <div className="flex items-center justify-around py-2 px-1">
          {NAV_ITEMS.slice(0, 5).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
            return (
              <Link key={href} href={href}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-0 ${isActive ? "text-brand-400" : "text-surface-400"}`}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-[9px] truncate">{label}</span>
              </Link>
            );
          })}
          {session ? (
            <button onClick={() => signOut({ callbackUrl: "/" })}
              className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-surface-400">
              <LogOut className="w-5 h-5" />
              <span className="text-[9px]">Sign Out</span>
            </button>
          ) : (
            <Link href="/auth/signin" className="flex flex-col items-center gap-0.5 px-2 py-1.5 text-surface-400">
              <LogIn className="w-5 h-5" />
              <span className="text-[9px]">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

