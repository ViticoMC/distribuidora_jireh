import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Product, Category } from '@/types'
import { ProductForm } from './ProductForm'
import { ConfirmCloseModal } from './ConfirmCloseModal'

interface ProductFormModalProps {
    isOpen: boolean
    product?: Product
    categories: Category[]
    onClose: () => void
    onSubmit: (data: {
        name: string
        description?: string
        price1?: number
        price2?: number
        weight?: number | null
        und_weigth?: string
        active?: boolean
        discount?: number
        oferta?: string
        category_id?: number
        ima_url?: string
    }) => Promise<void>
    isLoading?: boolean
}

export function ProductFormModal({
    isOpen,
    product,
    categories,
    onClose,
    onSubmit,
    isLoading = false,
}: ProductFormModalProps) {
    const [showConfirmClose, setShowConfirmClose] = useState(false)

    // Limpiar estado cuando se cierra la modal
    useEffect(() => {
        if (!isOpen) {
            setShowConfirmClose(false)
        }
    }, [isOpen])

    const handleClose = () => {
        setShowConfirmClose(true)
    }

    const handleConfirmClose = () => {
        setShowConfirmClose(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 flex items-center justify-between p-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Cerrar modal"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                        <ProductForm
                            product={product}
                            categories={categories}
                            onSubmit={async (data) => {
                                await onSubmit(data)
                                onClose()
                            }}
                            isLoading={isLoading}
                            isModal={true}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de cierre */}
            <ConfirmCloseModal
                isOpen={showConfirmClose}
                onConfirm={handleConfirmClose}
                onCancel={() => setShowConfirmClose(false)}
            />
        </>
    )
}
