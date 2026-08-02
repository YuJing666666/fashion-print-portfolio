import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://acid-pattern-lab.yujing01.chatgpt.site"),
  title: "YOUR NAME — Pattern Designer / 图案设计师",
  description: "An acid-colored visual lab for fashion pattern, graphic design and illustration. 酸性色彩服装图案、平面与插画设计作品集。",
  keywords: ["fashion pattern design", "服装图案设计", "graphic design", "illustration", "textile print"],
  openGraph: { title: "YOUR NAME — Wear The Weird", description: "Fashion pattern, graphics and illustration from an ever-mutating visual lab.", type: "website", images: [{ url: "/og.png", width: 1734, height: 908, alt: "Wear The Weird — YOUR NAME, Pattern Designer" }] },
  twitter: { card: "summary_large_image", title: "YOUR NAME — Wear The Weird", description: "Fashion pattern, graphics and illustration.", images: ["/og.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body></html>;
}
