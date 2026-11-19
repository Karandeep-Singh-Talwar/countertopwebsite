import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { VeronaVisualizerLauncher } from "@/components/verona-visualizer-launcher";
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
  title: "VERONA Surfaces | Luxury Architectural Countertops, Wall Surfaces & Flooring",
  description: "Curated architectural surfaces and slabs across vitrified porcelain, natural granite, engineered quartz, and metamorphic quartzite for luxury countertops, backsplashes, and flooring.",
  keywords: "porcelain countertops, quartzite slabs, granite countertops, quartz surfaces, architectural tiles, kitchen islands, backsplash tiles, large format tiles",
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
        <VeronaVisualizerLauncher />
      </body>
    </html>
  );
}
