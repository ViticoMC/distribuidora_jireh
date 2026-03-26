import { type Category } from '@/types'
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'

interface CategoryCardProps {
    category: Category
    onEdit?: (category: Category) => void
    onDelete?: (category: Category) => void
    onMoveUp?: (category: Category) => void
    onMoveDown?: (category: Category) => void
    isFirstItem?: boolean
    isLastItem?: boolean
}

export function CategoryCard({
    category,
    onEdit,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirstItem = false,
    isLastItem = false
}: CategoryCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 space-y-4">
            {/* Imagen/Ícono */}
            <div className="w-full h-40 rounded-lg bg-blue-50 flex items-center justify-center text-3xl overflow-hidden">
                {category.img_url ? (
                    <img
                        src={category.img_url}
                        alt={category.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : (
                    <span>{category.icon || '📁'}</span>
                )}
            </div>

            {/* Información */}
            <div className="space-y-2">
                <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                    {category.description || 'Sin descripción'}
                </p>
            </div>

            {/* Acciones */}
            <div className="space-y-2 pt-2 border-t border-gray-200">
                {/* Botones de ordenamiento */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onMoveUp?.(category)}
                        disabled={isFirstItem}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-colors text-sm font-medium ${isFirstItem
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                        title={isFirstItem ? 'Ya es la primera categoría' : 'Mover arriba'}
                    >
                        <ChevronUp className="w-4 h-4" />
                        Arriba
                    </button>
                    <button
                        onClick={() => onMoveDown?.(category)}
                        disabled={isLastItem}
                        className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg transition-colors text-sm font-medium ${isLastItem
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                        title={isLastItem ? 'Ya es la última categoría' : 'Mover abajo'}
                    >
                        <ChevronDown className="w-4 h-4" />
                        Abajo
                    </button>
                </div>

                {/* Botones de edición y eliminación */}
                {onEdit || onDelete ? (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(category)}
                                className="flex-1 flex items-center justify-center gap-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(category)}
                                className="flex-1 flex items-center justify-center gap-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ) : null}
            </div>
        </div>
    )
}
