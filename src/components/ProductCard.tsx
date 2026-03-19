import { type Product } from '@/types'

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-96  transform">
      {/* Imagen */}
      <div className="relative w-full aspect-square bg-gray-200 overflow-hidden">
        <img
          src={product.ima_url || 'https://via.placeholder.com/300x300?text=No+Image'}
          alt={product.name}
          className="w-full h-40 object-cover  transition-transform duration-300"
        />
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-red-500 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-sm md:text-base font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}
        {!product.active && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg md:text-xl">Agotado</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 md:p-5 flex flex-col">
        {/* Nombre */}
        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Descripción */}
        <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Precio y Peso */}
        <div className="  grid grid-cols-2 gap-3 p-1">
          <div className="bg-blue-50 rounded-lg flex items-center justify-start p-1 gap-2">
            <span className="text-gray-700 font-semibold">Precio:</span>
            <span className=" font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </span>
          </div>

          {product.weight && (
            <div className="bg-blue-50 rounded-lg flex items-center justify-start  p-1  gap-3">
              <span className="text-gray-700 font-semibold">Peso:</span>
              <span className="text-sm text-gray-600 font-medium">
                {product.weight} kg
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => onViewDetails?.(product)}
          className="p-1 h-4 cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors text-sm md:text-base touch-none active:scale-95"
        >
          Ver
        </button>
      </div>
    </div>
  )
}
