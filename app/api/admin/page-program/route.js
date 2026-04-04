import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

// Fungsi helper untuk menyimpan File fisik ke folder server
async function saveFile(file) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // Penamaan unik agar tidak tertimpa
  const filename = `${Date.now()}-${file.name.replaceAll(/\s+/g, "_")}`;
  const uploadDir = path.join(process.cwd(), "public/uploads/program");
  
  // Buat folder jika belum ada
  await mkdir(uploadDir, { recursive: true });
  
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, buffer);
  
  return `/uploads/program/${filename}`;
}

export async function GET() {
  try {
    const settings = await prisma.pageProgram.findUnique({
      where: { pageSlug: "program" },
    });

    if (!settings) {
      return NextResponse.json({ mainHero: {}, covers: {}, slugHeros: {} }, { status: 200 });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("GET Page Program Error:", error);
    return NextResponse.json({ message: "Gagal mengambil data pengaturan" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    let payloadString = formData.get("payload");
    
    if (!payloadString) throw new Error("Payload tidak ditemukan");

    // Looping melalui setiap File yang dikirim dari Frontend
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file_") && typeof value === 'object' && value.name) {
        // Simpan File Fisik
        const url = await saveFile(value);
        
        // Cari Penanda (Marker) di JSON String dan Gantikan dengan URL yang baru disimpan!
        const marker = `UPLOAD_PENDING_${key.replace("file_", "")}`;
        payloadString = payloadString.replace(marker, url);
      }
    }

    // Sekarang JSON String sudah berisi Teks URL murni (Bukan File lagi)
    const { mainHero, covers, slugHeros } = JSON.parse(payloadString);

    const savedSettings = await prisma.pageProgram.upsert({
      where: { pageSlug: "program" },
      update: {
        mainHero: mainHero !== undefined ? mainHero : undefined,
        covers: covers !== undefined ? covers : undefined,
        slugHeros: slugHeros !== undefined ? slugHeros : undefined,
      },
      create: {
        pageSlug: "program",
        mainHero: mainHero || {},
        covers: covers || {},
        slugHeros: slugHeros || {},
      },
    });

    return NextResponse.json(savedSettings, { status: 200 });
  } catch (error) {
    console.error("POST Page Program Error:", error);
    return NextResponse.json({ message: "Gagal menyimpan pengaturan" }, { status: 500 });
  }
}