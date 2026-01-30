const { PrismaClient } = require('@prisma/client');
const logger = require('../../lib/logger');

const prisma = new PrismaClient();

/**
 * Seed initial contact data
 */
async function seedContact() {
  logger.info('Seeding contact data...');

  try {
    // Check if contact already exists
    const existingContact = await prisma.contactSection.findFirst();

    if (existingContact) {
      logger.info('Contact data already exists, skipping seed');
      return;
    }

    // Create initial contact data
    const contact = await prisma.contactSection.create({
      data: {
        mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.9026038306443!2d110.408!3d-7.045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708b0000000000%3A0x0000000000000000!2sSemarang!5e0!3m2!1sid!2sid!4v0000000000',
        locationTitle: 'Gerobak Artkos x Hysteria',
        locationAddress: 'Jl. Stonen No.29, Bendan Ngisor, Kec. Gajahmungkur,\nKota Semarang, Jawa Tengah 50233',
        operationalHours: 'Senin - Jumat: 09:00 - 17:00 WIB\nSabtu: 10:00 - 15:00 WIB\nMinggu & Libur: Tutup',
        whatsappNumber: '+62812127248',
        instagramUrl: 'https://instagram.com/grobakhysteria',
        twitterUrl: 'https://twitter.com/grobakhysteria',
        facebookUrl: 'https://facebook.com/kolektifhysteria',
        youtubeUrl: 'https://youtube.com/@kolektifhysteria',
        linkedinUrl: '',
        isActive: true,
      },
    });

    logger.info('Contact data seeded successfully', { id: contact.id });
  } catch (error) {
    logger.error('Error seeding contact:', { error: error.message });
    throw error;
  }
}

module.exports = seedContact;
