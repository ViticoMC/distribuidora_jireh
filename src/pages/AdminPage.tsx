import { useState, useMemo, useEffect, useRef } from 'react'
import { BarChart3, Package, Folder, Plus } from 'lucide-react'
import type { Product, Category } from '@/types'
import {
    AdminHeader,
    AdminDashboard,
    ProductFormModal,
    CategoryFormModal,
} from '@/components/admin'
import { CategoryCard, ConfirmDeleteModal, ProductGrid, SearchBar, CategorySidebar } from '@/components'
import { useGetAllData } from '@/hooks/useGetAllData'

type TabType = 'dashboard' | 'products' | 'categories'

export function AdminPage() {
    const scrollPositionRef = useRef(0)
    const [activeTab, setActiveTab] = useState<TabType>('dashboard')
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
    const [searchProducts, setSearchProducts] = useState('')
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null)
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean
        type: 'product' | 'category' | null
        item: Product | Category | null
        error: string | null
        isDeleting: boolean
    }>({
        isOpen: false,
        type: null,
        item: null,
        error: null,
        isDeleting: false,
    })

    // Manejar apertura de modal
    const handleOpenProductModal = () => {
        setEditingProduct(null)
        setIsProductModalOpen(true)
    }

    const handleCloseProductModal = () => {
        setEditingProduct(null)
        setIsProductModalOpen(false)
    }

    // Manejar apertura de modal de categoría
    const handleOpenCategoryModal = () => {
        setEditingCategory(null)
        setIsCategoryModalOpen(true)
    }

    const handleCloseCategoryModal = () => {
        setEditingCategory(null)
        setIsCategoryModalOpen(false)
    }

    const { categories, isCategoriesLoading, products, isLoading, createProductAndRefresh, updateProductAndRefresh, deleteProductAndRefresh, createCategoryAndRefresh, updateCategoryAndRefresh, deleteCategoryAndRefresh } = useGetAllData()

    // Crear/Editar producto
    const handleSaveProduct = async (data: {
        name: string
        description?: string
        price?: number
        weight?: number | null
        und_weigth?: string
        active?: boolean
        discount?: number
        category_id?: number
        ima_url?: string
    }) => {
        try {
            // Validar campos requeridos
            if (!data.price || !data.category_id) {
                throw new Error('Precio y categoría son requeridos')
            }

            // Preparar datos sin null values
            const productData = {
                ...data,
                price: data.price,
                category_id: data.category_id,
                weight: data.weight || undefined,
                und_weigth: data.und_weigth || 'kg',
            }

            if (editingProduct) {
                // Actualizar producto existente
                await updateProductAndRefresh(editingProduct.id, productData)
                handleCloseProductModal()
            } else {
                // Crear nuevo producto
                await createProductAndRefresh(productData)
                handleCloseProductModal()
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
                await updateCategoryAndRefresh(editingCategory.id, data)
                handleCloseCategoryModal()
            } else {
                // Crear nueva categoría
                await createCategoryAndRefresh(data)
                handleCloseCategoryModal()
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
            error: null,
            isDeleting: false,
        })
    }

    // Prevenir scroll cuando el modal está abierto y guardar posición
    useEffect(() => {
        if (isProductModalOpen || isCategoryModalOpen || deleteModal.isOpen) {
            // Guardar posición actual antes de bloquear scroll
            scrollPositionRef.current = window.scrollY
            document.documentElement.style.overflow = 'hidden'
        } else {
            // Restaurar scroll a la posición guardada
            document.documentElement.style.overflow = ''
            window.scrollTo(0, scrollPositionRef.current)
        }

        return () => {
            document.documentElement.style.overflow = ''
        }
    }, [isProductModalOpen, isCategoryModalOpen, deleteModal.isOpen])

    // Editar producto
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product)
        setIsProductModalOpen(true)
    }

    // Confirmar eliminación de producto
    const confirmDeleteProduct = async () => {
        const product = deleteModal.item as Product
        if (product) {
            try {
                setDeleteModal(prev => ({ ...prev, isDeleting: true, error: null }))
                await deleteProductAndRefresh(product.id)
                setDeleteModal({
                    isOpen: false,
                    type: null,
                    item: null,
                    error: null,
                    isDeleting: false,
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el producto'
                console.error('Error deleting product:', error)
                setDeleteModal(prev => ({ ...prev, isDeleting: false, error: errorMessage }))
            }
        }
    }

    // Eliminar categoría
    const handleDeleteCategory = async (category: Category) => {
        setDeleteModal({
            isOpen: true,
            type: 'category',
            item: category,
            error: null,
            isDeleting: false,
        })
    }

    // Editar categoría
    const handleEditCategory = (category: Category) => {
        setEditingCategory(category)
        setIsCategoryModalOpen(true)
    }

    // Confirmar eliminación de categoría
    const confirmDeleteCategory = async () => {
        const category = deleteModal.item as Category
        if (category) {
            try {
                setDeleteModal(prev => ({ ...prev, isDeleting: true, error: null }))
                await deleteCategoryAndRefresh(category.id)
                setDeleteModal({
                    isOpen: false,
                    type: null,
                    item: null,
                    error: null,
                    isDeleting: false,
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la categoría'
                console.error('Error deleting category:', error)
                setDeleteModal(prev => ({ ...prev, isDeleting: false, error: errorMessage }))
            }
        }
    }

    // Filtrar y agrupar productos
    const normalizeString = (str: string) =>
        str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const filteredProductsBySearch = useMemo(() => {
        const filtered = products.filter((product: Product) => {
            const normalizedSearch = normalizeString(searchProducts)
            const matchesSearch =
                normalizeString(product.name).includes(normalizedSearch) ||
                normalizeString(product.description || '').includes(normalizedSearch)
            const matchesCategory = selectedCategoryFilter === null || product.category_id === selectedCategoryFilter || selectedCategoryFilter === 0
            return matchesSearch && matchesCategory
        })

        // Ordenar: primero productos con oferta o descuento, luego por categoría y nombre
        return filtered.sort((a, b) => {
            // Priorizar productos con oferta o descuento
            const hasOfferA = (a.oferta && a.oferta.trim() !== "") || (a.discount && a.discount > 0);
            const hasOfferB = (b.oferta && b.oferta.trim() !== "") || (b.discount && b.discount > 0);

            if (hasOfferA && !hasOfferB) return -1;
            if (!hasOfferA && hasOfferB) return 1;

            // Si ambos tienen oferta o ninguno tiene, ordenar por categoría
            const categoryA = categories.find(c => c.id === a.category_id)
            const categoryB = categories.find(c => c.id === b.category_id)
            const ordenA = categoryA?.orden ?? Number.MAX_VALUE
            const ordenB = categoryB?.orden ?? Number.MAX_VALUE

            // Primero ordenar por categoría
            if (ordenA !== ordenB) {
                return ordenA - ordenB
            }

            // Luego ordenar alfabéticamente por nombre dentro de la misma categoría
            return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
        })
    }, [products, searchProducts, selectedCategoryFilter, categories])

    // Ordenar categorías por el campo orden
    const sortedCategories = useMemo(() => {
        return [...categories].sort((a, b) => {
            const ordenA = a.orden ?? Number.MAX_VALUE
            const ordenB = b.orden ?? Number.MAX_VALUE
            return ordenA - ordenB
        })
    }, [categories])

    // Mover categoría arriba
    const handleMoveUp = async (category: Category) => {
        try {
            const currentIndex = sortedCategories.findIndex(c => c.id === category.id)
            if (currentIndex <= 0) return

            const categoryAbove = sortedCategories[currentIndex - 1]
            const currentOrden = category.orden ?? currentIndex
            const aboveOrden = categoryAbove.orden ?? currentIndex - 1

            // Intercambiar órdenes
            await updateCategoryAndRefresh(category.id, { orden: aboveOrden })
            await updateCategoryAndRefresh(categoryAbove.id, { orden: currentOrden })
        } catch (error) {
            console.error('Error moving category up:', error)
        }
    }

    // Mover categoría abajo
    const handleMoveDown = async (category: Category) => {
        try {
            const currentIndex = sortedCategories.findIndex(c => c.id === category.id)
            if (currentIndex >= sortedCategories.length - 1) return

            const categoryBelow = sortedCategories[currentIndex + 1]
            const currentOrden = category.orden ?? currentIndex
            const belowOrden = categoryBelow.orden ?? currentIndex + 1

            // Intercambiar órdenes
            await updateCategoryAndRefresh(category.id, { orden: belowOrden })
            await updateCategoryAndRefresh(categoryBelow.id, { orden: currentOrden })
        } catch (error) {
            console.error('Error moving category down:', error)
        }
    }


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
                    <div className="space-y-6">
                        {/* Botón Crear Nuevo Producto */}
                        <button
                            onClick={handleOpenProductModal}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                        >
                            <Plus size={20} />
                            Crear Nuevo Producto
                        </button>

                        {/* Búsqueda y filtro */}
                        <div className="mb-6 md:mb-8">
                            <SearchBar onSearch={setSearchProducts} />
                        </div>

                        {/* Categorías - Horizontal en tablet */}
                        <CategorySidebar
                            categories={categories}
                            selectedCategoryId={selectedCategoryFilter}
                            onSelectCategory={setSelectedCategoryFilter}
                            isLoading={isCategoriesLoading}
                        />

                        {/* Productos por categoría */}
                        {filteredProductsBySearch.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 text-lg">No se encontraron productos</p>
                            </div>
                        ) : (
                            <ProductGrid
                                products={filteredProductsBySearch}
                                isLoading={isLoading}
                                onEdit={handleEditProduct}
                                onDelete={handleDeleteProduct}
                            />
                        )}
                    </div>
                )}

                {/* Categories Tab */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        {/* Botón Crear Nueva Categoría */}
                        <button
                            onClick={handleOpenCategoryModal}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                        >
                            <Plus size={20} />
                            Crear Nueva Categoría
                        </button>

                        {/* Título */}
                        <h2 className="text-xl font-bold text-gray-900">
                            Categorías ({categories.slice(1).length})
                        </h2>

                        {/* Grid de categorías */}
                        {categories.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-500 text-lg">No se encontraron categorías</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {sortedCategories.map((category: Category, index: number) => {
                                    if (category.id === 0) return null // Omitir categoría "Todas" en el listados
                                    return (

                                        <CategoryCard
                                            key={category.id}
                                            category={category}
                                            onEdit={() => handleEditCategory(category)}
                                            onDelete={handleDeleteCategory}
                                            onMoveUp={() => handleMoveUp(category)}
                                            onMoveDown={() => handleMoveDown(category)}
                                            isFirstItem={index === 0}
                                            isLastItem={index === sortedCategories.slice(1).length - 1}
                                        />

                                    )
                                }
                                )}
                            </div>
                        )}
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
                error={deleteModal.error}
                isLoading={deleteModal.isDeleting}
                onConfirm={deleteModal.type === 'product' ? confirmDeleteProduct : confirmDeleteCategory}
                onCancel={() =>
                    setDeleteModal({
                        isOpen: false,
                        type: null,
                        item: null,
                        error: null,
                        isDeleting: false,
                    })
                }
            />

            {/* Modal de formulario de producto */}
            <ProductFormModal
                isOpen={isProductModalOpen}
                product={editingProduct || undefined}
                categories={categories.slice(1)}
                onClose={handleCloseProductModal}
                onSubmit={handleSaveProduct}
                isLoading={isLoading}
            />

            {/* Modal de formulario de categoría */}
            <CategoryFormModal
                isOpen={isCategoryModalOpen}
                category={editingCategory || undefined}
                onClose={handleCloseCategoryModal}
                onSubmit={handleSaveCategory}
                isLoading={isLoading}
            />
        </div>
    )
}
