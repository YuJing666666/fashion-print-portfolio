import type { Metadata } from "next";
import "./globals.css";

const themeScript = `(function(){try{var saved=localStorage.getItem('portfolio-theme');var theme=saved==='dark'||saved==='light'?saved:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://acid-pattern-lab.yujing01.chatgpt.site"),
  title: "YOUR NAME — Fashion Print Designer / 服装图案设计师",
  description: "A bilingual portfolio and concept case archive for fashion print, graphic design and illustration. 服装图案、平面与插画设计作品集。",
  keywords: ["fashion print designer", "服装图案设计", "graphic design", "illustration", "textile print portfolio"],
  openGraph: {
    title: "YOUR NAME — Fashion Print Designer",
    description: "24 concept studies across fashion print, graphics and illustration.",
    type: "website",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "YOUR NAME fashion print portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "YOUR NAME — Fashion Print Designer",
    description: "24 concept studies across fashion print, graphics and illustration.",
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Caveat:wght@700&display=swap" rel="stylesheet" /><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head><body>{children}</body></html>;
}
