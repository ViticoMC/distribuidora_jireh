import crypto from "crypto";

/**
 * Backend endpoint para eliminar imágenes de Cloudinary
 * Este archivo es un EJEMPLO de cómo implementar la eliminación de imágenes
 *
 * INSTRUCCIONES DE IMPLEMENTACIÓN:
 * 1. Si usas un backend Node.js/Express, copia este código
 * 2. Coloca este endpoint en tu servidor backend
 * 3. El frontend hará POST a tu endpoint en lugar de a Cloudinary directamente
 *
 * CONFIGURACIÓN EN .env:
 * CLOUDINARY_CLOUD_NAME=tu_cloud_name
 * CLOUDINARY_API_KEY=tu_api_key
 * CLOUDINARY_API_SECRET=tu_api_secret
 */

/**
 * Endpoint para eliminar imágenes de Cloudinary
 * POST /api/cloudinary/delete
 * Body: { public_id: "fotografía_del_producto" }
 */

export async function deleteImageFromCloudinary(publicId) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials missing");
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);

    // Crear signature
    const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    // Hacer request a Cloudinary
    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`,
      {
        method: "DELETE",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Cloudinary API returned ${response.status}`);
    }

    const result = await response.json();
    console.log("Image deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
}

/**
 * EJEMPLO CON EXPRESS:
 *
 * import express from 'express';
 * import { deleteImageFromCloudinary } from './cloudinary';
 *
 * const app = express();
 * app.use(express.json());
 *
 * app.post('/api/cloudinary/delete', async (req, res) => {
 *   try {
 *     const { public_id } = req.body;
 *
 *     if (!public_id) {
 *       return res.status(400).json({ error: 'public_id required' });
 *     }
 *
 *     const result = await deleteImageFromCloudinary(public_id);
 *     res.json(result);
 *   } catch (error) {
 *     console.error('Delete failed:', error);
 *     res.status(500).json({ error: 'Failed to delete image' });
 *   }
 * });
 */
