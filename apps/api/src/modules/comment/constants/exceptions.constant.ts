/**
 * Constantes de Exceções de Comentários
 *
 * @constant COMMENT_EXCEPTIONS
 * @description Mensagens de erro utilizadas nos endpoints de comentários.
 * Utilizadas para manter consistência nas respostas de erro e facilitar i18n.
 *
 * @property {string} COMMENT_NOT_FOUND - Comentário não encontrado no sistema
 * @property {string} COMMENT_NOT_OWNED - Utilizador não é proprietário do comentário
 * @property {string} COMMENT_DELETED - Comentário foi deletado e não pode ser modificado
 */
export const COMMENT_EXCEPTIONS = {
  COMMENT_NOT_FOUND: 'Comment not found',
  COMMENT_NOT_OWNED: 'You do not own this comment',
  COMMENT_DELETED: 'Comment has been deleted',
};
