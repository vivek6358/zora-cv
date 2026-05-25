import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { SocialProof } from "@/components/landing/SocialProof";
import { Features } from "@/components/landing/Features";
import { InteractiveShowcase } from "@/components/landing/InteractiveShowcase";
import { AtsShowcase } from "@/components/landing/AtsShowcase";
import { TemplateShowcase } from "@/components/landing/TemplateShowcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

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
