import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDeleteModalProps {
    isOpen: boolean
    title: string
    message: string
    itemName?: string
    error?: string | null
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

export function ConfirmDeleteModal({
    isOpen,
    title,
    message,
    itemName,
    error = null,
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDeleteModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-red-50 border-b border-red-200 p-6 flex items-center gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                    <h2 className="text-lg font-bold text-red-900">{title}</h2>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="ml-auto p-1 text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700">
                        {message}
                        {itemName && <strong className="block mt-2">"{itemName}"</strong>}
                    </p>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    <p className="text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-200 p-6 flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                        {isLoading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
