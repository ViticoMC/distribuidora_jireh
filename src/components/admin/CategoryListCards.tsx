import { useState, useMemo } from 'react'
import type { Category } from '@/types'
import { Edit2, Trash2, Search, Folder } from 'lucide-react'

interface CategoryListCardsProps {
    categories: Category[]
    isLoading?: boolean
    onEdit?: (category: Category) => void
    onDelete?: (category: Category) => void
}

export function CategoryListCards({
    categories,
    isLoading,
    onEdit,
    onDelete,
}: CategoryListCardsProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            const matchesSearch =
                category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesSearch
        })
    }, [categories, searchTerm])

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    if (categories.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No hay categorías creadas aún</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header con búsqueda */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                    Categorías ({filteredCategories.length})
                </h2>

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar categorías por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Categorías en cards */}
            {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">No se encontraron categorías</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCategories.map((category) => (
                        <div
                            key={category.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 space-y-4"
                        >
                            {/* Ícono */}
                            <div className="w-16 h-16 rounded-lg bg-blue-50 flex items-center justify-center text-3xl">
                                {category.icon || '📁'}
                            </div>

                            {/* Información */}
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {category.description || 'Sin descripción'}
                                </p>
                            </div>

                            {/* Acciones */}
                            <div className="flex gap-2 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => onEdit?.(category)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                    title="Editar"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => onDelete?.(category)}
                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                                    title="Eliminar"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
