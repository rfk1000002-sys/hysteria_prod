"use client";

import { useState, useEffect } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ContactHero from "../../components/contact/ContactHero";
import ContactInfoCards from "../../components/contact/ContactInfoCards";
import ContactMap from "../../components/contact/ContactMap";
import SocialMediaSection from "../../components/contact/SocialMediaSection";
import ContactCTA from "../../components/contact/ContactCTA";

export default function KontakPage() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContact() {
      try {
        const res = await fetch('/api/contact');
        const json = await res.json();
        if (json?.success && json.data?.contact) {
          setContactData(json.data.contact);
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchContact();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E93C8E] mx-auto"></div>
          <p className="mt-4 text-zinc-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      
      {/* CONTENT */}
      <main >
        <div className="mx-auto max-w-6xl px-6">
        <ContactHero />
        <ContactInfoCards contactData={contactData} />
        <ContactMap contactData={contactData} />
        <SocialMediaSection contactData={contactData} />
        </div>
        <ContactCTA contactData={contactData} />
      </main>

    </div>
  );
}
