import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://acid-pattern-lab.yujing01.chatgpt.site"),
  title: "YOUR NAME — Pattern Designer / 图案设计师",
  description: "A bilingual portfolio for fashion print, graphic design and illustration. 服装图案、平面与插画设计作品集。",
  keywords: ["fashion pattern design", "服装图案设计", "graphic design", "illustration", "textile print"],
  openGraph: { title: "YOUR NAME — Fashion Print Designer", description: "Fashion print, graphic design and illustration portfolio.", type: "website" },
  twitter: { card: "summary", title: "YOUR NAME — Fashion Print Designer", description: "Fashion print, graphic design and illustration portfolio." },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
