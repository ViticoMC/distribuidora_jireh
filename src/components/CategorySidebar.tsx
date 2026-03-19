import type { Category } from "@/types";

interface CategorySidebarProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (categoryId: number | null) => void;
  isLoading?: boolean;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory,
  isLoading = false,
}: CategorySidebarProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 max-w-[90vw] gap-3 m-4">
      {isLoading ? (
        <div className="flex gap-2 md:gap-3 flex-wrap">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-12 w-24 bg-gray-300 rounded-lg animate-pulse shrink-0"
            />
          ))}
        </div>
      ) : (
        categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={`p-2 rounded-lg transition-all text-sm md:text-base lg:text-sm font-semibold whitespace-nowrap md:whitespace-normal flex items-center gap-2 touch-none active:scale-95 ${selectedCategoryId === category.id
              ? "bg-blue-600 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            <span className="text-lg md:text-xl lg:text-lg">
              {category.icon || "📦"}
            </span>
            <span className="text-xs md:text-sm ">{category.name}</span>
          </button>
        ))
      )}
    </div>
  );
}
