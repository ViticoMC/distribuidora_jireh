import { useState, useEffect, useMemo, useRef } from 'react'
import { BarChart3, Package, Folder, Search } from 'lucide-react'
import type { Product, Category } from '@/types'
import { getProducts } from '@/services/productsService'
import { getCategories } from '@/services/categoriesService'
import { createProduct, deleteProduct, updateProduct } from '@/services/productsService'
import { createCategory, deleteCategory, updateCategory } from '@/services/categoriesService'
import {
    AdminHeader,
    AdminDashboard,
    ProductForm,
    CategoryForm,
} from '@/components/admin'
import { ProductCard, CategoryCard, ConfirmDeleteModal } from '@/components'

type TabType = 'dashboard' | 'products' | 'categories'

export function AdminPage() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard')
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [searchProducts, setSearchProducts] = useState('')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null)
    const [searchCategories, setSearchCategories] = useState('')
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        type: 'product' | 'category' | null
        item: Product | Category | null
    }>({
        isOpen: false,
        type: null,
        item: null,
    })
    const productFormRef = useRef<HTMLFormElement>(null)
    const categoryFormRef = useRef<HTMLFormElement>(null)

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
        description?: string
        price?: number
        weight?: number | null
        active?: boolean
        discount?: number
        category_id?: number
        ima_url?: string
    }) => {
        try {
            if (editingProduct) {
                // Actualizar producto existente
                await updateProduct(editingProduct.id, data)
                await loadData()
                setEditingProduct(null)
            } else {
                // Crear nuevo producto
                await createProduct(data)
                await loadData()
            }
        } catch (error) {
            console.error('Error saving product:', error)
            throw error
        }
    }

    // Crear/Editar categoría
    const handleSaveCategory = async (data: {
        name: string
        description?: string
        icon?: string
        img_url?: string
        img_id?: string
    }) => {
        try {
            if (editingCategory) {
                // Actualizar categoría existente
                await updateCategory(editingCategory.id, data)
                await loadData()
                setEditingCategory(null)
            } else {
                // Crear nueva categoría
                await createCategory(data.name, data.description, data.icon, data.img_url, data.img_id)
                await loadData()
            }
        } catch (error) {
            console.error('Error saving category:', error)
            throw error
        }
    }

    // Eliminar producto
    const handleDeleteProduct = async (product: Product) => {
        setDeleteModal({
            isOpen: true,
            type: 'product',
            item: product,
        })
    }

    // Editar producto
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product)
        // Hacer scroll al formulario después de que se actualice el estado
        setTimeout(() => {
            productFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 0)
    }

    // Confirmar eliminación de producto
    const confirmDeleteProduct = async () => {
        const product = deleteModal.item as Product
        if (product) {
            try {
                await deleteProduct(product.id)
                await loadData()
                setDeleteModal({
                    isOpen: false,
                    type: null,
                    item: null,
                })
            } catch (error) {
                console.error('Error deleting product:', error)
            }
        }
    }

    // Eliminar categoría
    const handleDeleteCategory = async (category: Category) => {
        setDeleteModal({
            isOpen: true,
            type: 'category',
            item: category,
        })
    }

    // Editar categoría
    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        // Hacer scroll al formulario después de que se actualice el estado
        setTimeout(() => {
            categoryFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 0)
    }

    // Confirmar eliminación de categoría
    const confirmDeleteCategory = async () => {
        const category = deleteModal.item as Category
        if (category) {
            try {
                await deleteCategory(category.id)
                await loadData()
                setDeleteModal({
                    isOpen: false,
                    type: null,
                    item: null,
                })
            } catch (error) {
                console.error('Error deleting category:', error)
            }
        }
    }

    // Filtrar y agrupar productos
    const filteredProductsBySearch = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchProducts.toLowerCase())
            const matchesCategory = selectedCategoryFilter === null || product.category_id === selectedCategoryFilter
            return matchesSearch && matchesCategory
        })
    }, [products, searchProducts, selectedCategoryFilter])

    const groupedProducts = useMemo(() => {
        const groups: { [key: number]: Product[] } = {}
        filteredProductsBySearch.forEach((product) => {
            if (!groups[product.category_id]) {
                groups[product.category_id] = []
            }
            groups[product.category_id].push(product)
        })
        return groups
    }, [filteredProductsBySearch])

    // Filtrar categorías
    const filteredCategories = useMemo(() => {
        return categories.filter((category) => {
            return (
                category.name.toLowerCase().includes(searchCategories.toLowerCase()) ||
                category.description?.toLowerCase().includes(searchCategories.toLowerCase())
            )
        })
    }, [categories, searchCategories])

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader />

            <main className="p-4 md:p-6 max-w-7xl mx-auto">
                {/* Tabs */}
                <div className="mb-6 flex flex-wrap gap-3 md:gap-4">
                    {[
                        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                        { id: 'products', label: 'Productos', icon: Package },
                        { id: 'categories', label: 'Categorías', icon: Folder },
                    ].map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id as TabType)
                                    setEditingProduct(null)
                                    setEditingCategory(null)
                                }}
                                className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                {tab.label}
                            </button>
                        )
                    })}
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
                                ref={productFormRef}
                                product={editingProduct || undefined}
                                categories={categories}
                                onSubmit={handleSaveProduct}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            {/* Búsqueda y filtro */}
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Productos ({filteredProductsBySearch.length})
                                </h2>

                                {/* Buscador */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar productos..."
                                        value={searchProducts}
                                        onChange={(e) => setSearchProducts(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Filtro por categoría */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-gray-700">Categoría:</span>
                                    <button
                                        onClick={() => setSelectedCategoryFilter(null)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategoryFilter === null
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        Todas
                                    </button>
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategoryFilter(category.id)}
                                            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${selectedCategoryFilter === category.id
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Productos por categoría */}
                            {filteredProductsBySearch.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 text-lg">No se encontraron productos</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {Object.entries(groupedProducts).map(([categoryId, categoryProducts]) => {
                                        const categoryName =
                                            categories.find((c) => c.id === parseInt(categoryId))?.name || 'Sin categoría'
                                        return (
                                            <div key={categoryId} className="space-y-3">
                                                <h3 className="text-lg font-semibold text-gray-900 px-2">{categoryName}</h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {categoryProducts.map((product) => (
                                                        <ProductCard
                                                            key={product.id}
                                                            product={product}
                                                            onEdit={() => handleEditProduct(product)}
                                                            onDelete={handleDeleteProduct}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-1">
                            <CategoryForm
                                ref={categoryFormRef}
                                category={editingCategory || undefined}
                                onSubmit={handleSaveCategory}
                                isLoading={isLoading}
                            />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            {/* Búsqueda */}
                            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    Categorías ({filteredCategories.length})
                                </h2>

                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Buscar categorías..."
                                        value={searchCategories}
                                        onChange={(e) => setSearchCategories(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Grid de categorías */}
                            {filteredCategories.length === 0 ? (
                                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                    <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500 text-lg">No se encontraron categorías</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {filteredCategories.map((category) => (
                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            onEdit={() => handleEditCategory(category)}
                                            onDelete={handleDeleteCategory}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Modal de confirmación de eliminación */}
            <ConfirmDeleteModal
                isOpen={deleteModal.isOpen}
                title={deleteModal.type === 'product' ? 'Eliminar producto' : 'Eliminar categoría'}
                message={
                    deleteModal.type === 'product'
                        ? '¿Estás seguro de que deseas eliminar este producto?'
                        : '¿Estás seguro de que deseas eliminar esta categoría?'
                }
                itemName={(deleteModal.item as Product | Category)?.name}
                onConfirm={deleteModal.type === 'product' ? confirmDeleteProduct : confirmDeleteCategory}
                onCancel={() =>
                    setDeleteModal({
                        isOpen: false,
                        type: null,
                        item: null,
                    })
                }
            />
        </div>
    )
}
