/**
 * Constantes de Mensagens de Respostas
 *
 * @constant REPLY_MESSAGES
 * @description Mensagens de sucesso utilizadas nas respostas bem-sucedidas de replies.
 * Mantém consistência nas mensagens e facilita internacionalização (i18n).
 *
 * @property {string} GET_BY_COMMENT_SUCCESS - Listagem pública de respostas de comentário bem-sucedida
 * @property {string} GET_BY_COMMENT_MANAGE_SUCCESS - Listagem de moderação de respostas de comentário bem-sucedida
 * @property {string} GET_BY_SELF_USER_SUCCESS - Listagem de próprias respostas bem-sucedida
 * @property {string} GET_BY_USER_SUCCESS - Listagem de respostas de utilizador específico bem-sucedida
 * @property {string} CREATE_REPLY_SUCCESS - Criação de resposta bem-sucedida
 * @property {string} UPDATE_REPLY_SUCCESS - Atualização de própria resposta bem-sucedida
 * @property {string} UPDATE_REPLY_MANAGE_SUCCESS - Atualização de resposta por moderador bem-sucedida
 * @property {string} DELETE_REPLY_SUCCESS - Eliminação de própria resposta bem-sucedida
 * @property {string} DELETE_REPLY_MANAGE_SUCCESS - Eliminação de resposta por moderador bem-sucedida
 * @property {string} SHOW_REPLY_SUCCESS - Resposta tornada visível por moderador bem-sucedido
 * @property {string} HIDE_REPLY_SUCCESS - Resposta ocultada por moderador bem-sucedido
 * @property {string} UNDELETE_REPLY_SUCCESS - Recuperação de resposta deletada por moderador bem-sucedida
 */
export const REPLY_MESSAGES = {
  GET_BY_COMMENT_SUCCESS:
    'Replies retrieved successfully for the specified comment.',
  GET_BY_COMMENT_MANAGE_SUCCESS:
    'Replies retrieved successfully for comment management.',
  GET_BY_SELF_USER_SUCCESS: 'Replies retrieved successfully for the user.',
  GET_BY_USER_SUCCESS: 'Replies retrieved successfully for the specified user.',
  CREATE_REPLY_SUCCESS: 'Reply created successfully.',
  UPDATE_REPLY_SUCCESS: 'Reply updated successfully.',
  UPDATE_REPLY_MANAGE_SUCCESS: 'Reply updated successfully by admin.',
  DELETE_REPLY_SUCCESS: 'Reply deleted successfully.',
  DELETE_REPLY_MANAGE_SUCCESS: 'Reply deleted successfully by admin.',
  SHOW_REPLY_SUCCESS: 'Reply is now visible to all users.',
  HIDE_REPLY_SUCCESS: 'Reply has been hidden from public view.',
  UNDELETE_REPLY_SUCCESS: 'Reply has been restored successfully.',
};
