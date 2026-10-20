import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VERONA Stone & Tile | Luxury Countertops, Slabs & Architectural Tile",
  description: "Discover high-quality kitchen and bathroom countertops. Browse by material (Quartz, Porcelain, Marble, Quartzite) or color. Book a free 15-minute design call or request an itemized email quote.",
  keywords: "countertops, quartz countertops, marble slabs, quartzite, porcelain slabs, kitchen remodel, tile, backsplash tile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${playfairDisplay.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900 font-sans selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
