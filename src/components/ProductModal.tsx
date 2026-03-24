import { type Product } from '@/types'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { ProductCard } from './ProductCard'
import { updateProduct } from '@/services/productsService'

interface ProductModalProps {
    product: Product
    onClose: () => void
    onProductUpdated?: (productId: string) => void
}

export function ProductModal({ product, onClose, onProductUpdated }: ProductModalProps) {
    const { user } = useAuth()
    const [isOutOfStock, setIsOutOfStock] = useState(product.stock === 0)
    const [isSaving, setIsSaving] = useState(false)

    // Validar si el usuario puede marcar como agotado
    const canMarkOutOfStock = user && (user.role === 'admin' || user.role === 'vendedor')

    const handleMarkOutOfStock = () => {
        setIsOutOfStock(!isOutOfStock)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await updateProduct(product.id, {
                active: isOutOfStock ? false : true
            })
            if (isOutOfStock && onProductUpdated) {
                onProductUpdated(product.id)
            }
            onClose()
        } catch (error) {
            console.error('Error al guardar:', error)
            alert('Error al guardar el producto')
        } finally {
            setIsSaving(false)
        }
    }

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
                <div className="p-2 flex justify-center">
                    <ProductCard product={product} />
                </div>

                {/* Estado agotado */}
                <div className="px-4 py-3 bg-gray-50 border-y border-gray-200">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                            {isOutOfStock ? '❌ Agotado' : '✅ En stock'}
                        </span>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-2">
                    {canMarkOutOfStock ? (
                        <>
                            <button
                                onClick={handleMarkOutOfStock}
                                className={`flex-1 font-bold py-2 rounded-lg transition-colors ${isOutOfStock
                                    ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-900'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                                    }`}
                            >
                                {isOutOfStock ? 'Desmarcar agotado' : 'Marcar agotado'}
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 rounded-lg transition-colors"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}
