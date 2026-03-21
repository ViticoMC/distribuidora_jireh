import { useState, useEffect, forwardRef } from 'react'
import { type Category } from '@/types'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/services/cloudinaryService'

interface CategoryFormProps {
    category?: Category
    onSubmit: (data: { name: string; description?: string; icon?: string; img_url?: string; img_id?: string }) => Promise<void>
    isLoading?: boolean
}

export const CategoryForm = forwardRef<HTMLFormElement, CategoryFormProps>(
    ({ category, onSubmit, isLoading = false }, ref) => {
        const [formData, setFormData] = useState({
            name: category?.name || '',
            description: category?.description || '',
            icon: category?.icon || '',
            img_url: category?.img_url || '',
            img_id: category?.img_id || '',
        })
        const [isSubmitting, setIsSubmitting] = useState(false)
        const [error, setError] = useState('')
        const [success, setSuccess] = useState('')
        const [isUploadingImage, setIsUploadingImage] = useState(false)
        const [imagePreview, setImagePreview] = useState(category?.img_url || '')

        // Actualizar formulario cuando cambia la categoría
        useEffect(() => {
            if (category) {
                setFormData({
                    name: category.name || '',
                    description: category.description || '',
                    icon: category.icon || '',
                    img_url: category.img_url || '',
                    img_id: category.img_id || '',
                })
                setImagePreview(category.img_url || '')
            } else {
                // Limpiar formulario cuando no hay categoría a editar
                setFormData({
                    name: '',
                    description: '',
                    icon: '',
                    img_url: '',
                    img_id: '',
                })
                setImagePreview('')
                setError('')
                setSuccess('')
            }
        }, [category])

        const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0]
            if (!file) return

            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona un archivo de imagen válido')
                return
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen debe ser menor a 5MB')
                return
            }

            try {
                setIsUploadingImage(true)
                setError('')
                const response = await uploadImage(file)
                setFormData({ ...formData, img_url: response.secure_url, img_id: response.public_id })
                setImagePreview(response.secure_url)
                setSuccess('Imagen subida correctamente')
                setTimeout(() => setSuccess(''), 3000)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al subir la imagen')
            } finally {
                setIsUploadingImage(false)
                // Limpiar input
                e.target.value = ''
            }
        }

        const removeImage = () => {
            setFormData({ ...formData, img_url: '', img_id: '' })
            setImagePreview('')
        }

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            setError('')
            setSuccess('')

            if (!formData.name.trim()) {
                setError('El nombre de la categoría es requerido')
                return
            }

            try {
                setIsSubmitting(true)
                await onSubmit(formData)
                setSuccess(category ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente')
                // Limpiar formulario después de guardar
                if (!category) {
                    setFormData({ name: '', description: '', icon: '', img_url: '', img_id: '' })
                    setImagePreview('')
                }
                setTimeout(() => setSuccess(''), 3000)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al guardar la categoría')
            } finally {
                setIsSubmitting(false)
            }
        }

        return (
            <form ref={ref} onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">{success}</p>
                    </div>
                )}

                <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre de la Categoría *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Electrónica, Ropa, Alimentos"
                            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Descripción de la categoría..."
                            rows={3}
                            className="w-full text-black px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Icono */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Ícono
                        </label>
                        <input
                            type="text"
                            value={formData.icon}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            placeholder="Ej: 📱, 👕, 🍎"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Imagen de la Categoría */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Imagen de la Categoría
                        </label>

                        {imagePreview ? (
                            /* Preview de imagen */
                            <div className="relative mb-4 inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    disabled={isUploadingImage}
                                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full p-2 transition-colors"
                                    title="Eliminar imagen"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            /* Área de carga */
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="text-gray-400 mb-2" size={32} />
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF (máximo 5MB)</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={isUploadingImage || isSubmitting}
                                    className="hidden"
                                />
                            </label>
                        )}

                        {isUploadingImage && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-700 text-sm">Subiendo imagen...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading || isUploadingImage}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isSubmitting ? 'Guardando...' : category ? 'Actualizar' : 'Crear'}
                    </button>
                </div>
            </form>
        )
    })
