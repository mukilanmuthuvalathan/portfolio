import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://mukilangenai.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mukilan Muthuvalathan | GenAI Developer",
    template: "%s | Mukilan Muthuvalathan",
  },
  description: "Portfolio of Mukilan Muthuvalathan, a Generative AI developer building intelligent applications with LLMs, multimodal AI, RAG, fine-tuning, and AI agents.",
  keywords: ["Mukilan Muthuvalathan", "Mukilan GenAI Developer", "Generative AI Developer", "LLM Developer", "RAG Developer", "Multimodal AI", "AI Agents"],
  authors: [{ name: "Mukilan Muthuvalathan", url: siteUrl }],
  creator: "Mukilan Muthuvalathan",
  publisher: "Mukilan Muthuvalathan",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    title: "Mukilan Muthuvalathan | GenAI Developer",
    description: "Generative AI developer building useful products with LLMs, multimodal AI, retrieval systems, fine-tuning, and autonomous agents.",
    siteName: "Mukilan Muthuvalathan Portfolio",
    locale: "en_IN",
    firstName: "Mukilan",
    lastName: "Muthuvalathan",
    images: [{ url: "/mukilan-profile.png", width: 1450, height: 1086, alt: "Mukilan Muthuvalathan, Generative AI Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mukilan Muthuvalathan | GenAI Developer",
    description: "Generative AI developer building with LLMs, multimodal AI, RAG, fine-tuning, and AI agents.",
    images: ["/mukilan-profile.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    url: siteUrl,
    name: "Mukilan Muthuvalathan | GenAI Developer",
    description: "Portfolio of Mukilan Muthuvalathan, a Generative AI developer.",
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/#mukilan`,
      name: "Mukilan Muthuvalathan",
      jobTitle: "Generative AI Developer",
      description: "Generative AI developer working with LLMs, multimodal AI, RAG, fine-tuning, and AI agents.",
      image: `${siteUrl}/mukilan-profile.png`,
      url: siteUrl,
      email: "mailto:mukilanmuthuvalathan01@gmail.com",
      sameAs: ["https://github.com/mukilanmuthuvalathan", "https://www.linkedin.com/in/mukilan-muthuvalathan/", "https://www.instagram.com/mukilan_46_08/"],
      knowsAbout: ["Generative AI", "Large Language Models", "Retrieval-Augmented Generation", "Multimodal AI", "AI Agents", "Fine-tuning"],
    },
  };

  return (
    <html lang="en-IN">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        {children}
      </body>
    </html>
  );
}