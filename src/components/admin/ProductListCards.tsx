import { useState, useMemo } from 'react'
import type { Product, Category } from '@/types'
import { Edit2, Trash2, Package, Search } from 'lucide-react'

interface ProductListCardsProps {
    products: Product[]
    categories: Category[]
    isLoading?: boolean
    onEdit?: (product: Product) => void
    onDelete?: (product: Product) => void
}

export function ProductListCards({
    products,
    categories,
    isLoading,
    onEdit,
    onDelete,
}: ProductListCardsProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === null || product.category_id === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [products, searchTerm, selectedCategory])

    const groupedByCategory = useMemo(() => {
        const groups: { [key: number]: Product[] } = {}
        filteredProducts.forEach((product) => {
            if (!groups[product.category_id]) {
                groups[product.category_id] = []
            }
            groups[product.category_id].push(product)
        })
        return groups
    }, [filteredProducts])

    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-lg">No hay productos creados aún</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header con búsqueda y filtros */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">
                    Productos ({filteredProducts.length})
                </h2>

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar productos por nombre o descripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Filtro por categoría */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-700">Categoría:</span>
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === null
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Todas
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Productos agrupados por categoría */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg">No se encontraron productos</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedByCategory).map(([categoryId, categoryProducts]) => {
                        const categoryName =
                            categories.find((c) => c.id === parseInt(categoryId))?.name || 'Sin categoría'
                        return (
                            <div key={categoryId} className="space-y-3">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg px-4 py-3 shadow-md">
                                    <h3 className="text-2xl font-bold text-white">{categoryName}</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {categoryProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 space-y-3"
                                        >
                                            {/* Imagen */}
                                            <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                                                <img
                                                    src={product.ima_url || 'https://via.placeholder.com/300x300'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            {/* Información */}
                                            <div className="space-y-2">
                                                <h4 className="font-bold text-gray-900 line-clamp-2">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {product.description || '-'}
                                                </p>

                                                {/* Precio */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {product.discount && product.discount > 0 ? (
                                                            <div className="flex items-center gap-2">
                                                                <span className="line-through text-gray-500 text-sm">
                                                                    ${product.price.toFixed(2)}
                                                                </span>
                                                                <span className="font-bold text-red-600">
                                                                    $
                                                                    {(
                                                                        product.price *
                                                                        (1 - product.discount / 100)
                                                                    ).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="font-bold text-blue-600">
                                                                ${product.price.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {product.discount && product.discount > 0 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            -{product.discount}%
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Estado */}
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-600">Estado:</span>
                                                    {product.active ? (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            Activo
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            Inactivo
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Acciones */}
                                            <div className="flex gap-2 pt-2 border-t border-gray-200">
                                                <button
                                                    onClick={() => onEdit?.(product)}
                                                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => onDelete?.(product)}
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
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
