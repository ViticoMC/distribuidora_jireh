import { supabase } from "@/config/supabase";

/**
 * Obtener todas las categorías
 */
export async function getCategories() {
  const { data, error } = await supabase.from("category").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Obtener una categoría por ID
 */
export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Crear una nueva categoría
 */
export async function createCategory(
  name: string,
  description?: string,
  icon?: string,
  img_url?: string,
  img_id?: string,
) {
  const { data, error } = await supabase
    .from("category")
    .insert([
      {
        name,
        description,
        icon,
        img_url,
        img_id,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Crear múltiples categorías
 */
export async function createCategories(
  categories: Array<{ name: string; description?: string; icon?: string }>,
) {
  const { data, error } = await supabase
    .from("category")
    .insert(categories)
    .select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Eliminar una categoría por ID
 */
export async function deleteCategory(id: number) {
  const { error } = await supabase.from("category").delete().eq("id", id);

  if (error) {
    // Crear un error con la información completa del error de Supabase
    const customError = new Error(error.message);
    // Adjuntar el código de error para poder identificarlo después
    (customError as any).code = error.code;
    (customError as any).details = error.details;
    throw customError;
  }
}

/**
 * Actualizar una categoría
 */
export async function updateCategory(
  id: number,
  category: Partial<{
    name: string;
    description?: string;
    icon?: string;
    img_url?: string;
    img_id?: string;
    orden?: number;
  }>,
) {
  const { data, error } = await supabase
    .from("category")
    .update(category)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
