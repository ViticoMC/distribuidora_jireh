
import { useState, useEffect, useMemo } from "react";
import type { Product, Category } from "@/types";
import { getProducts } from "@/services/productsService";
import { getCategories } from "@/services/categoriesService";
import { Header, FilterAndSort, ProductGrid, CategorySidebar, SearchBar, ProductModal } from "@/components";


export function HomePage() {
    // Estado
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [sortBy, setSortBy] = useState<"newest" | "price-asc" | "price-desc" | "name-asc">("newest");
    const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
    const [showLoadMore, setShowLoadMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const ITEMS_PER_PAGE = 10;

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

    // Filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filtrar por categoría
        if (selectedCategoryId !== null) {
            result = result.filter((p) => p.category_id === selectedCategoryId);
        }

        // Filtrar por búsqueda
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.description?.toLowerCase().includes(query)
            );
        }

        // Ordenar
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "newest":
            default:
                // Ya ordenado por created_at del servidor
                break;
        }

        return result;
    }, [products, selectedCategoryId, searchQuery, sortBy]);

    // Mostrar productos con paginación
    useEffect(() => {
        setDisplayedProducts(
            filteredProducts.slice(0, ITEMS_PER_PAGE)
        );
        setShowLoadMore(filteredProducts.length > ITEMS_PER_PAGE);
    }, [filteredProducts]);

    // Cargar más productos
    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            const newCount = displayedProducts.length + ITEMS_PER_PAGE;
            setDisplayedProducts(filteredProducts.slice(0, newCount));
            setShowLoadMore(newCount < filteredProducts.length);
            setIsLoadingMore(false);
        }, 300);
    };

    // Agregar al carrito
    const handleAddToCart = (product: Product) => {
        setCartCount((prev) => prev + 1);
        // Aquí iría la lógica real del carrito
        console.log("Added to cart:", product.name);
    };

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
                    <SearchBar onSearch={setSearchQuery} />
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
                    <div className=" max-w-[90vw]">
                        {/* Grid de productos */}
                        <ProductGrid
                            products={displayedProducts}
                            isLoading={isLoading}
                            onAddToCart={handleAddToCart}
                            onViewDetails={handleViewDetails}
                            showLoadMore={showLoadMore}
                            onLoadMore={handleLoadMore}
                            isLoadingMore={isLoadingMore}
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
