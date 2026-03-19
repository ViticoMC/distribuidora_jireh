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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            {/* Información de productos */}
            <div className="text-sm text-gray-600">
                {totalProducts > 0 && (
                    <p>
                        Showing <span className="font-semibold">{totalProducts}</span> items in current inventory
                    </p>
                )}
            </div>

            {/* Controles de filtrado y ordenamiento */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                {/* Botón Filtrar */}
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                </button>

                {/* Select de ordenamiento */}
                <select
                    value={sortBy}
                    onChange={(e) => onSortChange?.(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm font-medium cursor-pointer focus:outline-none focus:border-blue-500"
                >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                </select>
            </div>
        </div>
    );
}
