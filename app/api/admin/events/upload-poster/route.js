import { NextResponse } from "next/server";
import Uploads from "../../../../../lib/upload/uploads";
import sharp from "sharp";

export const runtime = "nodejs";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 3 * 1024 * 1024; // 3MB
const REQUIRED_RATIO = 4 / 5; // 0.8

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { message: "Poster wajib diupload" },
        { status: 400 }
      );
    }

    // ===== VALIDASI MIME =====
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Format file harus JPG, PNG, atau WEBP" },
        { status: 400 }
      );
    }

    // ===== VALIDASI SIZE =====
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { message: "Ukuran maksimal poster 3 MB" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ===== VALIDASI DIMENSI & RASIO =====
    const image = sharp(buffer);
    const meta = await image.metadata();

    if (!meta.width || !meta.height) {
      return NextResponse.json(
        { message: "Gagal membaca dimensi gambar" },
        { status: 400 }
      );
    }

    const ratio = meta.width / meta.height;
    if (Math.abs(ratio - REQUIRED_RATIO) > 0.01) {
      return NextResponse.json(
        {
          message:
            "Rasio poster harus 4:5 (contoh 800 × 1000 px)",
        },
        { status: 400 }
      );
    }

    // ===== UPLOAD =====
    const uploader = new Uploads();
    const result = await uploader.handleUpload({
      buffer,
      originalFilename: file.name,
      mimetype: file.type,
      size: file.size,
    });

    return NextResponse.json({
      url: result.url,
      path: result.path,
      metadata: {
        width: meta.width,
        height: meta.height,
        size: file.size,
      },
    });
  } catch (err) {
    console.error("UPLOAD POSTER ERROR:", err);
    return NextResponse.json(
      { message: "Server error saat upload poster" },
      { status: 500 }
    );
  }
}