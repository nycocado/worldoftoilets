/**
 * Exceções relacionadas ao módulo de denúncias de respostas.
 */
export const REPORT_REPLY_EXCEPTIONS = {
  REPORT_NOT_FOUND: 'Denúncia não encontrada.',
  ALREADY_PENDING: 'A denúncia já está pendente.',
  NOT_PENDING: 'A denúncia não está em status pendente.',
  TYPE_NOT_FOUND: 'Tipo de denúncia não encontrado.',
  REPLY_ALREADY_REPORTED: 'Já denunciou esta resposta.',
  REPLY_NOT_FOUND: 'Resposta não encontrada.',
  CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED:
    'Cannot return to pending status while other accepted reports exist for this reply.',
} as const;
