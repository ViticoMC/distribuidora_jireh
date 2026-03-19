import { type Category } from '@/types'
import { Edit2, Trash2 } from 'lucide-react'

interface CategoryCardProps {
    category: Category
    onEdit?: (category: Category) => void
    onDelete?: (category: Category) => void
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 space-y-4">
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
            {onEdit || onDelete ? (
                <div className="flex gap-2 pt-4 border-t border-gray-200">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(category)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <Edit2 className="w-4 h-4" />
                            Editar
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(category)}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                            <Trash2 className="w-4 h-4" />
                            Eliminar
                        </button>
                    )}
                </div>
            ) : null}
        </div>
    )
}
