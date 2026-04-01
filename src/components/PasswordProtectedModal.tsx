import { useState } from "react";
import { X, Lock } from "lucide-react";
import { supabase } from "@/config/supabase";

interface PasswordProtectedModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    userEmail: string;
}

export function PasswordProtectedModal({
    isOpen,
    onClose,
    onSuccess,
    userEmail,
}: PasswordProtectedModalProps) {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleClose = () => {
        // Resetear todos los estados
        setPassword("");
        setError("");
        setIsLoading(false);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Validar contraseña intentando re-autenticarse
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userEmail,
                password,
            });

            if (signInError) {
                setError("Contraseña incorrecta");
                setIsLoading(false);
                return;
            }

            // Contraseña correcta
            setPassword("");
            setError("");
            setIsLoading(false);
            onSuccess();
            onClose();
        } catch (err) {
            setError("Error al validar la contraseña");
            setIsLoading(false);
            console.log(err)
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-gray-900">
                            Acceso protegido
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">
                        Ingresa tu contraseña para acceder a la Lista 2
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            placeholder="Escribe tu contraseña"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoading}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !password}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Validando..." : "Acceder"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
