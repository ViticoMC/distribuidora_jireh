import { useState, useEffect, forwardRef } from 'react'
import { type Product, type Category } from '@/types'
import { Upload, X } from 'lucide-react'
import { uploadImage } from '@/services/cloudinaryService'

interface ProductFormProps {
    product?: Product
    categories: Category[]
    onSubmit: (data: {
        name: string
        description?: string
        price1?: number
        price2?: number
        price_delivery?: number
        weight?: number | null
        und_weigth?: string
        active?: boolean
        discount?: number
        discount_delivery?: number
        oferta?: string
        category_id?: number
        ima_url?: string
    }) => Promise<void>
    isLoading?: boolean
    onFormChange?: () => void
    isModal?: boolean
}

interface FormDataState {
    name: string
    description: string
    price1: string
    price2: string
    price_delivery: string
    weight: string
    und_weigth: string
    active: boolean
    discount: string
    discount_delivery: string
    oferta: string
    category_id: number
    ima_url: string
}

const createInitialState = (
    product?: Product,
    categories?: Category[]
): FormDataState => ({
    name: product?.name || '',
    description: product?.description || '',
    price1: product?.price1?.toString() || '',
    price2: product?.price2?.toString() || '',
    price_delivery: product?.price_delivery?.toString() || '',
    weight:
        product?.weight !== null &&
            product?.weight !== undefined
            ? product.weight.toString()
            : '',
    und_weigth: product?.und_weigth || 'kg',
    active:
        product?.active !== undefined
            ? product.active
            : true,
    discount: product?.discount?.toString() || '',
    discount_delivery:
        product?.discount_delivery?.toString() || '',
    oferta: product?.oferta || '',
    category_id:
        product?.category_id ||
        categories?.[0]?.id ||
        0,
    ima_url: product?.ima_url || '',
})

export const ProductForm = forwardRef<
    HTMLFormElement,
    ProductFormProps
