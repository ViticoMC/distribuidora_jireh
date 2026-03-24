import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { Category } from '@/types'
import { CategoryForm } from './CategoryForm'
import { ConfirmCloseModal } from './ConfirmCloseModal'

interface CategoryFormModalProps {
    isOpen: boolean
    category?: Category
    onClose: () => void
    onSubmit: (data: {
        name: string
        description?: string
        icon?: string
        img_url?: string
        img_id?: string
    }) => Promise<void>
    isLoading?: boolean
}

export function CategoryFormModal({
    isOpen,
    category,
    onClose,
    onSubmit,
    isLoading = false,
}: CategoryFormModalProps) {
    const [showConfirmClose, setShowConfirmClose] = useState(false)

    // Limpiar estado cuando se cierra la modal
    useEffect(() => {
        if (!isOpen) {
            setShowConfirmClose(false)
        }
    }, [isOpen])

    const handleClose = () => {
        onClose()
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
                            {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
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
                        <CategoryForm
                            category={category}
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
