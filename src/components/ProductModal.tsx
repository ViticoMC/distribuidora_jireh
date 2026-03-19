import { type Product } from '@/types'
import { Circle, X } from 'lucide-react'

interface ProductModalProps {
    product: Product
    onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
    const statusColor = product.active ? 'text-green-500' : 'text-red-500'
    return (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header con botón cerrar */}
                <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-4 md:p-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">Detalles del Producto</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-4 md:p-6">
                    {/* Imagen grande */}
                    <div className="relative w-full h-60 mb-6 rounded-xl overflow-hidden bg-gray-100">
                        <img
                            src={product.ima_url || 'https://via.placeholder.com/500x500?text=No+Image'}
                            alt={product.name}
                            className="w-full h-60 object-cover"
                        />
                        {product.discount && product.discount > 0 && (
                            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                -{product.discount}%
                            </div>
                        )}
                        {!product.active && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">Agotado</span>
                            </div>
                        )}
                    </div>

                    {/* Información del producto */}
                    <div className="space-y-4">
                        {/* Nombre */}
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                {product.name}
                            </h1>
                        </div>

                        {/* Descripción */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase">Descripción</h3>
                            <p className="text-gray-600 text-base leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Precio y peso */}
                        <div className="  grid grid-cols-2 gap-3 p-1">
                            <div className="bg-blue-50 rounded-lg flex items-center justify-start p-1 gap-2">
                                <span className="text-gray-700 font-semibold">Precio:</span>
                                <span className=" font-bold text-blue-600">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>

                            {product.weight && (
                                <div className="bg-blue-50 rounded-lg flex items-center justify-start border-t border-blue-100 p-1  gap-3">
                                    <span className="text-gray-700 font-semibold">Peso:</span>
                                    <span className="text-sm text-gray-600 font-medium">
                                        {product.weight} kg
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Estado del producto */}
                        <div className="flex items-center gap-2">
                            <Circle className={`w-3 h-3 rounded-full ${statusColor}`} />
                            <span className={`font-semibold ${statusColor}`}>
                                {product.active ? 'Disponible' : 'Agotado'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold mt-2 rounded-lg transition-colors text-lg"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
