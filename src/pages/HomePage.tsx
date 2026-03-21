
import { useState } from "react";
import type { Product } from "@/types";
import { useGetAllData } from "@/hooks/useGetAllData";
import { Header, ProductGrid, CategorySidebar, SearchBar, ProductModal } from "@/components";


export function HomePage() {
    // Cargar datos de productos y categorías
    const { products, categories, isLoading, isCategoriesLoading } = useGetAllData();


    // Estado local
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Obtener la categoría seleccionada
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

    const filteredProducts = products.filter((product) => {
        const notAgotado = product.active; // Solo mostrar productos activos
        const matchesCategory = selectedCategoryId ? product.category_id === selectedCategoryId : true;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch && notAgotado;
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

                {/* Imagen de categoría seleccionada */}
                {selectedCategory?.img_url && (
                    <div className="mb-6 md:mb-8 mx-auto">
                        <img
                            src={selectedCategory.img_url}
                            alt={selectedCategory.name}
                            className=" h-32 w-32 object-cover rounded-lg shadow-md"
                        />
                    </div>
                )}

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
