import { type Category } from '@/types'
import { Edit2, Trash2 } from 'lucide-react'

interface CategoryListProps {
    categories: Category[]
    isLoading?: boolean
    onEdit?: (category: Category) => void
    onDelete?: (category: Category) => void
}

export function CategoryList({ categories, isLoading, onEdit, onDelete }: CategoryListProps) {
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
                <p className="text-gray-500 text-lg">No hay categorías creadas aún</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-200">
                Categorías ({categories.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Imagen</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ícono</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descripción</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    {category.img_url ? (
                                        <img
                                            src={category.img_url}
                                            alt={category.name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-xs text-gray-500">Sin imagen</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-lg">{category.icon || '📁'}</td>
                                <td className="px-6 py-4 text-gray-900 font-medium">{category.name}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm max-w-xs truncate">
                                    {category.description || '-'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => onEdit?.(category)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(category)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
