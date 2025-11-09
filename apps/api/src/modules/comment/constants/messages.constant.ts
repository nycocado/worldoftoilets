/**
 * Constantes de Mensagens de Comentários
 *
 * @constant COMMENT_MESSAGES
 * @description Mensagens de sucesso utilizadas nas respostas bem-sucedidas de comentários.
 * Mantém consistência nas mensagens e facilita internacionalização (i18n).
 *
 * @property {string} GET_BY_TOILET_SUCCESS - Comentários recuperados com sucesso para a casa de banho especificada
 * @property {string} GET_BY_SELF_USER_SUCCESS - Comentários recuperados com sucesso para o utilizador
 * @property {string} CREATE_COMMENT_SUCCESS - Comentário criado com sucesso
 * @property {string} UPDATE_COMMENT_SUCCESS - Comentário atualizado com sucesso
 */
export const COMMENT_MESSAGES = {
  GET_BY_TOILET_SUCCESS:
    'Comments retrieved successfully for the specified toilet.',
  GET_BY_SELF_USER_SUCCESS: 'Comments retrieved successfully for the user.',
  CREATE_COMMENT_SUCCESS: 'Comment created successfully.',
  UPDATE_COMMENT_SUCCESS: 'Comment updated successfully.',
  DELETE_COMMENT_SUCCESS: 'Comment deleted successfully.',
};
