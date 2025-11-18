/**
 * Constantes de Exceções de Toilets
 *
 * @constant TOILET_EXCEPTIONS
 * @description Mensagens de erro utilizadas nos endpoints de toilets.
 * Utilizadas para manter consistência nas respostas de erro e facilitar i18n.
 *
 * @property {string} TOILET_NOT_FOUND - Toilet não encontrado no sistema
 * @property {string} CITY_NOT_FOUND - Cidade não encontrada
 * @property {string} ACCESS_NOT_FOUND - Tipo de acesso não encontrado
 * @property {string} TYPE_EXTRA_NOT_FOUND - Tipo de extra não encontrado
 * @property {string} TOILET_ALREADY_DELETED - Toilet já foi deletado
 * @property {string} TOILET_DELETED - Ação não permitida em toilet deletado
 * @property {string} TOILET_NOT_DELETED - Toilet não está deletado
 * @property {string} TOILET_ALREADY_ACTIVE - Toilet já está ativo
 * @property {string} TOILET_ALREADY_INACTIVE - Toilet já está inativo
 * @property {string} TOILET_NOT_SUGGESTED - Toilet não está em status sugerido
 * @property {string} INVALID_COUNTRY_CODE - Código de país inválido
 * @property {string} INVALID_IMAGE_TYPE - Tipo de imagem inválido
 * @property {string} IMAGE_TOO_LARGE - Imagem excede tamanho máximo permitido
 */
export const TOILET_EXCEPTIONS = {
  TOILET_NOT_FOUND: 'Toilet not found.',
  CITY_NOT_FOUND: 'City not found.',
  ACCESS_NOT_FOUND: 'Access type not found.',
  TYPE_EXTRA_NOT_FOUND: 'Extra type not found.',
  TOILET_ALREADY_DELETED: 'Toilet is already deleted.',
  TOILET_DELETED: 'Cannot perform this action on a deleted toilet.',
  TOILET_NOT_DELETED: 'Toilet is not deleted.',
  TOILET_ALREADY_ACTIVE: 'Toilet is already active.',
  TOILET_ALREADY_INACTIVE: 'Toilet is already inactive.',
  TOILET_NOT_SUGGESTED: 'Toilet is not in suggested status.',
  INVALID_COUNTRY_CODE:
    'Could not determine country code for the provided country name. Please provide a valid country name or country code.',
  INVALID_IMAGE_TYPE:
    'Invalid image type. Only JPEG, PNG and WebP are allowed.',
  IMAGE_TOO_LARGE: 'Image is too large. Maximum file size is 5MB.',
};
