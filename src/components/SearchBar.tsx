import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = "Buscar productos..." }: SearchBarProps) {
    return (
        <div className="relative w-full ">
            <input
                type="text"
                placeholder={placeholder}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full py-3 pl-12 md:pl-14 pr-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-base md:text-lg transition-all touch-none max-w-[90vw]"
            />

            <Search className="absolute left-4 md:left-5 top-3.5 md:top-4 h-5 w-5 md:h-6 md:w-6 text-gray-400" />
        </div>
    );
}
