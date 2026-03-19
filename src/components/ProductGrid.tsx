import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onViewDetails?: (product: Product) => void;
}

export function ProductGrid({
  products,
  isLoading,
  onViewDetails,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-3 md:gap-4 lg:gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* Información de paginación */}
      {products.length > 0 && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Mostrando {products.length} productos
        </div>
      )}
    </div>
  );
}
