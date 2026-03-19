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


    <div className="space-y-2 max-w-[90vw] mb-4 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">

      {isLoading ? (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-8 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </>
      ) : (
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left px-4 py-2 rounded transition-colors text-sm font-medium flex items-center gap-2 ${selectedCategoryId === category.id
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span className="text-lg">
              {category.icon || "📦"}
            </span>
            {category.name}
          </button>
        ))
      )}
    </div>
  );
}
