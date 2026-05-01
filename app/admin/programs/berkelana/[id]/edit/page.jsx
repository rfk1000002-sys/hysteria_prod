// app/admin/programs/berkelana/[id]/edit/page.jsx
import BerkelanaForm from "@/components/adminUI/Program/BerkelanaForm"; // Sesuaikan path ini jika berbeda
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditBerkelanaPage({ params }) {
  // Await params untuk Next.js 15+
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  // Ambil data langsung dari database berdasarkan ID
  const data = await prisma.berkelanaPost.findUnique({
    where: { id },
    include: { 
      tags: { include: { tag: true } } 
    }
  });

  // Jika data tidak ada di database, tampilkan 404
  if (!data) {
    return notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Panggil komponen form dengan mode edit (isEdit = true) */}
      <BerkelanaForm 
        isEdit={true} 
        initialData={data} 
        eventId={id} 
      />
    </div>
  );
}