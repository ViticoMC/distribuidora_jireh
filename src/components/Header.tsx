import { ShieldUser } from "lucide-react";



export function Header() {
    return (
        <header className="relative flex justify-center w-full  h-56 ">

            {/* Logo */}
            <div className="flex flex-col items-center  justify-start">
                <img src="/logo_withoutbg.webp" alt="Logo de Distribuidora Jireh" className="h-40 w-40" />
                <h1 className="text-4xl font-bold text-blue-600 truncate">
                    Distribuidora Jireh
                </h1>
                <p>Explora y filtra nuestro catálogo de productos.</p>
            </div>

            {/* Perfil */}
            <button
                onClick={() => console.log("perfil")}
                className="p-2 rounded-full bg-linear-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-colors flex items-center justify-center touch-none absolute top-3 right-3"
                aria-label="Perfil de usuario"
            >
                <ShieldUser className="w-7 h-7" />
            </button>
        </header>
    );
}
