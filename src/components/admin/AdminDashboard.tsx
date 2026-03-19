import { type Product, type Category } from '@/types'
import { Package, FolderOpen, AlertCircle, TrendingUp } from 'lucide-react'

interface AdminDashboardProps {
    products: Product[]
    categories: Category[]
    isLoading: boolean
}

export function AdminDashboard({ products, categories, isLoading }: AdminDashboardProps) {
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.active).length
    const inactiveProducts = products.filter(p => !p.active).length

    const stats = [
        {
            label: 'Total de Productos',
            value: totalProducts,
            icon: Package,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            label: 'Productos Activos',
            value: activeProducts,
            icon: TrendingUp,
            color: 'bg-green-100 text-green-600',
        },
        {
            label: 'Productos Agotados',
            value: inactiveProducts,
            icon: AlertCircle,
            color: 'bg-red-100 text-red-600',
        },
        {
            label: 'Categorías',
            value: categories.length,
            icon: FolderOpen,
            color: 'bg-purple-100 text-purple-600',
        },
    ]

    return (
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Panel de Administración</h1>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <div
                            key={stat.label}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium mb-2">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {isLoading ? (
                                            <span className="animate-pulse">...</span>
                                        ) : (
                                            stat.value.toLocaleString()
                                        )}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-lg`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>


        </div>
    )
}
