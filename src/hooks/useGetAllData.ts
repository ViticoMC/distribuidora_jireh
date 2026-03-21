import { useState, useEffect, useCallback } from "react";
import type { Product, Category } from "@/types";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/services/productsService";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/categoriesService";
import { translateDatabaseError } from "@/utils/errorHandler";

interface useGetAllDataReturn {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  isCategoriesLoading: boolean;
  createProductAndRefresh: (data: {
    name: string;
    description?: string;
    price: number;
    weight?: number;
    active?: boolean;
    discount?: number;
    category_id: number;
    ima_url?: string;
    img_id?: string;
  }) => Promise<void>;
  updateProductAndRefresh: (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      weight?: number;
      active?: boolean;
      discount?: number;
      category_id?: number;
      ima_url?: string;
      img_id?: string;
    }
  ) => Promise<void>;
  deleteProductAndRefresh: (id: string) => Promise<void>;
  createCategoryAndRefresh: (data: {
    name: string;
    description?: string;
    icon?: string;
    img_url?: string;
    img_id?: string;
  }) => Promise<void>;
  updateCategoryAndRefresh: (
    id: number,
    data: {
      name?: string;
      description?: string;
      icon?: string;
      img_url?: string;
      img_id?: string;
    }
  ) => Promise<void>;
  deleteCategoryAndRefresh: (id: number) => Promise<void>;
}

export function useGetAllData(): useGetAllDataReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Función para recargar productos
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para recargar categorías
  const loadCategories = useCallback(async () => {
    try {
      setIsCategoriesLoading(true);
      const data = await getCategories();
      const allCategoriesOption: Category = { id: 0, name: "Todas" };
      const categoriesWithAll = data
        ? [allCategoriesOption, ...data]
        : [allCategoriesOption];
      setCategories(categoriesWithAll);
    } catch (error) {
      console.error("Error loading categories:", error);
      setCategories([{ id: 0, name: "Todas" }]);
    } finally {
      setIsCategoriesLoading(false);
    }
  }, []);

  // Cargar productos al montar
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Crear producto y recargar datos
  const createProductAndRefresh = useCallback(
    async (data: Parameters<typeof createProduct>[0]) => {
      await createProduct(data);
      await loadProducts();
    },
    [loadProducts]
  );

  // Actualizar producto y recargar datos
  const updateProductAndRefresh = useCallback(
    async (id: string, data: Parameters<typeof updateProduct>[1]) => {
      await updateProduct(id, data);
      await loadProducts();
    },
    [loadProducts]
  );

  // Eliminar producto y recargar datos
  const deleteProductAndRefresh = useCallback(
    async (id: string) => {
      try {
        await deleteProduct(id);
        await loadProducts();
      } catch (error) {
        const translatedError = translateDatabaseError(error);
        throw new Error(translatedError);
      }
    },
    [loadProducts]
  );

  // Crear categoría y recargar datos
  const createCategoryAndRefresh = useCallback(
    async (data: {
      name: string;
      description?: string;
      icon?: string;
      img_url?: string;
      img_id?: string;
    }) => {
      await createCategory(
        data.name,
        data.description,
        data.icon,
        data.img_url,
        data.img_id
      );
      await loadCategories();
    },
    [loadCategories]
  );

  // Actualizar categoría y recargar datos
  const updateCategoryAndRefresh = useCallback(
    async (
      id: number,
      data: Parameters<typeof updateCategory>[1]
    ) => {
      await updateCategory(id, data);
      await loadCategories();
    },
    [loadCategories]
  );

  // Eliminar categoría y recargar datos
  const deleteCategoryAndRefresh = useCallback(
    async (id: number) => {
      try {
        await deleteCategory(id);
        await loadCategories();
      } catch (error) {
        const translatedError = translateDatabaseError(error);
        throw new Error(translatedError);
      }
    },
    [loadCategories]
  );

  return {
    products,
    categories,
    isLoading,
    isCategoriesLoading,
    createProductAndRefresh,
    updateProductAndRefresh,
    deleteProductAndRefresh,
    createCategoryAndRefresh,
    updateCategoryAndRefresh,
    deleteCategoryAndRefresh,
  };
}
