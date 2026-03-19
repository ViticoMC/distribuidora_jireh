import { useState, useEffect } from "react";
import type { Product, Category } from "@/types";
import { getProducts } from "@/services/productsService";
import { getCategories } from "@/services/categoriesService";

interface UseHomeDataReturn {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  isCategoriesLoading: boolean;
}

export function useHomeData(): UseHomeDataReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);

  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
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
    };

    loadProducts();
  }, []);

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const data = await getCategories();
        const allCategoriesOption: Category = { id: 0, name: "Todas" };
        const categoriesWithAll = data ? [allCategoriesOption, ...data] : [allCategoriesOption];
        setCategories(categoriesWithAll);
      } catch (error) {
        console.error("Error loading categories:", error);
        setCategories([{ id: 0, name: "Todas" }]);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  return {
    products,
    categories,
    isLoading,
    isCategoriesLoading,
  };
}
