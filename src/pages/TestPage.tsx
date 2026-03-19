import { useEffect, useState } from 'react'
import { getCategories } from '@/services/categoriesService'

interface Category {
    id: string | number
    name: string
    description?: string
    created_at?: string
    icon?: string
}

export function TestPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const data = await getCategories()

                // Imprimir en consola
                console.log('=== CATEGORÍAS OBTENIDAS ===')
                console.log('Total:', data.length)
                console.log('Datos completos:', data)
                data.forEach((category: Category, index: number) => {
                    console.log(`Categoría ${index + 1}:`, category)
                })
                console.log('============================')

                setCategories(data)
                setError(null)
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
                console.error('Error al obtener categorías:', errorMessage)
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Página de Test - Categorías
                    </h1>

                    {loading && (
                        <div className="text-center py-8">
                            <p className="text-lg text-gray-600">Cargando categorías...</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Abre la consola del navegador (F12) para ver los logs
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                            <p className="text-red-700 font-semibold">Error</p>
                            <p className="text-red-600 text-sm mt-1">{error}</p>
                            <details className="mt-2 text-sm">
                                <summary className="cursor-pointer text-red-600 underline">
                                    Detalles técnicos
                                </summary>
                                <pre className="mt-2 bg-red-100 p-2 rounded overflow-auto text-xs">
                                    {error}
                                </pre>
                            </details>
                        </div>
                    )}

                    {!loading && categories.length > 0 && (
                        <div>
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                                <p className="text-blue-700 font-semibold">
                                    ✓ Se encontraron {categories.length} categoría(s)
                                </p>
                                <p className="text-blue-600 text-sm mt-1">
                                    Revisa la consola del navegador (F12) para ver los datos completos
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Descripción
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                Creado
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {categories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                                    {category.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {category.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {category.description || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {category.created_at
                                                        ? new Date(category.created_at).toLocaleDateString('es-ES')
                                                        : '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 p-4 bg-gray-100 rounded-md">
                                <p className="text-sm text-gray-700 font-mono">
                                    <strong>JSON de respuesta:</strong>
                                </p>
                                <pre className="mt-2 bg-white p-3 rounded overflow-auto text-xs border border-gray-300">
                                    {JSON.stringify(categories, null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {!loading && categories.length === 0 && !error && (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No se encontraron categorías</p>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Información de Debug
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-2">
                            <li>
                                <strong>Estado:</strong> {loading ? 'Cargando' : error ? 'Error' : 'Completado'}
                            </li>
                            <li>
                                <strong>Total de categorías:</strong> {categories.length}
                            </li>
                            <li>
                                <strong>Tabla:</strong> <code className="bg-gray-100 px-2 py-1 rounded">categorias</code>
                            </li>
                            <li>
                                <strong>Consola del navegador:</strong> Abre F12 para ver logs detallados
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
