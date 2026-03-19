interface FilterAndSortProps {
    sortBy?: "newest" | "price-asc" | "price-desc" | "name-asc";
    onSortChange?: (sort: "newest" | "price-asc" | "price-desc" | "name-asc") => void;
    totalProducts?: number;
}

export function FilterAndSort({
    sortBy = "newest",
    onSortChange,
    totalProducts = 0,
}: FilterAndSortProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            {/* Información de productos */}
            <div className="text-sm md:text-base text-gray-600 font-medium">
                {totalProducts > 0 && (
                    <p>
                        Mostrando <span className="font-bold text-blue-600">{totalProducts}</span> productos
                    </p>
                )}
            </div>

            {/* Controles de filtrado y ordenamiento */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto">
                {/* Botón Filtrar */}
                <button className="flex items-center justify-center gap-2 px-4 md:px-5 py-3 md:py-2.5 bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all text-sm md:text-base font-semibold text-gray-700 hover:text-blue-600 touch-none active:scale-95">
                    <svg className="w-5 h-5 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtrar
                </button>

                {/* Select de ordenamiento */}
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange?.(e.target.value as "newest" | "price-asc" | "price-desc" | "name-asc")}
                    className="px-4 md:px-5 py-3 md:py-2.5 bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg transition-all text-sm md:text-base font-semibold text-gray-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 touch-none"
                >
                    <option value="newest">Más recientes</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="name-asc">Nombre: A a Z</option>
                </select>
            </div>
        </div>
    );
}
