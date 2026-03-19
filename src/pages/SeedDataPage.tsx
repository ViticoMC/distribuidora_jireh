import { useState } from 'react'
import { createCategories, getCategories } from '@/services/categoriesService'
import { createProducts, getProducts } from '@/services/productsService'

interface Category {
  id: number
  name: string
  description?: string
  icon?: string
}

interface Product {
  id: number
  name: string
  description?: string
  price: number
  weight?: number
  active: boolean
  discount?: number
  category_id: number
  img_id?: string
  ima_url?: string
}

interface SeedStatus {
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
  categories?: Category[]
  products?: Product[]
  error?: string
}

const mockCategories = [
  {
    name: 'Electrónica',
    description: 'Dispositivos y equipos electrónicos',
    icon: '📱',
  },
  {
    name: 'Ropa',
    description: 'Prendas de vestir y accesorios',
    icon: '👕',
  },
  {
    name: 'Alimentos',
    description: 'Productos alimenticios frescos y procesados',
    icon: '🍕',
  },
  {
    name: 'Libros',
    description: 'Libros y material de lectura',
    icon: '📚',
  },
  {
    name: 'Hogar',
    description: 'Artículos para el hogar y decoración',
    icon: '🏠',
  },
]

const mockProducts = [
  // Electrónica (5)
  {
    name: 'iPhone 15 Pro',
    description: 'Smartphone con procesador A17 Pro',
    price: 999.99,
    weight: 0.187,
    active: true,
    discount: 0,
    category_id: 1,
    ima_url: 'https://via.placeholder.com/300x300?text=iPhone15',
  },
  {
    name: 'Samsung Galaxy S24',
    description: 'Teléfono inteligente con pantalla AMOLED',
    price: 899.99,
    weight: 0.168,
    active: true,
    discount: 10,
    category_id: 1,
    ima_url: 'https://via.placeholder.com/300x300?text=GalaxyS24',
  },
  {
    name: 'iPad Air',
    description: 'Tablet de 11 pulgadas con M1',
    price: 599.99,
    weight: 0.462,
    active: true,
    discount: 0,
    category_id: 1,
    ima_url: 'https://via.placeholder.com/300x300?text=iPadAir',
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Auriculares inalámbricos con cancelación de ruido',
    price: 349.99,
    weight: 0.25,
    active: true,
    discount: 5,
    category_id: 1,
    ima_url: 'https://via.placeholder.com/300x300?text=SonyXM5',
  },
  {
    name: 'MacBook Pro 16"',
    description: 'Laptop profesional con M3 Max',
    price: 3499.99,
    weight: 2.15,
    active: true,
    discount: 0,
    category_id: 1,
    ima_url: 'https://via.placeholder.com/300x300?text=MacBook',
  },
  // Ropa (5)
  {
    name: 'Camiseta Nike Essentials',
    description: 'Camiseta de algodón 100%',
    price: 24.99,
    weight: 0.18,
    active: true,
    discount: 0,
    category_id: 2,
    ima_url: 'https://via.placeholder.com/300x300?text=NikeShirt',
  },
  {
    name: 'Jeans Levis 501',
    description: 'Jeans clásico azul oscuro',
    price: 89.99,
    weight: 0.65,
    active: true,
    discount: 15,
    category_id: 2,
    ima_url: 'https://via.placeholder.com/300x300?text=Levis501',
  },
  {
    name: 'Chaqueta Adidas',
    description: 'Chaqueta deportiva impermeable',
    price: 129.99,
    weight: 0.88,
    active: true,
    discount: 0,
    category_id: 2,
    ima_url: 'https://via.placeholder.com/300x300?text=AdidasJacket',
  },
  {
    name: 'Zapatos Running Asics',
    description: 'Tenis para correr de alto rendimiento',
    price: 139.99,
    weight: 0.35,
    active: true,
    discount: 10,
    category_id: 2,
    ima_url: 'https://via.placeholder.com/300x300?text=AsicsShoes',
  },
  {
    name: 'Gorro Beanie',
    description: 'Gorro de invierno tejido',
    price: 19.99,
    weight: 0.1,
    active: true,
    discount: 0,
    category_id: 2,
    ima_url: 'https://via.placeholder.com/300x300?text=Beanie',
  },
  // Alimentos (3)
  {
    name: 'Aceite de Oliva Extra Virgen',
    description: 'Aceite de oliva prensado en frío',
    price: 14.99,
    weight: 0.75,
    active: true,
    discount: 0,
    category_id: 3,
    ima_url: 'https://via.placeholder.com/300x300?text=OliveOil',
  },
  {
    name: 'Café Premium Colombiano',
    description: 'Granos de café de alta calidad',
    price: 12.99,
    weight: 0.5,
    active: true,
    discount: 5,
    category_id: 3,
    ima_url: 'https://via.placeholder.com/300x300?text=Coffee',
  },
  {
    name: 'Chocolate Belga 70%',
    description: 'Chocolate negro con 70% cacao',
    price: 8.99,
    weight: 0.2,
    active: true,
    discount: 0,
    category_id: 3,
    ima_url: 'https://via.placeholder.com/300x300?text=Chocolate',
  },
  // Libros (2)
  {
    name: 'El Quijote',
    description: 'Novela clásica de Cervantes',
    price: 19.99,
    weight: 0.8,
    active: true,
    discount: 0,
    category_id: 4,
    ima_url: 'https://via.placeholder.com/300x300?text=Quijote',
  },
  {
    name: 'Clean Code',
    description: 'Guía para escribir código limpio',
    price: 34.99,
    weight: 0.95,
    active: true,
    discount: 5,
    category_id: 4,
    ima_url: 'https://via.placeholder.com/300x300?text=CleanCode',
  },
]

