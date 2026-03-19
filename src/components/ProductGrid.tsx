import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  onViewDetails,
  showLoadMore = false,
  onLoadMore,
  isLoadingMore = false,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid de productos - Optimizado para tablets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {/* Información de paginación */}
      {products.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing {products.length} items
        </div>
      )}

      {/* Botón Load More */}
      {showLoadMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="bg-gray-900 hover:bg-black disabled:bg-gray-600 text-white font-bold py-3 px-8 rounded transition-colors"
          >
            {isLoadingMore ? "Loading..." : "Load More Items"}
          </button>
        </div>
      )}
    </div>
  );
}
