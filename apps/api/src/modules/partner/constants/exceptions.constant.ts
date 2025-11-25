/**
 * Contém as mensagens de exceção para o módulo de parcerias.
 */
export const PARTNER_EXCEPTIONS = {
  PARTNER_NOT_FOUND: 'Partner not found.',
  TOILET_NOT_FOUND: 'Toilet not found.',
  TOILET_ALREADY_HAS_PARTNER: 'This toilet already has an active partner.',
  TOILET_HAS_PENDING_APPLICATION:
    'This toilet already has a pending partner application.',
  APPLICATION_NOT_PENDING: 'Partner application is not in pending status.',
  PARTNER_NOT_ACTIVE: 'Partner is not active.',
  PARTNER_ALREADY_ACTIVE: 'Partner is already active.',
  PARTNER_ALREADY_INACTIVE: 'Partner is already inactive.',
  INVALID_CERTIFICATE_TYPE:
    'Invalid certificate type. Only PDF, JPEG, PNG and WebP are allowed.',
  CERTIFICATE_TOO_LARGE: 'Certificate is too large. Maximum file size is 10MB.',
  CERTIFICATE_REQUIRED: 'Certificate document is required.',
};
