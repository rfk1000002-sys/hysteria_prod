import { z } from 'zod';

export const contactSchema = z.object({
  mapsEmbedUrl: z
    .string()
    .url({ message: 'URL Google Maps tidak valid' })
    .min(1, { message: 'URL Google Maps wajib diisi' }),

  locationTitle: z
    .string()
    .min(1, { message: 'Judul lokasi wajib diisi' })
    .max(255, { message: 'Judul lokasi maksimal 255 karakter' }),

  locationAddress: z.string().min(1, { message: 'Alamat lokasi wajib diisi' }),

  operationalHours: z.string().min(1, { message: 'Jam operasional wajib diisi' }),

  whatsappNumber: z
    .string()
    .min(1, { message: 'Nomor WhatsApp wajib diisi' })
    .max(50, { message: 'Nomor WhatsApp maksimal 50 karakter' })
    .regex(/^[0-9+\-\s()]+$/, { message: 'Format nomor WhatsApp tidak valid' }),

  instagramUrl: z
    .string()
    .url({ message: 'URL Instagram tidak valid' })
    .optional()
    .or(z.literal('')),
  twitterUrl: z.string().url({ message: 'URL Twitter tidak valid' }).optional().or(z.literal('')),
  facebookUrl: z.string().url({ message: 'URL Facebook tidak valid' }).optional().or(z.literal('')),
  linkedinUrl: z.string().url({ message: 'URL LinkedIn tidak valid' }).optional().or(z.literal('')),
  youtubeUrl: z.string().url({ message: 'URL YouTube tidak valid' }).optional().or(z.literal('')),

  isActive: z.boolean().optional().default(false),
});

export function validateContact(data) {
  return contactSchema.parse(data);
}
