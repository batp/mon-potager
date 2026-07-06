import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { BottomNav } from "@/components/shared/BottomNav";
import { PlaceholderBanner } from "@/components/shared/PlaceholderBanner";
import { SidebarNav } from "@/components/shared/SidebarNav";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Mon Potager",
  description: "Cultiver, partager, s'entraider",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Mon Potager",
  },
};

export const viewport: Viewport = {
  themeColor: "#4A7C59",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${nunito.variable} min-h-dvh font-sans antialiased`}>
        <Providers>
          <PlaceholderBanner />
          <div className="mx-auto flex min-h-dvh max-w-6xl">
            <SidebarNav />
            <div className="flex min-h-dvh flex-1 flex-col">
              <main className="flex-1 px-4 pb-24 pt-4 md:pb-8">{children}</main>
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
