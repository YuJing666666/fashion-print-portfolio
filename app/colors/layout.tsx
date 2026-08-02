import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Archive — YOUR NAME",
  description: "A color palette archive of all concept studies — hex codes, names and usage across fashion print projects.",
};

export default function ColorLibraryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
