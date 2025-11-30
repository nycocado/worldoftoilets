/**
 * Constrói a URL pública completa a partir do caminho relativo de um arquivo no MinIO.
 *
 * @param {string | null | undefined} filePath O caminho relativo do arquivo (ex: 'toilets/uuid.jpg').
 * @returns {string} A URL completa do arquivo ou string vazia se o caminho for inválido.
 *
 * @example
 * buildMinioFileUrl('toilets/abc123.jpg')
 * // Retorna: 'https://storage.example.com/worldoftoilets/toilets/abc123.jpg'
 */
export function buildMinioFileUrl(
  filePath: string | null | undefined,
): string {
  if (!filePath) return '';

  const publicUrl = process.env.MINIO_PUBLIC_URL;
  const bucket = process.env.MINIO_BUCKET || 'worldoftoilets';

  if (publicUrl) {
    return `${publicUrl}/${bucket}/${filePath}`;
  }

  const endPoint = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || '9000';
  const useSSL = process.env.MINIO_USE_SSL === 'true';

  return `http${useSSL ? 's' : ''}://${endPoint}:${port}/${bucket}/${filePath}`;
}
