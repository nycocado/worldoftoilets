/**
 * Exceções relacionadas ao módulo de denúncias de utilizadores.
 */
export const REPORT_USER_EXCEPTIONS = {
  REPORT_NOT_FOUND: 'Denúncia não encontrada.',
  ALREADY_PENDING: 'A denúncia já está pendente.',
  NOT_PENDING: 'A denúncia não está em status pendente.',
  TYPE_NOT_FOUND: 'Tipo de denúncia não encontrado.',
  CANNOT_REPORT_SELF: 'Não é possível denunciar a si próprio.',
  USER_NOT_FOUND: 'Utilizador denunciado não encontrado.',
  CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED:
    'Cannot return to pending status while other accepted reports exist for this user.',
} as const;
