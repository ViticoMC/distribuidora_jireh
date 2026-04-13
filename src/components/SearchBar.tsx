import { Search, AlertCircle, X } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    onFilterAgotados?: (isFiltered: boolean) => void;
    isFilteringAgotados?: boolean;
    value?: string;
    onClear?: () => void;
}

export function SearchBar({
    onSearch,
    placeholder = "Buscar productos...",
    onFilterAgotados,
    isFilteringAgotados = false,
    value = "",
    onClear
}: SearchBarProps) {
    return (
        <div className="w-full space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Barra de búsqueda */}
                <div className="relative w-full flex-1">
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full py-3 pl-12 md:pl-14 pr-12 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base md:text-lg transition-all touch-none"
                    />
                    <Search className="absolute left-4 md:left-5 top-3.5 md:top-4 h-5 w-5 md:h-6 md:w-6 text-gray-400" />
                    {value && onClear && (
                        <button
                            onClick={onClear}
                            className="absolute mr-5 right-4 md:right-5 top-3.5 md:top-4 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Limpiar búsqueda"
                        >
                            <X className="h-5 w-5 md:h-6 md:w-6" />
                        </button>
                    )}
                </div>

                {/* Botón de filtro de agotados */}
                {onFilterAgotados && (
                    <button
                        onClick={() => {
                            onFilterAgotados(!isFilteringAgotados);
                        }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${isFilteringAgotados
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-md'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                    >
                        <AlertCircle size={18} />
                        <span className="hidden sm:inline">Agotados</span>
                    </button>
                )}
            </div>
        </div>
    );
}
