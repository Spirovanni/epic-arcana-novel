import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeLoadHandler } from "@/components/ThemeLoadHandler";
import { THEME_STORAGE_KEY } from "@/lib/theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Epic Arcana Novel",
  description: "A Next.js 15+ project with App Router and Tailwind CSS",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" }
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        {/* Primary meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Next.js will inject metadata from the export above */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900`}
      >
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            storageKey={THEME_STORAGE_KEY}
            disableTransitionOnChange
          >
            <ThemeLoadHandler storageKey={THEME_STORAGE_KEY} />
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
