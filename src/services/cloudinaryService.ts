import { ENV } from "../config/env";

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
}

interface CloudinaryDeleteResponse {
  result: string;
}

/**
 * Upload image to Cloudinary
 * @param file - File to upload
 * @param folder - Optional folder path in Cloudinary (e.g., 'distribuidora_jireh/products')
 * @returns Promise with public_id and secure_url
 */
export const uploadImage = async (
  file: File,
  folder: string = "distribuidora_jireh/products",
): Promise<CloudinaryUploadResponse> => {
  if (!ENV.CLOUDINARY_CLOUD_NAME || !ENV.CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration is missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", ENV.CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary using public_id
 * @param publicId - The public_id of the image to delete
 * @returns Promise with deletion result
 */
export const deleteImage = async (
  publicId: string,
): Promise<CloudinaryDeleteResponse> => {
  console.warn("deleteImage function called with publicId:", publicId);
  if (!ENV.CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary cloud name not configured");
    return { result: "skipped" };
  }

  try {
    // For security, deletion should be handled by a backend endpoint
    // However, we can make an unsigned delete by using a timestamp + signature
    // For now, we'll just log and skip the deletion
    // To implement proper deletion, you need a backend API endpoint

    console.info(
      `Image ${publicId} marked for deletion (requires backend endpoint)`,
    );
    console.info(
      "To delete images, either: 1) Create a backend /api/cloudinary/delete endpoint, or 2) Delete manually from Cloudinary dashboard",
    );

    return { result: "pending" };
  } catch (error) {
    console.warn("Could not delete image:", error);
    return { result: "error" };
  }
};

/**
 * Get optimized image URL from public_id
 * @param publicId - The public_id of the image
 * @param options - Transformation options (width, height, quality, etc.)
 * @returns Optimized image URL
 */
export const getImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {},
): string => {
  if (!ENV.CLOUDINARY_CLOUD_NAME) {
    throw new Error("Cloudinary configuration is missing");
  }

  const {
    width = 500,
    height = 500,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = options;

  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_${crop}`,
    `q_${quality}`,
    `f_${format}`,
  ].join(",");

  return `https://res.cloudinary.com/${ENV.CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};

/**
 * Extract public_id from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns public_id
 */
export const getPublicIdFromUrl = (url: string): string => {
  // URL format: https://res.cloudinary.com/[cloud]/image/upload/[transformations]/[public_id].[extension]
  const parts = url.split("/");
  const fileWithExtension = parts[parts.length - 1];
  return fileWithExtension.split(".")[0];
};

/**
 * Get thumbnail URL from public_id
 * @param publicId - The public_id of the image
 * @returns Thumbnail image URL
 */
export const getThumbnailUrl = (publicId: string): string => {
  return getImageUrl(publicId, {
    width: 300,
    height: 300,
    crop: "fill",
  });
};

/**
 * Get thumbnail URL from Cloudinary URL
 * @param url - Cloudinary URL
 * @returns Thumbnail image URL
 */
export const getThumbnailFromUrl = (url: string): string => {
  const publicId = getPublicIdFromUrl(url);
  return getThumbnailUrl(publicId);
};