>(
    (
        {
            product,
            categories,
            onSubmit,
            isLoading = false,
            isModal = false,
        },
        ref
    ) => {
        const [formData, setFormData] =
            useState<FormDataState>(
                createInitialState(product, categories)
            )

        const [isSubmitting, setIsSubmitting] =
            useState(false)

        const [error, setError] = useState('')
        const [success, setSuccess] = useState('')
        const [isUploadingImage, setIsUploadingImage] =
            useState(false)

        const [imagePreview, setImagePreview] =
            useState(product?.ima_url || '')

        useEffect(() => {
            const initialData = createInitialState(
                product,
                categories
            )

            setFormData(initialData)
            setImagePreview(product?.ima_url || '')
            setError('')
            setSuccess('')
        }, [product, categories])

        const handleInputChange = <
            K extends keyof FormDataState
        >(
            field: K,
            value: FormDataState[K]
        ) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }))
        }

        const handleImageUpload = async (
            e: React.ChangeEvent<HTMLInputElement>
        ) => {
            const file = e.target.files?.[0]

            if (!file) return

            if (!file.type.startsWith('image/')) {
                setError(
                    'Por favor selecciona un archivo de imagen válido'
                )
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(
                    'La imagen debe ser menor a 5MB'
                )
                return
            }

            try {
                setIsUploadingImage(true)
                setError('')

                const response =
                    await uploadImage(file)

                setFormData((prev) => ({
                    ...prev,
                    ima_url: response.secure_url,
                }))

                setImagePreview(response.secure_url)

                setSuccess(
                    'Imagen subida correctamente'
                )

                setTimeout(() => {
                    setSuccess('')
                }, 3000)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Error al subir la imagen'
                )
            } finally {
                setIsUploadingImage(false)
                e.target.value = ''
            }
        }

        const removeImage = () => {
            setFormData((prev) => ({
                ...prev,
                ima_url: '',
            }))

            setImagePreview('')
        }

        const parseNumber = (
            value: string,
            defaultValue = 0
        ) => {
            const parsed = Number(value)

            return isNaN(parsed)
                ? defaultValue
                : parsed
        }

        const handleSubmit = async (
            e: React.FormEvent
        ) => {
            e.preventDefault()

            setError('')
            setSuccess('')

            if (!formData.name.trim()) {
                setError(
                    'El nombre del producto es requerido'
                )
                return
            }

            if (!formData.ima_url.trim()) {
                setError(
                    'La foto del producto es requerida'
                )
                return
            }

            try {
                setIsSubmitting(true)

                const dataToSubmit = {
                    name: formData.name.trim(),
                    description:
                        formData.description.trim(),
                    price1: parseNumber(
                        formData.price1
                    ),
                    price2: parseNumber(
                        formData.price2
                    ),
                    price_delivery: parseNumber(
                        formData.price_delivery
                    ),
                    weight: formData.weight.trim()
                        ? parseNumber(
                            formData.weight,
                            0
                        )
                        : null,
                    und_weigth:
                        formData.und_weigth.trim(),
                    active: formData.active,
                    discount: parseNumber(
                        formData.discount
                    ),
                    discount_delivery: parseNumber(
                        formData.discount_delivery
                    ),
                    oferta: formData.oferta.trim(),
                    category_id:
                        formData.category_id,
                    ima_url: formData.ima_url,
                }

                await onSubmit(dataToSubmit)

                setSuccess(
                    product
                        ? 'Producto actualizado correctamente'
                        : 'Producto creado correctamente'
                )

                if (!product) {
                    setFormData(
                        createInitialState(
                            undefined,
                            categories
                        )
                    )

                    setImagePreview('')
                }

                setTimeout(() => {
                    setSuccess('')
                }, 3000)
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Error al guardar el producto'
                )
            } finally {
                setIsSubmitting(false)
            }
        }

        return (
            <form
                ref={ref}
                onSubmit={handleSubmit}
                className={
                    isModal
                        ? ''
                        : 'bg-white rounded-lg shadow-md p-6'
                }
            >
                {!isModal && (
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {product
                            ? 'Editar Producto'
                            : 'Crear Nuevo Producto'}
                    </h2>
                )}

                <div className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Nombre del Producto *
                        </label>

                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                                handleInputChange(
                                    'name',
                                    e.target.value
                                )
                            }
                            placeholder="Ej: iPhone 14 Pro"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                            onChange={(e) =>
                                handleInputChange(
                                    'description',
                                    e.target.value
                                )
                            }
                            placeholder="Descripción detallada del producto..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Precio Lista 1 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio para Lista 1 ($)
                            </label>

                            <input
                                type="text"
                                inputMode="decimal"
                                value={formData.price1}
                                onChange={(e) =>
                                    handleInputChange(
                                        'price1',
                                        e.target.value
                                    )
                                }
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Precio Lista 2 */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio para Lista 2 ($)
                            </label>

                            <input
                                type="text"
                                inputMode="decimal"
                                value={formData.price2}
                                onChange={(e) =>
                                    handleInputChange(
                                        'price2',
                                        e.target.value
                                    )
                                }
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Precio Delivery */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Precio para Delivery ($)
                            </label>

                            <input
                                type="text"
                                inputMode="decimal"
                                value={
                                    formData.price_delivery
                                }
                                onChange={(e) =>
                                    handleInputChange(
                                        'price_delivery',
                                        e.target.value
                                    )
                                }
                                placeholder="0.00"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Peso */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Peso
                            </label>

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    inputMode="decimal"
                                    value={formData.weight}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'weight',
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                    className="w-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    disabled={isSubmitting}
                                />

                                <input
                                    type="text"
                                    value={
                                        formData.und_weigth
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            'und_weigth',
                                            e.target.value
                                        )
                                    }
                                    placeholder="kg"
                                    className="w-24 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* Descuento */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Descuento (%)
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                value={formData.discount}
                                onChange={(e) =>
                                    handleInputChange(
                                        'discount',
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Descuento Delivery */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Descuento Delivery (%)
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                value={
                                    formData.discount_delivery
                                }
                                onChange={(e) =>
                                    handleInputChange(
                                        'discount_delivery',
                                        e.target.value
                                    )
                                }
                                placeholder="0"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Oferta */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Oferta
                            </label>

                            <input
                                type="text"
                                value={formData.oferta}
                                onChange={(e) =>
                                    handleInputChange(
                                        'oferta',
                                        e.target.value
                                    )
                                }
                                placeholder="Descripción de la oferta"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Categoría
                            </label>

                            <select
                                value={
                                    formData.category_id
                                }
                                onChange={(e) =>
                                    handleInputChange(
                                        'category_id',
                                        parseInt(
                                            e.target.value
                                        )
                                    )
                                }
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                                disabled={isSubmitting}
                            >
                                <option value="0">
                                    Selecciona una categoría
                                </option>

                                {categories.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                        className="text-black"
                                    >
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Imagen del Producto *
                        </label>

                        {imagePreview ? (
                            <div className="relative mb-4 inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    disabled={
                                        isUploadingImage
                                    }
                                    className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full p-2 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload
                                        className="text-gray-400 mb-2"
                                        size={32}
                                    />

                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">
                                            Haz clic para subir
                                        </span>{' '}
                                        o arrastra una imagen
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, GIF
                                        (máximo 5MB)
                                    </p>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageUpload
                                    }
                                    disabled={
                                        isUploadingImage ||
                                        isSubmitting
                                    }
                                    className="hidden"
                                />
                            </label>
                        )}

                        {isUploadingImage && (
                            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-blue-700 text-sm">
                                    Subiendo imagen...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="active"
                            checked={formData.active}
                            onChange={(e) =>
                                handleInputChange(
                                    'active',
                                    e.target.checked
                                )
                            }
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            disabled={isSubmitting}
                        />

                        <label
                            htmlFor="active"
                            className="text-sm font-semibold text-gray-700 cursor-pointer"
                        >
                            Producto Activo
                            (disponible en catálogo)
                        </label>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-700 text-sm font-medium">
                            {error}
                        </p>
                    </div>
                )}

                {success && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 text-sm font-medium">
                            {success}
                        </p>
                    </div>
                )}

                {/* Botón */}
                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={
                            isSubmitting ||
                            isLoading ||
                            isUploadingImage
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {isSubmitting
                            ? 'Guardando...'
                            : product
                                ? 'Actualizar'
                                : 'Crear'}
                    </button>
                </div>
            </form>
        )
    }
)

ProductForm.displayName = 'ProductForm'