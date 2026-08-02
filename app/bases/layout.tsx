import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Womenswear Garment Bases — YOUR NAME",
  description: "A centered 16:9 library of unprinted conceptual womenswear garment bases for fashion print application.",
};

export default function GarmentBasesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
