/**
 * Contém as mensagens de exceção para o módulo de casas de banho.
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
