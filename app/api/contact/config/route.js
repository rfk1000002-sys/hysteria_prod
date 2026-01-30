import { NextResponse } from "next/server";
import { respondSuccess, respondError } from "../../../../lib/response";
import logger from "../../../../lib/logger.js";
import { prisma } from "../../../../lib/prisma.js";

// POST - Update contact configuration
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      whatsappNumber,
      locationTitle,
      locationAddress,
      operationalHours,
      instagramUrl,
      twitterUrl,
      facebookUrl,
      linkedinUrl,
      youtubeUrl,
      mapsEmbedUrl,
    } = body;

    // Validasi nomor WhatsApp
    if (whatsappNumber && !/^\d{10,}$/.test(whatsappNumber.replace(/[^0-9]/g, ""))) {
      return respondError("Nomor WhatsApp tidak valid", 400);
    }

    // Cari atau buat contact section yang aktif
    let contact = await prisma.contactSection.findFirst({
      where: { isActive: true },
    });

    if (!contact) {
      // Jika tidak ada, buat baru
      contact = await prisma.contactSection.create({
        data: {
          whatsappNumber: whatsappNumber || "628121272483",
          locationTitle: locationTitle || "Lokasi Kami",
          locationAddress: locationAddress || "Indonesia",
          operationalHours: operationalHours || "09:00 - 18:00",
          mapsEmbedUrl: mapsEmbedUrl || "https://www.google.com/maps/embed",
          instagramUrl,
          twitterUrl,
          facebookUrl,
          linkedinUrl,
          youtubeUrl,
          isActive: true,
        },
      });
    } else {
      // Update yang sudah ada
      contact = await prisma.contactSection.update({
        where: { id: contact.id },
        data: {
          whatsappNumber: whatsappNumber || contact.whatsappNumber,
          locationTitle: locationTitle || contact.locationTitle,
          locationAddress: locationAddress || contact.locationAddress,
          operationalHours: operationalHours || contact.operationalHours,
          mapsEmbedUrl: mapsEmbedUrl || contact.mapsEmbedUrl,
          instagramUrl: instagramUrl !== undefined ? instagramUrl : contact.instagramUrl,
          twitterUrl: twitterUrl !== undefined ? twitterUrl : contact.twitterUrl,
          facebookUrl: facebookUrl !== undefined ? facebookUrl : contact.facebookUrl,
          linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : contact.linkedinUrl,
          youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : contact.youtubeUrl,
          updatedAt: new Date(),
        },
      });
    }

    logger.info("Contact configuration updated", { id: contact.id });

    return respondSuccess(
      {
        contact,
        message: "Konfigurasi kontak berhasil diperbarui",
      },
      200
    );
  } catch (error) {
    console.error("Error updating contact config:", error);
    logger.error("POST /api/contact/config error:", {
      error: error.message,
      stack: error.stack,
    });

    return respondError("Gagal memperbarui konfigurasi kontak", 500);
  }
}
