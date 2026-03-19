import { useState, useEffect, forwardRef } from 'react'
import { type Category } from '@/types'

interface CategoryFormProps {
    category?: Category
    onSubmit: (data: { name: string; description?: string; icon?: string }) => Promise<void>
    isLoading?: boolean
}

export const CategoryForm = forwardRef<HTMLFormElement, CategoryFormProps>(
    ({ category, onSubmit, isLoading = false }, ref) => {
        const [formData, setFormData] = useState({
            name: category?.name || '',
            description: category?.description || '',
            icon: category?.icon || '',
        })
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [error, setError] = useState('')
        const [success, setSuccess] = useState('')

        // Actualizar formulario cuando cambia la categoría
        useEffect(() => {
            if (category) {
                setFormData({
                    name: category.name || '',
                    description: category.description || '',
                    icon: category.icon || '',
                })
            } else {
                // Limpiar formulario cuando no hay categoría a editar
                setFormData({
                    name: '',
                    description: '',
                    icon: '',
                })
                setError('')
                setSuccess('')
            }
        }, [category])

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setError('')
            setSuccess('')

            if (!formData.name.trim()) {
                setError('El nombre de la categoría es requerido')
                return
            }

            try {
                setIsSubmitting(true)
                await onSubmit(formData)
                setSuccess(category ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente')
                // Limpiar formulario después de guardar
                if (!category) {
                    setFormData({ name: '', description: '', icon: '' })
                }
                setTimeout(() => setSuccess(''), 3000)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al guardar la categoría')
            } finally {
                setIsSubmitting(false)
            }
        }

        return (
            <form ref={ref} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre de la Categoría *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Electrónica, Ropa, Alimentos"
                            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción de la categoría..."
                            rows={3}
                            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Icono */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ícono
                        </label>
                        <input
                            type="text"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="Ej: 📱, 👕, 🍎"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>
                </div>

                {/* Botones */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isSubmitting ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        )
    })
