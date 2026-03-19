# Configuración de Cloudinary para Distribuidora Jireh

Esta guía explica cómo configurar Cloudinary para gestionar las imágenes de los productos.

## Prerequisitos

1. Una cuenta en [Cloudinary](https://cloudinary.com) (puedes crear una gratis)

## Pasos de Configuración

### 1. Obtener las Credenciales de Cloudinary

1. Inicia sesión en [Cloudinary Dashboard](https://cloudinary.com/console)
2. En la página principal, encontrarás tu **Cloud Name** en la sección "Account Details"
3. Para el **API Key**, ve a la esquina superior derecha → Settings (engranaje) → Account → API Keys
4. Copia tu API Key y API Secret (guarda el Secret en lugar seguro, no lo publiques)

### 2. Crear un Upload Preset

Los upload presets permiten subir imágenes sin exponer el API Secret:

1. Ve a Settings (engranaje) → Upload
2. En la sección "Upload Presets", haz clic en "Create upload preset"
3. Configura:
   - **Name**: `distribuidora_jireh` (o el que prefieras)
   - **Signing Mode**: `Unsigned` (importante para cliente-side uploads)
   - **Folder**: `distribuidora_jireh/products` (para organizar las imágenes)
   - **Save**: Haz clic en "Save"

### 3. Configurar las Variables de Entorno

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego actualiza las siguientes variables:

```env
# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=distribuidora_jireh
VITE_CLOUDINARY_API_KEY=tu_api_key
```

## Cómo Funciona la Integración

### Subida de Imágenes ✅

1. En el formulario de productos, haz clic en el área de carga o selecciona un archivo
2. La imagen se sube directamente a Cloudinary
3. La URL de la imagen se guarda automáticamente en la base de datos

### Optimización de Imágenes ✅

Las imágenes se optimizan automáticamente mediante transformaciones de Cloudinary:

- Redimensionamiento automático
- Compresión inteligente
- Formato WebP para navegadores soportados

### Eliminación de Imágenes ⚠️ IMPORTANTE

**Estado Actual:** Cuando borras un producto, la imagen **NO se elimina automáticamente** de Cloudinary porque:

1. El cliente (frontend) **NO PUEDE** eliminar imágenes de Cloudinary de forma segura
2. Hacerlo requeriría exponer el API Secret, lo cual es un riesgo de seguridad

**Soluciones:**

#### Opción A: Mantenimiento Manual (Actual)

- Las imágenes no usadas permanecen en Cloudinary
- Puedes eliminarlas manualmente desde el [Cloudinary Dashboard](https://cloudinary.com/console)
- Los límites gratuitos son generosos (25 GB), así que esto no es crítico

#### Opción B: Crear un Backend (Recomendado)

- Ve a [CLOUDINARY_BACKEND_EXAMPLE.js](CLOUDINARY_BACKEND_EXAMPLE.js) para un ejemplo completo
- Crea un endpoint en tu backend que maneje la eliminación
- Expón tu API Secret **solo en el servidor**, no en el cliente

**Ejemplo rápido con Express:**

```javascript
app.post("/api/cloudinary/delete", async (req, res) => {
  const { public_id } = req.body;
  // Eliminar usando cloudinary SDK con API Secret
  // ...
});
```

## Funciones Disponibles

El servicio de Cloudinary (`src/services/cloudinaryService.ts`) proporciona:

- **`uploadImage(file, folder)`**: Sube una imagen ✅
  - Validación de tipo (debe ser imagen)
  - Validación de tamaño (máximo 5MB)
  - Retorna: `{ public_id, secure_url, ... }`

- **`deleteImage(publicId)`**: Intenta eliminar una imagen
  - Cliente-side only (no es seguro sin backend)
  - Loguea información para implementación futura

- **`getImageUrl(publicId, options)`**: Obtiene URL optimizada ✅
  - Soporte para transformaciones (ancho, alto, calidad)

- **`getThumbnailUrl(publicId)`**: Obtiene URL de miniatura (300x300) ✅

- **`getPublicIdFromUrl(url)`**: Extrae el public_id de una URL ✅

## Troubleshooting

### Error: "Cloudinary configuration is missing"

Asegúrate de que las variables de entorno están configuradas correctamente en `.env.local`:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`
- Recargá el servidor con `npm run dev` después de cambiar `.env.local`

### Las imágenes no se cargan después de subir

1. Verifica que el Upload Preset esté configurado como `Unsigned`
2. Comprueba que la carpeta en Upload Preset es `distribuidora_jireh/products`
3. Abre la consola del navegador (F12) para ver mensajes de error
4. Verifica que las variables de entorno sean correctas

### Las imágenes no se eliminan al borrar productos

Esto es **esperado y seguro**. Ver sección "Eliminación de Imágenes" arriba.

## Límites de Almacenamiento

Con la cuenta gratuita de Cloudinary:

- **Almacenamiento**: 25 GB
- **Transformaciones**: Ilimitadas
- **Solicitudes API**: 500 por hora
- **Recursos**: 500,000 máximo

Para más información, visita la [documentación de Cloudinary](https://cloudinary.com/documentation).
