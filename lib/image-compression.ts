/**
 * Comprime una imagen en el navegador antes de subirla al servidor
 * Convierte a WebP y reduce dimensiones si es necesario
 *
 * @param file - Archivo de imagen original
 * @param maxWidth - Ancho máximo en píxeles (default: 1600)
 * @param quality - Calidad de compresión 0-1 (default: 0.8)
 * @returns Nueva imagen comprimida como File
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1600,
  quality: number = 0.8
): Promise<File> {
  try {
    // 1. Crear canvas y cargar imagen
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");

    // 2. Calcular dimensiones manteniendo aspect ratio
    const scale = Math.min(1, maxWidth / bitmap.width);
    canvas.width = bitmap.width * scale;
    canvas.height = bitmap.height * scale;

    // 3. Dibujar imagen redimensionada
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("No se pudo obtener el contexto 2D del canvas");
    }

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // 4. Convertir a WebP con calidad reducida
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("Error al convertir canvas a blob"));
          }
        },
        "image/webp",
        quality
      );
    });

    // 5. Retornar como File
    const fileName = file.name.replace(/\.[^.]+$/, ".webp");
    return new File([blob], fileName, { type: "image/webp" });
  } catch (error) {
    console.error("Error al comprimir imagen:", error);
    // Si falla la compresión, retornar el archivo original
    return file;
  }
}

/**
 * Comprime múltiples imágenes en paralelo
 *
 * @param files - Array de archivos de imagen
 * @param maxWidth - Ancho máximo en píxeles (default: 1600)
 * @param quality - Calidad de compresión 0-1 (default: 0.8)
 * @returns Array de imágenes comprimidas
 */
export async function compressImages(
  files: File[],
  maxWidth: number = 1600,
  quality: number = 0.8
): Promise<File[]> {
  return Promise.all(
    files.map((file) => compressImage(file, maxWidth, quality))
  );
}
