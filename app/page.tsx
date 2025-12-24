"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import {
  CtaSection,
  FaqSection,
  FeaturesSection,
  Footer,
  Header,
  HeroSection,
  HowItWorksSection,
  PainPointsSection,
  PricingSection,
  SecuritySection,
  UseCasesSection,
  useReleaseAssets,
} from "./components";

// Lazy load ContactFormDialog (only loaded when user clicks contact button)
const ContactFormDialog = dynamic(
  () => import("./components/forms/contact-form-dialog").then((mod) => ({ default: mod.ContactFormDialog })),
  { ssr: false }
);

export default function HomePage() {
  const [contactFormOpen, setContactFormOpen] = React.useState(false);
  const { releaseAssets } = useReleaseAssets();

  const handleOpenContact = () => setContactFormOpen(true);
  const handleCloseContact = () => setContactFormOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header releaseAssets={releaseAssets} />

      <main className="pt-16">
        <HeroSection releaseAssets={releaseAssets} />
        <PainPointsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <UseCasesSection />
        <SecuritySection />
        <PricingSection />
        <FaqSection onContactClick={handleOpenContact} />
        <CtaSection releaseAssets={releaseAssets} />
      </main>

      <Footer onContactClick={handleOpenContact} />

      <ContactFormDialog
        isOpen={contactFormOpen}
        onClose={handleCloseContact}
      />
    </div>
  );
}
