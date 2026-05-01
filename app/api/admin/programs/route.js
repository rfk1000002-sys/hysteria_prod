// app/api/admin/programs/route.js
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.event.findMany({
      where: {
        eventCategories: {
          some: {
            categoryItem: {
              slug: {
                // 👉 PERUBAHAN: "hysteria-berkelana" SUDAH DIHAPUS DARI DAFTAR INI
                in: [
                  "program-hysteria",
                  "festival-dan-pameran", "festival-kampung", "festival-kota", "biennale",
                  "gebyuran-bustaman", "nginguk-githok", "festival-bukit-jatiwayang", 
                  "sobo-roworejo", "srawung-sendang", "festival-ngijo", "banyu-pitu", 
                  "bulusan-fest", "labuhan-kali", "iki-buntu-fest", "festival-ke-tugu",
                  "zine-fest", "semarang-writers-week", "city-canvas", "dokumentaria",
                  "pentak-labs", "tengok-bustaman",
                  "forum", "temu-jejaring", "buah-tangan", "lawatan-jalan-terus", "simposium", "meditasi",
                  "music", "sgrt", "kotak-listrik", "die-gital", "bunyi-halaman-belakang", "folk-me-up",
                  "residensi-dan-workshop", "flash-residency", "kandang-tandang",
                  "podcast", "safari-memori", "aston", "sore-di-stonen",
                  "pemutaran-film", "screening-am-film", "lawatan-bandeng-keliling-film",
                  "video-series", "sapa-warga" 
                ]
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      include: {
        eventCategories: {
          include: { categoryItem: true },
        },
        organizers: {
          include: { categoryItem: true },
        }
      },
    });

    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    console.error("🔥 ERROR PRISMA GET PROGRAM:", error);
    return NextResponse.json(
      { error: "Gagal: " + error.message },
      { status: 500 }
    );
  }
}