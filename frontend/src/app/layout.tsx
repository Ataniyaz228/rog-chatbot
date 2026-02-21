import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import Script from "next/script";
import CursorHalo from "@/components/CursorHalo";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RAG Chatbot — AI Document Assistant",
  description:
    "Upload documents and ask questions about their content using AI-powered RAG technology. Supports PDF, DOCX, TXT, CSV, and more.",
  keywords: ["RAG", "chatbot", "AI", "document", "search", "Groq", "Llama"],
  openGraph: {
    title: "RAG Chatbot — AI Document Assistant",
    description: "AI-powered document analysis and question answering",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Load Three.js then Vanta.js globally */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js" strategy="beforeInteractive" />
      </head>
      <body className={`${outfit.variable} antialiased`}>
        {/* Vanta Target Container */}
        <div id="vanta-bg-container" className="fixed inset-0 z-0 bg-black pointer-events-none" />

        {/* Ambient Glow Spots */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-900/10 rounded-full blur-[120px] animate-glow-slow" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-600/5 rounded-full blur-[150px] animate-glow-slower" />
        </div>

        {/* Contrast Overlay - Brighter for cosmic effect */}
        <div className="fixed inset-0 bg-black/30 pointer-events-none z-0" />
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-0" />

        {/* Initialization Script */}
        <Script id="vanta-init" strategy="afterInteractive">
          {`
            // Wait slightly for DOM and scripts to be ready
            setTimeout(() => {
              if (window.VANTA && window.VANTA.WAVES) {
                window.VANTA.WAVES({
                  el: "#vanta-bg-container",
                  mouseControls: true,
                  touchControls: true,
                  gyroControls: false,
                  minHeight: 200.00,
                  minWidth: 200.00,
                  scale: 1.00,
                  scaleMobile: 1.00,
                  color: 0x080808,
                  backgroundColor: 0x000000,
                  shininess: 50.00,
                  waveHeight: 20.00,
                  waveSpeed: 0.60
                });
              }
            }, 500);
          `}
        </Script>

        {/* Disabled heavy overlays to improve performance with 3D background */}
        {/* <CursorHalo /> */}
        {/* <div className="noise-overlay pointer-events-none" /> */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
