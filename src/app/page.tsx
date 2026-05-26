import dynamic from "next/dynamic";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProof } from "@/components/landing/SocialProof";

// Below-fold sections — deferred so they don't block initial render
const Features = dynamic(
  () => import("@/components/landing/Features").then((m) => ({ default: m.Features })),
  { ssr: true }
);
const InteractiveShowcase = dynamic(
  () => import("@/components/landing/InteractiveShowcase").then((m) => ({ default: m.InteractiveShowcase })),
  { ssr: true }
);
const AtsShowcase = dynamic(
  () => import("@/components/landing/AtsShowcase").then((m) => ({ default: m.AtsShowcase })),
  { ssr: true }
);
const TemplateShowcase = dynamic(
  () => import("@/components/landing/TemplateShowcase").then((m) => ({ default: m.TemplateShowcase })),
  { ssr: true }
);
const HowItWorks = dynamic(
  () => import("@/components/landing/HowItWorks").then((m) => ({ default: m.HowItWorks })),
  { ssr: true }
);
const Testimonials = dynamic(
  () => import("@/components/landing/Testimonials").then((m) => ({ default: m.Testimonials })),
  { ssr: true }
);
const Faq = dynamic(
  () => import("@/components/landing/Faq").then((m) => ({ default: m.Faq })),
  { ssr: true }
);
const FinalCta = dynamic(
  () => import("@/components/landing/FinalCta").then((m) => ({ default: m.FinalCta })),
  { ssr: true }
);
const Footer = dynamic(
  () => import("@/components/landing/Footer").then((m) => ({ default: m.Footer })),
  { ssr: true }
);

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <Features />
      <InteractiveShowcase />
      <AtsShowcase />
      <TemplateShowcase />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  );
}
