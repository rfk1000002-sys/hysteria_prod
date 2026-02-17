import {
  parseMultipartForm,
  validateFileMimeType,
  validateFileSize,
} from '../../../../../lib/upload/multipart.js';
import Uploads from '../../../../../lib/upload/uploads.js';
import { respondSuccess, respondError } from '../../../../../lib/response.js';
import { requireAuthWithPermission } from '../../../../../lib/helper/permission.helper.js';

/**
 * POST /api/admin/collaboration-content/upload
 * Upload image untuk collaboration content
 */
export async function POST(req) {
  try {
    await requireAuthWithPermission(req, 'collaboration.create');

    // Parse multipart form data
    const { fields, files } = await parseMultipartForm(req, {
      maxFileSize: 5 * 1024 * 1024, // 5MB max
    });

    // Validate that image is provided
    if (!files || files.length === 0) {
      return respondError('Tidak ada file gambar yang di-upload', 400);
    }

    const imageFile = files[0];

    // Validate file mime type (hanya accept gambar)
    const allowedTypes = ['image/*'];
    if (!validateFileMimeType(imageFile, allowedTypes)) {
      return respondError('File harus berupa gambar (JPG, PNG, GIF, WebP, SVG, dll)', 400);
    }

    // Validate file size
    if (!validateFileSize(imageFile, 5 * 1024 * 1024)) {
      return respondError('Ukuran file gambar tidak boleh melebihi 5MB', 400);
    }

    // Upload menggunakan Uploads class
    const uploads = new Uploads();
    const result = await uploads.handleUpload(imageFile);

    return respondSuccess(
      {
        success: true,
        imagePath: result.url, // Path relatif seperti /uploads/2026/02/...
        metadata: result.metadata,
      },
      200
    );
  } catch (error) {
    console.error('Error uploading collaboration image:', error);
    return respondError(`Gagal upload gambar: ${error.message}`, 500);
  }
}
