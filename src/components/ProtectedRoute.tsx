import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
    children: React.ReactNode
    requiredRole?: 'admin'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user, loading } = useAuth()




    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-lg font-semibold">Cargando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Si se requiere un rol específico, validar
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}