export function SeedDataPage() {
  const [status, setStatus] = useState<SeedStatus>({
    status: 'idle',
    message: 'Presiona el botón para llenar las tablas con datos',
  })

  const seedData = async () => {
    try {
      setStatus({
        status: 'loading',
        message: 'Insertando categorías y productos...',
      })

      // Insertar categorías
      console.log('Creando categorías...')
      const createdCategories = await createCategories(mockCategories)
      console.log('Categorías creadas:', createdCategories)

      // Prepara los productos con los IDs de categorías correctos
      const categoryMap: { [key: string]: number } = {}
      createdCategories.forEach((cat: Category) => {
        // Busca por nombre para mapear el ID correcto
        const originalIndex = mockCategories.findIndex((mc) => mc.name === cat.name)
        categoryMap[originalIndex] = cat.id
      })

      const productsWithIds = mockProducts.map((product, index) => ({
        ...product,
        category_id: categoryMap[
          Math.floor(index / 3)
        ] || createdCategories[Math.floor(index / 3)]?.id || 1,
      }))

      // Insertar productos
      console.log('Creando productos...')
      const createdProducts = await createProducts(productsWithIds)
      console.log('Productos creados:', createdProducts)

      // Obtener datos finales
      const allCategories = await getCategories()
      const allProducts = await getProducts()

      setStatus({
        status: 'success',
        message: `✓ Datos insertados correctamente: ${createdCategories.length} categorías y ${createdProducts.length} productos`,
        categories: allCategories,
        products: allProducts,
      })

      console.log('=== DATOS INSERTADOS ===')
      console.log(`Categorías: ${createdCategories.length}`, createdCategories)
      console.log(`Productos: ${createdProducts.length}`, createdProducts)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setStatus({
        status: 'error',
        message: `Error al insertar datos: ${errorMessage}`,
        error: errorMessage,
      })
      console.error('Error al insertar datos:', errorMessage)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Seed Data</h1>
          <p className="text-gray-600 mb-8">
            Llena automáticamente las tablas de categorías y productos con datos de prueba
          </p>

          {/* Status Alert */}
          {status.status === 'loading' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-blue-700 font-medium">{status.message}</p>
            </div>
          )}

          {status.status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">{status.message}</p>
              {status.categories && status.products && (
                <p className="text-green-600 text-sm mt-2">
                  Total en BD: {status.categories.length} categorías, {status.products.length} productos
                </p>
              )}
            </div>
          )}

          {status.status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600 text-sm mt-2">{status.error}</p>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={seedData}
            disabled={status.status === 'loading'}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {status.status === 'loading' ? 'Insertando datos...' : 'Llenar Tablas con Mock Data'}
          </button>

          {/* Data Preview */}
          {status.categories && status.categories.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorías Creadas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {status.categories.map((category: Category) => (
                  <div
                    key={category.id}
                    className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg"
                  >
                    <div className="text-3xl mb-2">{category.icon || '📦'}</div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                    <p className="text-xs text-gray-500 mt-2">ID: {category.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Table */}
          {status.products && status.products.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Productos Creados</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Nombre</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-900">Descripción</th>
                      <th className="px-4 py-2 text-right font-semibold text-gray-900">Precio</th>
                      <th className="px-4 py-2 text-center font-semibold text-gray-900">Desc.</th>
                      <th className="px-4 py-2 text-center font-semibold text-gray-900">Activo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {status.products.map((product: Product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 font-medium text-gray-900">{product.name}</td>
                        <td className="px-4 py-2 text-gray-600 truncate max-w-xs">
                          {product.description}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-900 font-semibold">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-center text-gray-600">
                          {product.discount}%
                        </td>
                        <td className="px-4 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${product.active
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {product.active ? 'Sí' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">ℹ️ Información</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Se crearán <strong>5 categorías</strong></li>
              <li>• Se crearán <strong>15 productos</strong> distribuidos entre las categorías</li>
              <li>• Todas las imágenes son URLs placeholder</li>
              <li>• Los precios y pesos son ficticios para demostración</li>
              <li>• Abre la consola (F12) para ver logs detallados</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
