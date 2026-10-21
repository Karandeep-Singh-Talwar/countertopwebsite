import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
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
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-[#FAF8F5]">
        {children}
      </body>
    </html>
  );
}
