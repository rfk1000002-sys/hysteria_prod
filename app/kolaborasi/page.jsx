import CollaborationHero from '../../_sectionComponents/kolaborasi/CollaborationHero';
import WhyCollaborate from '../../_sectionComponents/kolaborasi/WhyCollaborate';
import CollaborationSchemes from '../../_sectionComponents/kolaborasi/CollaborationSchemes';
import CollaborationFlow from '../../_sectionComponents/kolaborasi/CollaborationFlow';
import CollaborationWhatsApp from '../../_sectionComponents/kolaborasi/CollaborationWhatsApp';

export const metadata = {
  title: 'Kolaborasi | Hysteria',
};

async function getCollaborationContent() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/collaboration-content`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch collaboration content');
    }

    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Error fetching collaboration content:', error);
    return null;
  }
}

export default async function KolaborasiPage() {
  const content = await getCollaborationContent();

  // Fallback content jika data tidak ada
  const defaultContent = {
    heroTitle: 'Mari Berkolaborasi',
    heroDescription:
      'Kami membuka ruang kolaborasi bagi individu, komunitas, dan institusi yang ingin menciptakan program, event, dan inisiatif berdampak bersama.',
    googleFormUrl: '#form-kolaborasi',
    ctaDescription: 'Isi formulir untuk mengajukan proposal kolaborasi dengan tim kami',
    whyBenefits: [
      {
        title: 'Tim Profesional',
        description: 'Bergabung dengan tim yang berpengalaman dan berdedikasi',
        imageUrl: '',
      },
      {
        title: 'Jaringan Luas',
        description: 'Akses ke jaringan komunitas dan partnership yang kuat',
        imageUrl: '',
      },
      {
        title: 'Dukungan Penuh',
        description: 'Mendapat dukungan penuh dalam setiap tahap kolaborasi',
        imageUrl: '',
      },
    ],
    schemes: [
      {
        title: 'Event Partnership',
        description: 'Kolaborasi dalam penyelenggaraan event dan aktivitas',
        imageUrl: '',
      },
      {
        title: 'Content Collaboration',
        description: 'Berkolaborasi dalam pembuatan konten berkualitas',
        imageUrl: '',
      },
      {
        title: 'Research Partnership',
        description: 'Kerjasama dalam riset dan pengembangan program',
        imageUrl: '',
      },
    ],
    flowSteps: [
      {
        step: '1',
        title: 'Pengajuan Proposal',
        description: 'Ajukan proposal kolaborasi melalui formulir kami',
        imageUrl: '',
      },
      {
        step: '2',
        title: 'Review Tim',
        description: 'Tim kami akan melakukan review dalam 3-5 hari kerja',
        imageUrl: '',
      },
      {
        step: '3',
        title: 'Diskusi & Finalisasi',
        description: 'Diskusi detail dan finalisasi program bersama',
        imageUrl: '',
      },
      {
        step: '4',
        title: 'Eksekusi',
        description: 'Jalankan program kolaborasi sesuai kesepakatan',
        imageUrl: '',
      },
    ],
  };

  const data = content || defaultContent;

  return (
    <main className="bg-white">
      <CollaborationHero
        title={data.heroTitle}
        description={data.heroDescription}
        googleFormUrl={data.googleFormUrl}
        ctaDescription={data.ctaDescription}
      />
      <WhyCollaborate title="Mengapa Berkolaborasi dengan Kami?" benefits={data.whyBenefits} />
      <CollaborationSchemes title="Skema Kolaborasi" schemes={data.schemes} />
      <CollaborationFlow title="Alur Kolaborasi" steps={data.flowSteps} />
      <CollaborationWhatsApp />
    </main>
  );
}
