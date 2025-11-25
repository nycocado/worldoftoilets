/**
 * Contém as mensagens de exceção para o módulo de sugestões.
 */
export const SUGGESTION_EXCEPTIONS = {
  SUGGESTION_NOT_FOUND: 'Suggestion not found.',
  SUGGESTION_ALREADY_REVIEWED: 'Suggestion has already been reviewed.',
  SUGGESTION_NOT_PENDING:
    'Only pending suggestions can have their status changed.',
  CANNOT_DELETE_REVIEWED_SUGGESTION: 'Cannot delete a reviewed suggestion.',
  SUGGESTION_ALREADY_PENDING: 'Suggestion is already in pending status.',
  ONLY_PENDING_CAN_UPLOAD_IMAGE:
    'Can only upload images to pending suggestions.',
  ONLY_ACCEPTED_CAN_PUBLISH_IMAGE:
    'Only accepted suggestions can have their image published.',
  SUGGESTION_NO_IMAGE: 'Suggestion does not have an image to publish.',
  TOILET_MUST_BE_ACTIVE_TO_PUBLISH_IMAGE:
    'Toilet must be active to publish suggestion image.',
  INVALID_IMAGE_URL_FORMAT: 'Invalid image URL format.',
  INVALID_IMAGE_TYPE: 'Invalid image type.',
  IMAGE_TOO_LARGE: 'Image too large (max 5MB).',
};
