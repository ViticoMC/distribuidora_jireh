import { AlertCircle } from 'lucide-react'

interface ConfirmCloseModalProps {
    isOpen: boolean
    onConfirm: () => void
    onCancel: () => void
}

export function ConfirmCloseModal({ isOpen, onConfirm, onCancel }: ConfirmCloseModalProps) {
    if (!isOpen) return null

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50" />

            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
                    {/* Contenido */}
                    <div className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Se perderán los cambios
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Si cierras sin guardar, todos los cambios realizados se perderán.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-200 rounded-b-2xl">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                        >
                            Descartar cambios
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
