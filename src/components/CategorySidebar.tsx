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
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon || "📦"} {category.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
