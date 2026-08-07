import { type Product } from '@/types'
import { Edit2, Trash2 } from 'lucide-react'

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
  onEdit?: (product: Product) => void
  onDelete?: (product: Product) => void
  listView?: "list1" | "list2"
}

export function ProductCard({ product, onViewDetails, onEdit, onDelete, listView }: ProductCardProps) {
  const isAdminMode = onEdit || onDelete
  const handleViewDetails = (product: Product) => {
    if (isAdminMode) return;
    onViewDetails?.(product)
  }

  const isOfert = product.oferta ? product.oferta :
    (product.discount && product.discount > 0) ? `Oferta` : false
  const hasOffer = Boolean(isOfert)

  // Determinar qué precio mostrar según la lista seleccionada
  const selectedPrice = listView === "list2" && product.price2 ? product.price2 : product.price1

  const marqueeText = `${isOfert} ★ `.repeat(10)

  const marquee = hasOffer ? (
    <div className="-mx-3 -mt-3 mb-2 overflow-hidden bg-red-600 rounded-t-[9px]">
      <div className="flex w-max whitespace-nowrap animate-hf-marquee py-0.5">
        <span className="px-2 text-xs font-extrabold uppercase tracking-widest text-white">{marqueeText}</span>
        <span className="px-2 text-xs font-extrabold uppercase tracking-widest text-white">{marqueeText}</span>
      </div>
    </div>
  ) : null

  const cardBody = (
    <div
      onClick={() => handleViewDetails(product)}
      className={` ${product.active ? '' : 'grayscale-75'} relative bg-white ${hasOffer ? 'rounded-[9px]' : 'rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 max-w-75'}  ${isAdminMode ? 'min-h-86' : 'min-h-74'}  transform flex flex-col justify-between pb-2 p-3 `}>
      {marquee}
      {/* Imagen */}
      {
        !product.active && <div className='bg-gray-500 text-white w-[90%] p-1 absolute z-100 top-4 flex justify-center  items-center'>Agotado</div>
      }
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



      {/* Precio y Peso / Tags */}
      <div className="flex flex-col   gap-1 mb-1 ">
        {product.tags && product.tags.length > 0 ? (
          product.tags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-50 rounded-lg text-sm  flex items-center justify-start p-1 gap-2"
            >
              <span className="font-bold text-blue-600">{tag}</span>
            </div>
          ))
        ) : (
          <>
            <div className="bg-blue-50 rounded-lg text-sm  flex items-center justify-start p-1 gap-2">
              <span className="text-gray-700 font-semibold">Precio :</span>
              <div className="flex items-center gap-2">
                {product.discount && product.discount > 0 ? (
                  <>
                    <div className="relative inline-block">
                      <span className="line-through text-gray-500 text-sm">
                        ${selectedPrice.toFixed(2)}
                      </span>
                      <div className="absolute -top-4 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded-full text-xs font-bold shadow-lg whitespace-nowrap">
                        -{product.discount}%
                      </div>
                    </div>
                    <span className="font-bold text-red-600 text-sm">
                      ${(selectedPrice * (1 - product.discount / 100)).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="font-bold text-blue-600">
                    ${selectedPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {product.weight && product.weight > 0 && (
              <div className="bg-blue-50 rounded-lg text-sm flex items-center justify-start  p-1  gap-3">
                <span className="text-gray-700 font-semibold">Peso:</span>
                <span className="text-sm text-gray-600 font-medium">
                  {product.weight} {product.und_weigth || 'kg'}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botones */}
      {isAdminMode ? (
        <div className="flex   gap-1   border-gray-200">
          {onEdit && (
            <div
              onClick={() => onEdit(product)}
              className=" flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" />
            </div>
          )}
          {onDelete && (
            <div
              onClick={() => onDelete(product)}
              className=" flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  )

  // Productos con oferta: borde degradado animado + marquee "OFERTA" en scroll infinito
  if (!hasOffer) return cardBody

  return (
    <div className="relative max-w-75 rounded-xl p-[3px] overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Borde degradado girando infinitamente */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] aspect-square bg-[conic-gradient(from_0deg,#ef4444_0deg,#f59e0b_90deg,#ef4444_180deg,#f59e0b_270deg,#ef4444_360deg)] animate-[spin_4s_linear_infinite]" />
      {cardBody}
    </div>
  )
}
