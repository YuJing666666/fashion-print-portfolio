import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visual Gallery — YOUR NAME",
  description: "A masonry gallery wall of fashion print designs, illustrations and visual experiments. Hover to focus, click to view full image.",
};

export default function GalleryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
