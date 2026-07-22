import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mukilan Muthuvalathan - GenAI Developer",
  description: "GenAI developer building intelligent products with LLMs, multimodal AI, RAG, and agents.",
  keywords: ["Mukilan Muthuvalathan", "GenAI Developer", "LLM", "RAG", "AI Agents"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

