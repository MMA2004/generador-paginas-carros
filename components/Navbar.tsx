"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, ShieldCheck } from "lucide-react";

export function Navbar() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black font-bold">
              G
            </div>
            <span className="text-xl font-semibold tracking-tight text-white hidden sm:inline-block">
              Gibra Pages
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/dashboard" className="flex items-center gap-2 hover:text-white transition-colors">
              <LayoutDashboard size={16} />
              Dashboard
            </Link>
            {isAdmin && (
               <Link href="/admin" className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                 <ShieldCheck size={16} />
                 Admin
               </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-9 w-9 ring-2 ring-white/20 hover:ring-white/50 transition-all"
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}
