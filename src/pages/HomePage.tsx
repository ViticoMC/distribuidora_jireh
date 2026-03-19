
import { useState, useEffect } from "react";
import type { Product, Category } from "@/types";
import { getProducts } from "@/services/productsService";
import { getCategories } from "@/services/categoriesService";
import { Header, ProductGrid, CategorySidebar, SearchBar, ProductModal } from "@/components";


export function HomePage() {
    // Estado
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Cargar productos
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setIsLoading(true);
                const data = await getProducts();
                setProducts(data || []);
            } catch (error) {
                console.error("Error loading products:", error);
                setProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProducts();
    }, []);

    // Cargar categorías
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setIsCategoriesLoading(true);
                const data = await getCategories();
                setCategories(data || []);
            } catch (error) {
                console.error("Error loading categories:", error);
                setCategories([]);
            } finally {
                setIsCategoriesLoading(false);
            }
        };

        loadCategories();
    }, []);


    // Ver detalles del producto
    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <Header />

            {/* Contenido principal */}
            <main className="w-full m-4">
                {/* Barra de búsqueda - Full width en mobile, constrained en tablet+ */}
                <div className="mb-6 md:mb-8 max-w-[100vw] mx-auto">
                    <SearchBar onSearch={() => { }} />
                </div>

                {/* Layout: Categorías + Contenido */}
                <div className="max-w-7xl mx-auto">
                    {/* Categorías - Horizontal en tablet */}
                    <CategorySidebar
                        categories={categories}
                        selectedCategoryId={selectedCategoryId}
                        onSelectCategory={setSelectedCategoryId}
                        isLoading={isCategoriesLoading}
                    />

                    <div className=" max-w-[90vw]1">
                        {/* Grid de productos */}
                        <ProductGrid
                            products={products || []}
                            isLoading={isLoading}
                            onViewDetails={handleViewDetails}
                        />
                    </div>
                </div>
            </main>

            {/* Modal de detalles del producto */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}
