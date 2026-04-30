
import { useState, useMemo } from "react";
import type { Product } from "@/types";
import { useGetAllData } from "@/hooks/useGetAllData";
import { Header, ProductGrid, CategorySidebar, SearchBar, ProductModal, PasswordProtectedModal } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { updateProduct } from "@/services/productsService";
import { ArrowUp, List } from "lucide-react";


export function HomePage() {
    // Cargar datos de productos y categorías
    const { products, categories, isLoading, isCategoriesLoading } = useGetAllData();
    const { user } = useAuth();

    const params = new URLSearchParams(window.location.search);

    const lista = params.get("lista");



    // Estado local
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [listView, setListView] = useState<"list1" | "list2">(lista === "2" ? "list2" : "list1");
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [targetListView, setTargetListView] = useState<"list1" | "list2">("list1");

    // Obtener la categoría seleccionada
    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

    const normalizeString = (str: string) =>
        str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const filteredProducts = useMemo(() => {
        const normalizedSearch = normalizeString(searchTerm);

        const filtered = products.filter((product) => {
            const matchesCategory =
                selectedCategoryId === null ||
                product.category_id === selectedCategoryId;

            const matchesSearch =
                normalizeString(product.name).includes(normalizedSearch) ||
                normalizeString(product.description || '').includes(normalizedSearch);

            const isActive = product.active;

            return matchesCategory && matchesSearch && isActive;
        });

        return [...filtered].sort((a, b) => {
            const hasOfferA =
                (a.oferta && a.oferta.trim() !== "") ||
                (a.discount && a.discount > 0);

            const hasOfferB =
                (b.oferta && b.oferta.trim() !== "") ||
                (b.discount && b.discount > 0);

            // 1. Prioridad: ofertas
            if (hasOfferA && !hasOfferB) return -1;
            if (!hasOfferA && hasOfferB) return 1;

            // 2. Categoría (orden)
            const categoryA = categories.find(c => c.id === a.category_id)
            const categoryB = categories.find(c => c.id === b.category_id)
            const ordenA = categoryA?.orden ?? Number.MAX_VALUE;
            const ordenB = categoryB?.orden ?? Number.MAX_VALUE;

            if (ordenA !== ordenB) {
                return ordenA - ordenB;
            }

            // 3. Nombre
            return a.name.localeCompare(b.name, "es", {
                sensitivity: "base",
            });
        });
    }, [products, selectedCategoryId, searchTerm, categories]);


    const handleProductOutOfStock = async (productId: string) => {
        try {
            await updateProduct(productId, { active: false });
            setSelectedProduct(null);
        } catch (error) {
            console.error('Error al marcar producto como agotado:', error);
            alert('Error al marcar el producto como agotado');
        }
    };

    // Manejar cuando se marca un producto como agotado

    // Ver detalles del producto
    const handleViewDetails = (product: Product) => {
        setSelectedProduct(product);
    };

    // Manejar cierre modal
    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        setTargetListView("list1");
    };
    const handleChangeList = (targetList: "list1" | "list2") => {
        if (listView !== targetList) {
            setTargetListView(targetList);
            setShowPasswordModal(true);
        }
    };

    // Validación exitosa de contraseña
    const handlePasswordSuccess = () => {
        setListView(targetListView);
    };

    return (
        <div className="relative min-h-screen bg-linear-to-br overflow-hidden from-gray-50 to-gray-100 pb-10" >
            {/* Header */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}

                className="fixed cursor-pointer z-100  bottom-2 right-4 bg-green-600 rounded-xl  flex items-center justify-center w-12 h-12 ">
                <ArrowUp className="w-8 h-8 text-white" />

            </button>
            <Header user={user} />

            {/* Contenido principal */}
            <main className="w-full m-4">
                {/* Switch de vista de lista - Solo para usuarios autenticados */}
                {user && (
                    <div className="mb-6 md:mb-8 mx-auto flex justify-center">
                        <div className="inline-flex items-center bg-white rounded-lg shadow-md p-1 border border-gray-200">
                            <button
                                onClick={() => handleChangeList("list1")}
                                className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${listView === "list1"
                                    ? "bg-green-600 text-white"
                                    : "bg-transparent text-gray-700 hover:text-gray-900"
                                    }`}
                            >
                                <List size={18} />
                                Lista 1
                            </button>
                            <button
                                onClick={() => handleChangeList("list2")}
                                className={`px-4 py-2 rounded-md font-semibold transition-all flex items-center gap-2 ${listView === "list2"
                                    ? "bg-green-600 text-white"
                                    : "bg-transparent text-gray-700 hover:text-gray-900"
                                    }`}
                            >
                                <List size={18} />
                                Lista 2
                            </button>
                        </div>
                    </div>
                )}

                {/* Barra de búsqueda - Full width en mobile, constrained en tablet+ */}
                <div className="mb-6 md:mb-8 mx-auto">
                    <SearchBar
                        onSearch={setSearchTerm}
                        value={searchTerm}
                        onClear={() => setSearchTerm("")}
                    />
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
                        listView={listView}
                    />
                </div>
            </main>

            {/* Modal de detalles del producto */}
            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onProductUpdated={handleProductOutOfStock}
                    user={user}
                />
            )}

            {/* Modal de contraseña para Lista 2 */}
            {user && (
                <PasswordProtectedModal
                    isOpen={showPasswordModal}
                    onClose={handleClosePasswordModal}
                    onSuccess={handlePasswordSuccess}
                    userEmail={user.email}
                />
            )}
        </div>
    );
}
