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
  title: "VERONA Surfaces | Luxury Porcelain Countertops & Architectural Vitrified Tiles",
  description: "Discover contractor-friendly 9mm vitrified porcelain slabs and matching large-format tiles. Cut on-site with standard diamond wet saws. Book a free consultation or request an instant quote.",
  keywords: "porcelain countertops, vitrified porcelain slabs, porcelain tiles, kitchen remodel, 9mm porcelain, bathroom tiles, backsplash tiles, large format tiles",
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
