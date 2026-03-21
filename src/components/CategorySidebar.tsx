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


    <div className=" max-w-[90vw] mb-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">

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
          <div
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`w-full text-left py-2 px-3 rounded transition-colors text-xs font-medium flex items-center gap-1 ${selectedCategoryId === category.id
              ? "bg-blue-100 text-blue-600"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span className="text-sm">
              {category.icon || "📦"}
            </span>
            {category.name}
          </div>
        ))
      )}
    </div>
  );
}
