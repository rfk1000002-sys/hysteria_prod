"use client";

// 👉 PANGGIL KOMPONEN DARI FOLDER EVENT TEMANMU
import EventForm from "@/components/adminUI/Event/EventForm"; 
import { useRouter } from "next/navigation";
import { useAuthState } from "@/lib/context/auth-context";
import { useEffect } from "react";

export default function CreateProgramPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthState();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/auth/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <div className="p-6 bg-gray-50 min-h-screen">Memuat...</div>;
  if (!isAuthenticated) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-black font-poppins">Tambah Postingan Program</h1>
      <p className="text-sm text-gray-500 mb-6 font-poppins">
        Buat konten program baru untuk dipublikasikan
      </p>
      
      {/* 👉 KITA PINJAM FORM EVENT, TAPI KASIH IDENTITAS "PROGRAM" */}
      <EventForm defaultType="PROGRAM" redirectUrl="/admin/programs" />
    </div>
  );
}