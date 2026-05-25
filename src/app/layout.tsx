import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/NextAuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZoraCV — AI-Powered Resume Builder That Gets You Hired",
  description:
    "Build ATS-optimized, interview-winning resumes in minutes with AI. Trusted by 500,000+ professionals. Try ZoraCV free.",
  keywords: "resume builder, AI resume, ATS score, CV builder, job application",
  openGraph: {
    title: "ZoraCV — AI-Powered Resume Builder",
    description: "Build ATS-optimized resumes in minutes with AI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <NextAuthProvider>
          {children}
          <Toaster position="top-right" richColors />
        </NextAuthProvider>
      </body>
    </html>
  );
}
