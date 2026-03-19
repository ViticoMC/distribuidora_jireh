import { type Product } from '@/types'
import { Edit2, Trash2, Package } from 'lucide-react'

interface ProductListProps {
    products: Product[]
    isLoading?: boolean
    onEdit?: (product: Product) => void
    onDelete?: (product: Product) => void
}

export function ProductList({ products, isLoading, onEdit, onDelete }: ProductListProps) {
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-200">
                Productos ({products.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Imagen</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Precio</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descuento</th>
                            <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Estado</th>
                            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img
                                        src={product.ima_url || 'https://via.placeholder.com/40x40'}
                                        alt={product.name}
                                        className="w-10 h-10 rounded object-cover"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-900 font-semibold">
                                    ${product.price.toFixed(2)}
                                </td>
                                <td className="px-6 py-4">
                                    {product.discount && product.discount > 0 ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                            -{product.discount}%
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {product.active ? (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                            Inactivo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => onEdit?.(product)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => onDelete?.(product)}
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
