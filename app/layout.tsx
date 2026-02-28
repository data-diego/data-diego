import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  icons: {
    icon: "/icon.png",
  },
  title: {
    default: "Diego Valenzuela - Software Engineer",
    template: "%s | Diego Valenzuela",
  },
  description:
    "Software engineer based in Santiago de Chile. Building things with code.",
  metadataBase: new URL("https://datadiego.com"),
  openGraph: {
    title: "Diego Valenzuela - Software Engineer",
    description:
      "Software engineer based in Santiago de Chile. Building things with code.",
    url: "https://datadiego.com",
    siteName: "datadiego.com",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Diego Valenzuela - Software Engineer",
    description:
      "Software engineer based in Santiago de Chile. Building things with code.",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://datadiego.com/feed.xml",
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
        >
          <ThemeProvider>
            <ConvexClientProvider>
              <Navbar />
              <main className="flex-1 pt-14">{children}</main>
              <Footer />
              <Toaster />
            </ConvexClientProvider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
