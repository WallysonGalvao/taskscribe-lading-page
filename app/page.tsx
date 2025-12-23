"use client";

import * as React from "react";

import {
  ContactFormDialog,
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

export default function HomePage() {
  const [contactFormOpen, setContactFormOpen] = React.useState(false);
  const { releaseAssets } = useReleaseAssets();

  const handleOpenContact = () => setContactFormOpen(true);
  const handleCloseContact = () => setContactFormOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header releaseAssets={releaseAssets} />

      <HeroSection releaseAssets={releaseAssets} />
      <PainPointsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <UseCasesSection />
      <SecuritySection />
      <PricingSection />
      <FaqSection onContactClick={handleOpenContact} />
      <CtaSection releaseAssets={releaseAssets} />

      <Footer onContactClick={handleOpenContact} />

      <ContactFormDialog
        isOpen={contactFormOpen}
        onClose={handleCloseContact}
      />
    </div>
  );
}
