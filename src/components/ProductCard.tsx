import { type Product } from '@/types'
import { Edit2, Trash2 } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void

}

export function ProductCard({ product, onViewDetails, onEdit, onDelete }: ProductCardProps) {
  const isAdminMode = onEdit || onDelete
  const handleViewDetails = (product: Product) => {
    if (isAdminMode) return;
    onViewDetails?.(product)
  }

  return (
    <div
      onClick={() => handleViewDetails(product)}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-75  h-68  transform flex flex-col justify-between pb-2 p-3">
      {/* Imagen */}
      <div>
        <div className="relative w-full h-40  overflow-hidden">
          <img
            src={product.ima_url || 'https://via.placeholder.com/300x300?text=No+Image'}
            alt={product.name}
            className="w-full h-40 object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Contenido */}
        <div className=" px-2 flex flex-col gap-1">
          {/* Nombre */}
          <h3 translate="no" className="text-base md:text-lg font-bold text-gray-900 line-clamp-1">
            {product.name}
          </h3>

          {/* Descripción */}
          <p translate="no" className="text-sm md:text-base text-gray-600  line-clamp-1">
            {product.description}
          </p>
        </div>
      </div>



      {/* Precio y Peso */}
      <div className="flex flex-col   gap-1 mb-1 ">
        <div className="bg-blue-50 rounded-lg text-sm  flex items-center justify-start p-1 gap-2">
          <span className="text-gray-700 font-semibold">Precio:</span>
          <div className="flex items-center gap-2">
            {product.discount && product.discount > 0 ? (
              <>
                <div className="relative inline-block">
                  <span className="line-through text-gray-500 text-sm">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="absolute -top-4 -left-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                    -{product.discount}%
                  </div>
                </div>
                <span className="font-bold text-red-600 text-sm">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>


        {product.weight && product.weight > 0 && (
          <div className="bg-blue-50 rounded-lg text-sm flex items-center justify-start  p-1  gap-3">
            <span className="text-gray-700 font-semibold">Peso:</span>
            <span className="text-sm text-gray-600 font-medium">
              {product.weight} kg
            </span>
          </div>
        )}
      </div>

      {/* Botones */}
      {onEdit || onDelete ? (
        <div className="flex   gap-1   border-gray-200">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product)}
              className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
