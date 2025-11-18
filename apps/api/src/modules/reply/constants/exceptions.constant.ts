/**
 * Constantes de Exceções de Respostas
 *
 * @constant REPLY_EXCEPTIONS
 * @description Mensagens de erro utilizadas nos endpoints de respostas.
 * Utilizadas para manter consistência nas respostas de erro e facilitar i18n.
 *
 * @property {string} REPLY_NOT_FOUND - Resposta não encontrada no sistema
 * @property {string} REPLY_NOT_OWNED - Utilizador não é proprietário da resposta
 * @property {string} REPLY_DELETED - Resposta foi deletada e não pode ser modificada
 */
export const REPLY_EXCEPTIONS = {
  REPLY_NOT_FOUND: 'Reply not found',
  REPLY_NOT_OWNED: 'You do not own this reply',
  REPLY_DELETED: 'Reply has been deleted',
};
