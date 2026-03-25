import { useMemo } from 'react'
import type { Category } from "../types";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number) => void;
  isLoading?: boolean;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading = false,
}: CategorySidebarProps) {
  // Ordenar categorías por el campo orden, manteniendo "Todas" al inicio

  console.log("Categorías recibidas en CategorySidebar:", categories);
  const sortedCategories = useMemo(() => {
    const allCategory = categories.find((c) => c.id === 0 || c.name === 'Todas')
    const otherCategories = categories.filter((c) => c.id !== 0 && c.name !== 'Todas')

    const sortedOthers = [...otherCategories].sort((a, b) => {
      const ordenA = a.orden ?? Number.MAX_VALUE
      const ordenB = b.orden ?? Number.MAX_VALUE
      return ordenA - ordenB
    })

    return allCategory ? [allCategory, ...sortedOthers] : sortedOthers
  }, [categories])

  return (
    <div className="mb-3 max-w-[90vw]">
      {isLoading ? (
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      ) : (
        <select
          value={selectedCategoryId || ""}
          onChange={(e) => onSelectCategory(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          {sortedCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon || "📦"} {category.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
