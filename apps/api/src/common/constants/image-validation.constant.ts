/**
 * Mensagens de validação de imagens
 *
 * @description Constantes para mensagens de erro e validação relacionadas ao upload de imagens.
 * Centralizadas para facilitar manutenção, tradução e consistência.
 */
export const IMAGE_VALIDATION_MESSAGES = {
  UNABLE_TO_DETERMINE_FILE_TYPE:
    'Unable to determine file type. File may be corrupted or invalid.',
  INVALID_IMAGE_TYPE: (detected: string) =>
    `Invalid image type. Detected: ${detected}. Allowed: JPEG, PNG, WebP`,
  UNABLE_TO_READ_DIMENSIONS:
    'Unable to read image dimensions. File may be corrupted.',
  IMAGE_TOO_SMALL: (minWidth: number, minHeight: number) =>
    `Image too small. Minimum dimensions: ${minWidth}x${minHeight}px`,
  IMAGE_TOO_LARGE: (maxWidth: number, maxHeight: number) =>
    `Image too large. Maximum dimensions: ${maxWidth}x${maxHeight}px`,
  FAILED_TO_PROCESS_CORRUPTED:
    'Failed to process image. File may be corrupted or in an unsupported format.',
  FAILED_TO_PROCESS_INVALID:
    'Failed to process image. The file may be corrupted or contain invalid data.',
} as const;

/**
 * Configurações de validação de imagens
 *
 * @description Parâmetros configuráveis para validação de imagens.
 * Centralizados para facilitar ajustes de limites e formatos suportados.
 */
export const IMAGE_VALIDATION_CONFIG = {
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
  MIN_WIDTH: 100,
  MIN_HEIGHT: 100,
  MAX_WIDTH: 4096,
  MAX_HEIGHT: 4096,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MIME_TYPE_MAP: {
    jpeg: 'image/jpeg',
    jpg: 'image/jpeg',
    png: 'image/webp',
    webp: 'image/webp',
  } as const,
} as const;
