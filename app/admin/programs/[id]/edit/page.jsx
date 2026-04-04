// app/admin/programs/[id]/edit/page.jsx
import EventForm from "@/components/adminUI/Event/EventForm";
import BerkelanaForm from "@/components/adminUI/Program/BerkelanaForm"; // 👉 Panggil BerkelanaForm
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditProgramPage({ params }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  
  // 👉 PERUBAHAN: Deep include categoryItem biar kita bisa baca "slug"-nya
  const programData = await prisma.event.findUnique({
    where: { id },
    include: {
      eventCategories: { include: { categoryItem: true } }, // Wajib include ini
      organizers: { include: { categoryItem: true } }, 
      tags: { include: { tag: true } }, 
    },
  });

  if (!programData) {
    return notFound();
  }

  // 👉 LOGIKA DETEKSI: Cek apakah ada kategori bernama "hysteria-berkelana"
  const isBerkelana = programData.eventCategories?.some(
    (cat) => cat.categoryItem?.slug === 'hysteria-berkelana' || 
             cat.categoryItem?.title.toLowerCase().includes('berkelana')
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black font-poppins">Edit Postingan Program</h1>
        <p className="text-gray-600 mt-1 font-poppins">Perbarui konten program yang sudah ada</p>
      </div>
      
      {/* 👉 KONDISI OTOMATIS: Pilih form sesuai kategorinya */}
      {isBerkelana ? (
        <BerkelanaForm 
          initialData={programData} 
          isEdit={true} 
          eventId={id} 
        />
      ) : (
        <EventForm 
          initialData={programData} 
          isEdit={true} 
          eventId={id} 
          defaultType="PROGRAM"
          redirectUrl="/admin/programs"
        />
      )}
    </div>
  );
}