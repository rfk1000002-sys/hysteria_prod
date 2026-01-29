"use client";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ContactHero from "../../components/contact/ContactHero";
import ContactInfoCards from "../../components/contact/ContactInfoCards";
import ContactMap from "../../components/contact/ContactMap";
import SocialMediaSection from "../../components/contact/SocialMediaSection";
import ContactCTA from "../../components/contact/ContactCTA";

export default function KontakPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      
      {/* CONTENT */}
      <main >
        <div className="mx-auto max-w-6xl px-6">
        <ContactHero />
        <ContactInfoCards />
        <ContactMap />
        <SocialMediaSection />
        </div>
        <ContactCTA />
      </main>

    </div>
  );
}
