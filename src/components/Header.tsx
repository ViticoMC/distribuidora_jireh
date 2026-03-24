import { ShieldUser, Lock, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/config/supabase";


export function Header() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleAdminClick = () => {
        navigate("/admin");
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <header className="relative flex justify-center w-full h-56">

            {/* Logo */}
            <div className="flex flex-col items-center justify-start">
                <img src="/logo_withoutbg.webp" alt="Logo de Distribuidora Jireh" className="h-40 w-40" />
                <h1 className="text-4xl font-bold text-blue-600 truncate">
                    Distribuidora Jireh
                </h1>
                <p>Explora y filtra nuestro catálogo de productos.</p>
            </div>

            {/* Botones de usuario/admin */}
            <div className="absolute top-3 right-3 flex gap-2">
                {user ? (
                    <>
                        {user.role === "admin" && (
                            <button
                                onClick={handleAdminClick}
                                className="p-2 rounded-full bg-linear-to-br from-blue-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 transition-colors flex items-center justify-center touch-none"
                                aria-label="Panel de administración"
                                title="Panel de administración"
                            >
                                <ShieldUser className="w-7 h-7 text-white" />
                            </button>
                        )}
                        < button
                            onClick={handleLogout}
                            className="p-2 rounded-full bg-linear-to-br from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 transition-colors flex items-center justify-center touch-none"
                            aria-label="Cerrar sesión"
                            title="Cerrar sesión"
                        >
                            <LogOut className="w-7 h-7 text-white" />
                        </button>
                    </>
                ) :
                    <button
                        onClick={() => navigate("/login")}
                        className="p-2 rounded-full bg-linear-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-colors flex items-center justify-center touch-none"
                        aria-label="Inicia sesión"
                        title="Inicia sesión"
                    >
                        <Lock className="w-7 h-7 text-white" />
                    </button>
                }
            </div>
        </header >
    );
}
