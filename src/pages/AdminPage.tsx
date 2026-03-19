import { useState, useEffect } from 'react'
import type { Product, Category } from '@/types'
import { getProducts } from '@/services/productsService'
import { getCategories } from '@/services/categoriesService'
import { createProduct } from '@/services/productsService'
import { createCategory } from '@/services/categoriesService'
import {
    AdminHeader,
    AdminDashboard,
    ProductForm,
    CategoryForm,
    ProductList,
    CategoryList,
} from '@/components/admin'

type TabType = 'dashboard' | 'products' | 'categories'

export function AdminPage() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard')
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    // Cargar datos iniciales
    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setIsLoading(true)
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories(),
            ])
            setProducts(productsData || [])
            setCategories(categoriesData || [])
        } catch (error) {
            console.error('Error loading data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Crear/Editar producto
    const handleSaveProduct = async (data: {
        name: string
        description: string
        price: number
        weight: number
        active: boolean
        discount?: number
        category_id: number
        ima_url?: string
    }) => {
        try {
            if (editingProduct) {
                // Aquí iría la lógica de actualización
                // Por ahora solo creamos nuevos
                console.log('Actualizar:', editingProduct.id, data)
                // await updateProduct(editingProduct.id, data)
                setEditingProduct(null)
            } else {
                await createProduct(data)
                await loadData()
            }
        } catch (error) {
            throw error
        }
    }

    // Crear/Editar categoría
    const handleSaveCategory = async (data: {
        name: string
        description?: string
        icon?: string
    }) => {
        try {
            if (editingCategory) {
                // Aquí iría la lógica de actualización
                console.log('Actualizar:', editingCategory.id, data)
                // await updateCategory(editingCategory.id, data)
                setEditingCategory(null)
            } else {
                await createCategory(data.name, data.description, data.icon)
                await loadData()
            }
        } catch (error) {
            throw error
        }
    }

    // Eliminar producto
    const handleDeleteProduct = async (product: Product) => {
        if (window.confirm(`¿Deseas eliminar "${product.name}"?`)) {
            try {
                // Aquí iría la lógica de eliminación
                console.log('Eliminar producto:', product.id)
                // await deleteProduct(product.id)
                // await loadData()
            } catch (error) {
                console.error('Error deleting product:', error)
            }
        }
    }

    // Eliminar categoría
    const handleDeleteCategory = async (category: Category) => {
        if (window.confirm(`¿Deseas eliminar la categoría "${category.name}"?`)) {
            try {
                // Aquí iría la lógica de eliminación
                console.log('Eliminar categoría:', category.id)
                // await deleteCategory(category.id)
                // await loadData()
            } catch (error) {
                console.error('Error deleting category:', error)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader onLogoClick={() => setActiveTab('dashboard')} />

            <main className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="mb-6 flex flex-wrap gap-3 md:gap-4">
                    {[
                        { id: 'dashboard', label: '📊 Dashboard' },
                        { id: 'products', label: '📦 Productos' },
                        { id: 'categories', label: '📁 Categorías' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id as TabType)
                                setEditingProduct(null)
                                setEditingCategory(null)
                            }}
                            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <AdminDashboard
                            products={products}
                            categories={categories}
                            isLoading={isLoading}
                        />
                    </div>
                )}

                {/* Products Tab */}
                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <ProductForm
                                product={editingProduct || undefined}
                                categories={categories}
                                onSubmit={handleSaveProduct}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <ProductList
                                products={products}
                                isLoading={isLoading}
                                onEdit={(product) => {
                                    setEditingProduct(product)
                                }}
                                onDelete={handleDeleteProduct}
                            />
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <CategoryForm
                                category={editingCategory || undefined}
                                onSubmit={handleSaveCategory}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="lg:col-span-2">
                            <CategoryList
                                categories={categories}
                                isLoading={isLoading}
                                onEdit={(category) => {
                                    setEditingCategory(category)
                                }}
                                onDelete={handleDeleteCategory}
                            />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
