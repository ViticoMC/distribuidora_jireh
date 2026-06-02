import { type Category, type Product } from "@/types"
import { useMemo, useState } from "react"
import { ProductCard } from "../ProductCard"
import { SearchBar } from "../SearchBar"
import { CategorySidebar } from "../CategorySidebar"

interface AumentoPrecioProps {
    products: Product[]
    categories: Category[]
    isLoading: boolean
    isCategoriesLoading: boolean
    updateProductAndRefresh: (productId: string, updatedData: Partial<Product>) => void
}



export default function AumentoPrecio({
    categories,
    isCategoriesLoading,
    isLoading,
    products,
    updateProductAndRefresh
}: AumentoPrecioProps) {
    const [productsToAument, setProductsToAument] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<number | null>(null)


    const [percent, setPercent] = useState<number>()

    function detectarSiProductoSeleccionado(product: Product) {
        return productsToAument.some(p => p.id === product.id)
    }

    function eliminarProductoSeleccionado(product: Product) {
        const newProducts = productsToAument.filter(p => p.id !== product.id)
        setProductsToAument(newProducts)
    }


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Aplicando aumento a los productos:", productsToAument, "con porcentaje:", percent)
        if (!percent || productsToAument.length === 0) {
            return alert("Debe ingresar un porcentaje y seleccionar al menos un producto")
        }

        productsToAument.map((product) => {
            const newPrice = product.price1 * (1 + percent / 100)
            updateProductAndRefresh(product.id, {
                price_delivery: newPrice
            })
        })
    }

    function onSearch(query: string) {
        setSearchTerm(query)
    }

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const normalizedSearch = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const normalizedName = product.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const normalizedDescription = (product.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            const matchesSearch = normalizedName.includes(normalizedSearch) || normalizedDescription.includes(normalizedSearch)

            const matchesCategory = selectedCategoryFilter === null || product.category_id === selectedCategoryFilter
            return matchesSearch && matchesCategory


        })
    }, [products, searchTerm, selectedCategoryFilter])

    if (isLoading || isCategoriesLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <section className="flex flex-col gap-6 p-4 md:p-6">
            <div className="bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-bold text-gray-900">Definir el precio del delivery</h1>
                <p className="text-sm text-gray-600 mt-1">Establezca un %, seleccione los productos y se establecerá automáticamente el precio</p>
                <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4 max-w-80">
                    <div>
                        <label htmlFor="percent" className="block text-sm font-semibold text-gray-700 mb-2">Porcentaje</label>
                        <input className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" type="text" name="porciento" id="percent" onChange={(e) => setPercent(Number(e.target.value))} value={percent} />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium">Aplicar aumento</button>
                </form>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
            <div className="w-full flex flex-col gap-3">

                <SearchBar onSearch={onSearch} value={searchTerm} />
                <CategorySidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryFilter}
                    onSelectCategory={setSelectedCategoryFilter}
                    isLoading={isLoading}
                />
            </div>
            <div className="gap-3 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

                {filteredProducts.map((product) => {
                    const isSelected = detectarSiProductoSeleccionado(product)
                    return (
                        <div key={product.id} className="flex flex-col gap-2">
                            <ProductCard product={product} />
                            <button
                                onClick={() =>
                                    isSelected
                                        ? eliminarProductoSeleccionado(product)
                                        : setProductsToAument([...productsToAument, product])
                                }
                                className={`w-full cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                                    isSelected
                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isSelected ? "Quitar selección" : "Seleccionar producto"}
                            </button>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
