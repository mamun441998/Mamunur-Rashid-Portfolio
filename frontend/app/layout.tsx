import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import CommandPalette from "@/components/CommandPalette";
import Providers from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mamunur Rashid | Software Engineer & Tech Lead",
  description:
    "Full-stack software engineer specializing in scalable web applications, microservices, and system architecture.",
  keywords: [
    "Mamunur Rashid",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Engineer",
  ],
  authors: [{ name: "Mamunur Rashid" }],
  openGraph: {
    title: "Mamunur Rashid | Software Engineer",
    description: "Full-stack software engineer specializing in scalable web applications",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <AnalyticsTracker />
          <CommandPalette />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}