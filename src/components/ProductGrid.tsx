import type { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onViewDetails?: (product: Product) => void;
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
}

export function ProductGrid({
  products,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete
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
        <p className="text-gray-500 text-lg">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid de productos - Optimizado para tablets */}
      {/* Información de paginación */}
      {products.length > 0 && (
        <div className="m-6 text-start text-2xl text-gray-600">
          Mostrando {products.length} producto{products.length > 1 ? "s" : ""}
        </div>
      )}
      <div className="gap-2"
        style={{
          gridColumn: "repeat(auto-fill, minmax(250px, 300px))"
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>


    </div>
  );
}
