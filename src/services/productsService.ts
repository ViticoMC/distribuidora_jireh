import { supabase } from "@/config/supabase";

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
