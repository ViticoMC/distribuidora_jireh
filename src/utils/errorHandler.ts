/**
 * Interfaz para errores de Supabase
 */
interface SupabaseError {
  code?: string;
  message?: string;
  details?: string;
  hint?: string;
}

/**
 * Traduce errores de base de datos a mensajes en español
 */
export function translateDatabaseError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    // Primero verificar si el error tiene propiedades code y details adjuntas
    const customError = error as any;
    if (customError.code && customError.details) {
      return translateSupabaseError({
        code: customError.code,
        message: error.message,
        details: customError.details,
      });
    }

    // Intentar parsear como JSON si es un error de Supabase
    try {
      const parsed = JSON.parse(error.message) as SupabaseError;
      return translateSupabaseError(parsed);
    } catch {
      // Si no es JSON, usar el mensaje directamente
      return translateSupabaseError({
        message: error.message,
      } as SupabaseError);
    }
  }

  if (typeof error === "object" && error !== null) {
    return translateSupabaseError(error as SupabaseError);
  }

  return "Ocurrió un error inesperado";
}

/**
 * Traduce un error específico de Supabase
 */
function translateSupabaseError(error: SupabaseError): string {
  const code = error.code || "";
  const message = error.message || "";
  //   const details = error.details || "";

  // Error 23503: Violación de restricción de clave foránea
  if (code === "23503" || message.includes("foreign key constraint")) {
    // Extraer el nombre de la tabla referenciada
    // const tableMatch = details.match(/from table "([^"]+)"/);
    // const referencedTable = tableMatch ? tableMatch[1] : "productos";

    return `No se puede eliminar esta categoría porque tiene productos asociados. Elimina o reasigna los productos primero.`;
  }

  // Error 23505: Violación de restricción única
  if (code === "23505" || message.includes("unique constraint")) {
    return "Este registro ya existe. Por favor, usa un nombre diferente.";
  }

  // Error 23502: Violación de NOT NULL
  if (code === "23502" || message.includes("not-null constraint")) {
    return "Faltan campos requeridos. Por favor, completa todos los campos obligatorios.";
  }

  // Error 23514: Violación de CHECK constraint
  if (code === "23514" || message.includes("check constraint")) {
    return "El valor ingresado no cumple con los requisitos del sistema.";
  }

  // Si el mensaje ya está en español, usarlo directamente
  if (message && isSpanish(message)) {
    return message;
  }

  // Mensaje genérico
  return message || "Ocurrió un error al procesar la solicitud";
}

/**
 * Verifica si un texto está en español
 */
function isSpanish(text: string): boolean {
  const spanishChars = /[áéíóúñ¡¿]/;
  return spanishChars.test(text);
}
