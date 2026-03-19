import { useState } from 'react'
import { type Product, type Category } from '@/types'

interface ProductFormProps {
    product?: Product
    categories: Category[]
    onSubmit: (data: {
        name: string
        description: string
        price: number
        weight: number
        active: boolean
        discount?: number
        category_id: number
        ima_url?: string
    }) => Promise<void>
    isLoading?: boolean
}

export function ProductForm({ product, categories, onSubmit, isLoading = false }: ProductFormProps) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        weight: product?.weight || 0,
        active: product?.active !== undefined ? product.active : true,
        discount: product?.discount || 0,
        category_id: product?.category_id || (categories[0]?.id || 0),
        ima_url: product?.ima_url || '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        if (!formData.name.trim()) {
            setError('El nombre del producto es requerido')
            return
        }
        if (!formData.description.trim()) {
            setError('La descripción es requerida')
            return
        }
        if (formData.price <= 0) {
            setError('El precio debe ser mayor a 0')
            return
        }
        if (formData.weight <= 0) {
            setError('El peso debe ser mayor a 0')
            return
        }
        if (formData.category_id === 0) {
            setError('Debes seleccionar una categoría')
            return
        }

        try {
            setIsSubmitting(true)
            await onSubmit(formData)
            if (!product) {
                setFormData({
                    name: '',
                    description: '',
                    price: 0,
                    weight: 0,
                    active: true,
                    discount: 0,
                    category_id: categories[0]?.id || 0,
                    ima_url: '',
                })
            }
            setSuccess(product ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al guardar el producto')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {product ? 'Editar Producto' : 'Crear Nuevo Producto'}
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
                        Nombre del Producto *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: iPhone 14 Pro"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Descripción */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción *
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Descripción detallada del producto..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Grid de campos pequeños */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Precio ($) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                            placeholder="0.00"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Peso */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Peso (kg) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                            placeholder="0.00"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Descuento */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descuento (%)
                        </label>
                        <input
                            type="number"
                            step="1"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) })}
                            placeholder="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Categoría */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Categoría *
                        </label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        >
                            <option value="0">Selecciona una categoría</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* URL de imagen */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        URL de la Imagen
                    </label>
                    <input
                        type="url"
                        value={formData.ima_url}
                        onChange={(e) => setFormData({ ...formData, ima_url: e.target.value })}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Estado */}
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        disabled={isSubmitting}
                    />
                    <label htmlFor="active" className="text-sm font-semibold text-gray-700 cursor-pointer">
                        Producto Activo (disponible en catálogo)
                    </label>
                </div>
            </div>

            {/* Botones */}
            <div className="mt-6 flex gap-3">
                <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                >
                    {isSubmitting ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    )
}
