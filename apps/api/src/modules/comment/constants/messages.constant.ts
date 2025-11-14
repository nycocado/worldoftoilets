/**
 * Constantes de Mensagens de Comentários
 *
 * @constant COMMENT_MESSAGES
 * @description Mensagens de sucesso utilizadas nas respostas bem-sucedidas de comentários.
 * Mantém consistência nas mensagens e facilita internacionalização (i18n).
 *
 * @property {string} GET_BY_TOILET_SUCCESS - Listagem pública de comentários de toilet bem-sucedida
 * @property {string} GET_BY_TOILET_MANAGE_SUCCESS - Listagem de moderação de comentários de toilet bem-sucedida
 * @property {string} GET_BY_SELF_USER_SUCCESS - Listagem de próprios comentários bem-sucedida
 * @property {string} GET_BY_USER_SUCCESS - Listagem de comentários de utilizador específico bem-sucedida
 * @property {string} CREATE_COMMENT_SUCCESS - Criação de comentário bem-sucedida
 * @property {string} UPDATE_COMMENT_SUCCESS - Atualização de próprio comentário bem-sucedida
 * @property {string} UPDATE_COMMENT_MANAGE_SUCCESS - Atualização de comentário por moderador bem-sucedida
 * @property {string} DELETE_COMMENT_SUCCESS - Eliminação de próprio comentário bem-sucedida
 * @property {string} DELETE_COMMENT_MANAGE_SUCCESS - Eliminação de comentário por moderador bem-sucedida
 * @property {string} REACT_TO_COMMENT_SUCCESS - Reação a comentário bem-sucedida
 * @property {string} SHOW_COMMENT_SUCCESS - Comentário tornado visível por moderador bem-sucedido
 * @property {string} HIDE_COMMENT_SUCCESS - Comentário ocultado por moderador bem-sucedido
 * @property {string} UNDELETE_COMMENT_SUCCESS - Recuperação de comentário deletado por moderador bem-sucedida
 */
export const COMMENT_MESSAGES = {
  GET_BY_TOILET_SUCCESS:
    'Comments retrieved successfully for the specified toilet.',
  GET_BY_TOILET_MANAGE_SUCCESS:
    'Comments retrieved successfully for toilet management.',
  GET_BY_SELF_USER_SUCCESS: 'Comments retrieved successfully for the user.',
  GET_BY_USER_SUCCESS:
    'Comments retrieved successfully for the specified user.',
  CREATE_COMMENT_SUCCESS: 'Comment created successfully.',
  UPDATE_COMMENT_SUCCESS: 'Comment updated successfully.',
  UPDATE_COMMENT_MANAGE_SUCCESS: 'Comment updated successfully by admin.',
  DELETE_COMMENT_SUCCESS: 'Comment deleted successfully.',
  DELETE_COMMENT_MANAGE_SUCCESS: 'Comment deleted successfully by admin.',
  REACT_TO_COMMENT_SUCCESS: 'Reacted to comment successfully',
  SHOW_COMMENT_SUCCESS: 'Comment is now visible to all users.',
  HIDE_COMMENT_SUCCESS: 'Comment has been hidden from public view.',
  UNDELETE_COMMENT_SUCCESS: 'Comment has been restored successfully.',
};
