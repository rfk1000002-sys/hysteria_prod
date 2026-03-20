import Hero from "../_sectionComponents/halaman_utama/Hero";
import SorotanEvent from "../_sectionComponents/halaman_utama/sorotan_event";
import PlatformKami from "../_sectionComponents/halaman_utama/platform_kami";
import ArtikelHysteria from "../_sectionComponents/halaman_utama/artikel_hysteria";
import Colaboration from "../_sectionComponents/halaman_utama/colaboration";
import { getPublicWebsiteInfo } from "../modules/admin/websiteInfo/index.js";
import { withWebsiteInfoDefaults } from "../lib/defaults/website-info.js";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const info = withWebsiteInfoDefaults(await getPublicWebsiteInfo());
  return {
    title: { absolute: info.judul },
    description: info.deskripsi,
  };
}

// export const metadata = {
//   title: { absolute: "test" },
//   description: "Hysteria adalah ruang kolektif seni, riset, dan budaya yang berbasis di Semarang.",
// };

export default async function Home() {
  return (
    <div className="flex flex-col bg-white text-zinc-900 font-sans dark:bg-white dark:text-zinc-900">
      <Hero />
      <SorotanEvent />
      <PlatformKami />
      <ArtikelHysteria />
      <Colaboration />
    </div>
  );
}
