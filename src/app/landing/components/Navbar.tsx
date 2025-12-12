"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Menu } from 'lucide-react';

const gradCTA = "bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-[#0b1220]/70 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">
        {/* Left brand */}
        <div className="flex items-center">
          <Link href="/landing" className="flex items-center group">
            <Image
              src="/images/Epic_Arcana_Logo.png"
              alt="Epic Arcana"
              width={174}
              height={58}
              className="hover:opacity-90 transition-all duration-300"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        </div>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-semibold">
          <a href="#how" className="hover:text-white/90 transition-colors tracking-wide">How it works</a>
          <a href="#world" className="hover:text-white/90 transition-colors tracking-wide">World</a>
          <a href="#community" className="hover:text-white/90 transition-colors tracking-wide">Community</a>
          <a href="#cycle" className="hover:text-white/90 transition-colors tracking-wide">Cycle</a>
          <Link href="/careers" className="hover:text-white/90 transition-colors tracking-wide">Careers</Link>
          <Link href="/personalities" className="hover:text-white/90 transition-colors tracking-wide">Personalities</Link>
          {isSignedIn && (
            <Link href="/profile" className="hover:text-white/90 transition-colors tracking-wide">Profile</Link>
          )}
          <a href="#dashboard" className="hover:text-white/90 transition-colors tracking-wide">Dashboard</a>
        </nav>

        {/* Right auth section */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isSignedIn ? (
            <>
              <Button asChild className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 rounded-full border border-border hover:border-border/60 transition-colors"
                  }
                }}
              />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  Sign In
                </Button>
              </SignInButton>
              <Button asChild className="bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                <Link href="/assessment">
                  Take Assessment
                </Link>
              </Button>
            </>
          )}
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0b1220]/95 backdrop-blur">
          <div className="px-4 py-4 space-y-4">
            <nav className="space-y-2">
              <a href="#how" className="block text-slate-300 hover:text-white/90 transition-colors">How it works</a>
              <a href="#world" className="block text-slate-300 hover:text-white/90 transition-colors">World</a>
              <a href="#community" className="block text-slate-300 hover:text-white/90 transition-colors">Community</a>
              <a href="#cycle" className="block text-slate-300 hover:text-white/90 transition-colors">Cycle</a>
              <Link href="/careers" className="block text-slate-300 hover:text-white/90 transition-colors">Careers</Link>
              <Link href="/personalities" className="block text-slate-300 hover:text-white/90 transition-colors">Personalities</Link>
              <a href="#dashboard" className="block text-slate-300 hover:text-white/90 transition-colors">Dashboard</a>
            </nav>
            <div className="pt-2 border-t border-border/20">
              {isSignedIn ? (
                <Button asChild className="w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                  <Link href="/dashboard">
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full justify-center text-muted-foreground hover:text-foreground">
                      Sign In
                    </Button>
                  </SignInButton>
                  <Button asChild className="w-full bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500 hover:from-violet-400 hover:via-indigo-400 hover:to-blue-400">
                    <Link href="/assessment">
                      Take Assessment
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
