
import { useState } from "react";
import type { Product } from "@/types";
import { useHomeData } from "@/hooks/useHomeData";
import { Header, ProductGrid, CategorySidebar, SearchBar, ProductModal } from "@/components";


export function HomePage() {
    // Cargar datos de productos y categorías
    const { products, categories, isLoading, isCategoriesLoading } = useHomeData();


    // Estado local
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const filteredProducts = products.filter((product) => {
        const matchesCategory = selectedCategoryId ? product.category_id === selectedCategoryId : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Ver detalles del producto
    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="min-h-screen bg-linear-to-br overflow-hidden from-gray-50 to-gray-100 pb-10" >
            {/* Header */}
            <Header />

            {/* Contenido principal */}
            <main className="w-full m-4">
                {/* Barra de búsqueda - Full width en mobile, constrained en tablet+ */}
                <div className="mb-6 md:mb-8 mx-auto">
                    <SearchBar onSearch={setSearchTerm} />
                </div>

                {/* Categorías - Horizontal en tablet */}
                <CategorySidebar
                    categories={categories}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                    isLoading={isCategoriesLoading}
                />

                <div className=" max-w-[90vw]">
                    {/* Grid de productos */}
                    <ProductGrid
                        products={filteredProducts}
                        isLoading={isLoading}
                        onViewDetails={handleViewDetails}
                    />
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
