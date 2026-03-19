import { type Product } from '@/types'
import { X } from 'lucide-react'
import { ProductCard } from './ProductCard'

interface ProductModalProps {
    product: Product
    onClose: () => void
}

export function ProductModal({ product, onClose }: ProductModalProps) {
    return (
        <div className="fixed inset-0 backdrop-blur-lg bg-opacity-50 z-50 flex items-center justify-center p-4">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header con botón cerrar */}
                <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-4">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Detalles del Producto</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Cerrar modal"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Contenido - Usar ProductCard sin botón Ver */}
                <div className="p-4">
                    <ProductCard product={product} showViewButton={false} />
                </div>

                {/* Botón cerrar */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
                    <button
                        onClick={onClose}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 rounded-lg transition-colors"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    )
}
