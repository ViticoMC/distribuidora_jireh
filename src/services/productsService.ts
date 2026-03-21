import { supabase } from "@/config/supabase";
import { deleteImage, getPublicIdFromUrl } from "./cloudinaryService";

interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  weight?: number;
  active?: boolean;
  discount?: number;
  category_id: number;
  img_id?: string;
  ima_url?: string;
}

/**
 * Obtener todos los productos
 */
export async function getProducts() {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Obtener un producto por ID
 */
export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("product")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Crear un nuevo producto
 */
export async function createProduct(product: CreateProductData) {
  const { data, error } = await supabase
    .from("product")
    .insert([product])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Crear múltiples productos
 */
export async function createProducts(products: CreateProductData[]) {
  const { data, error } = await supabase
    .from("product")
    .insert(products)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Eliminar un producto por ID (incluyendo imagen de Cloudinary)
 */
export async function deleteProduct(id: string) {
  try {
    // Obtener el producto para acceder a la URL de imagen
    const product = await getProductById(id);

    // Eliminar imagen de Cloudinary si existe
    if (product?.ima_url) {
      try {
        const publicId = getPublicIdFromUrl(product.ima_url);
        await deleteImage(publicId);
      } catch (err) {
        console.warn("Could not delete Cloudinary image:", err);
        // Continuar con la eliminación del producto aunque falle la imagen
      }
    }
  } catch (err) {
    console.warn("Could not fetch product details for deletion:", err);
    // Continuar con la eliminación aunque no podamos obtener los detalles
  }

  const { error } = await supabase.from("product").delete().eq("id", id);

  if (error) {
    // Crear un error con la información completa del error de Supabase
    const customError = new Error(error.message);
    (customError as any).code = error.code;
    (customError as any).details = error.details;
    throw customError;
  }
}

/**
 * Actualizar un producto (incluyendo gestión de imagen Cloudinary)
 */
export async function updateProduct(
  id: string,
  product: Partial<CreateProductData>,
) {
  try {
    // Si se está actualizando la imagen, eliminar la anterior de Cloudinary
    if (product.ima_url) {
      const currentProduct = await getProductById(id);
      if (
        currentProduct?.ima_url &&
        currentProduct.ima_url !== product.ima_url
      ) {
        try {
          const publicId = getPublicIdFromUrl(currentProduct.ima_url);
          await deleteImage(publicId);
        } catch (err) {
          console.warn("Could not delete old Cloudinary image:", err);
          // Continuar con actualización aunque falle la eliminación de imagen anterior
        }
      }
    }
  } catch (err) {
    console.warn("Could not manage image during update:", err);
    // Continuar con actualización aunque ocurra error en gestión de imagen
  }

  const { data, error } = await supabase
    .from("product")
    .update(product)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
