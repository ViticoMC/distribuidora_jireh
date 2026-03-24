import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminPage, HomePage, LoginPage, NotFoundPage } from '@/pages'
import { ProtectedRoute } from '@/components'

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/register" element={<RegisterPage />} /> */}
                {/* <Route path="/test" element={<TestPage />} /> */}
                {/* <Route path="/seed" element={<SeedDataPage />} /> */}

                {/* Public home page - Catálogo de productos */}
                <Route path="/" element={<HomePage />} />

                {/* Protected Admin Route - Solo para admin */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminPage />
                        </ProtectedRoute>
                    }
                />

                {/* Catch all */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
