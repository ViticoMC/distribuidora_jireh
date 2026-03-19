import { LogOut, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { logout } from '@/services/authService'
import { Link } from 'react-router-dom'


export function AdminHeader() {
    const navigate = useNavigate()
    const { user } = useAuth()

    const handleLogout = async () => {
        if (window.confirm('¿Deseas cerrar sesión?')) {
            try {
                await logout()
                navigate('/login')
            } catch (error) {
                console.error('Error logging out:', error)
            }
        }
    }

    return (
        <header className="bg-white shadow-md sticky top-0 z-30">
            <div className="flex items-center justify-between px-4 md:px-6 py-4">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Home className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
                        <p className="text-xs text-gray-600">Administrador</p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="hidden md:inline">Cerrar Sesión</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
