import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Prompt Library — YOUR NAME",
  description: "AI-generated fashion print visuals with prompts, models, parameters and color palettes. Click to copy, download and explore.",
};

export default function PromptLibraryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
