/**
 * Constantes de Mensagens de Toilets
 *
 * @constant TOILET_MESSAGES
 * @description Mensagens de sucesso utilizadas nas respostas bem-sucedidas de toilets.
 * Mantém consistência nas mensagens e facilita internacionalização (i18n).
 *
 * @property {string} GET_TOILET_SUCCESS - Obtenção de toilet bem-sucedida
 * @property {string} GET_TOILET_MANAGE_SUCCESS - Obtenção de toilet para gestão bem-sucedida
 * @property {string} GET_TOILETS_SUCCESS - Listagem de toilets bem-sucedida
 * @property {string} GET_TOILETS_BOUNDING_BOX_SUCCESS - Obtenção de toilets por bounding box bem-sucedida
 * @property {string} GET_TOILETS_PROXIMITY_SUCCESS - Obtenção de toilets por proximidade bem-sucedida
 * @property {string} SEARCH_TOILETS_SUCCESS - Pesquisa de toilets bem-sucedida
 * @property {string} CREATE_TOILET_SUCCESS - Criação de toilet bem-sucedida
 * @property {string} UPDATE_TOILET_SUCCESS - Atualização de toilet bem-sucedida
 * @property {string} DELETE_TOILET_SUCCESS - Eliminação de toilet bem-sucedida
 * @property {string} UNDELETE_TOILET_SUCCESS - Recuperação de toilet deletado bem-sucedida
 * @property {string} PUBLISH_TOILET_SUCCESS - Publicação de toilet sugerido bem-sucedida
 * @property {string} DISABLE_TOILET_SUCCESS - Desativação de toilet bem-sucedida
 * @property {string} ENABLE_TOILET_SUCCESS - Ativação de toilet bem-sucedida
 * @property {string} VIEW_TOILET_SUCCESS - Registo de visualização de toilet bem-sucedido
 * @property {string} UPLOAD_IMAGE_SUCCESS - Upload de imagem de toilet bem-sucedido
 */
export const TOILET_MESSAGES = {
  GET_TOILET_SUCCESS: 'Toilet retrieved successfully.',
  GET_TOILET_MANAGE_SUCCESS: 'Toilet retrieved successfully for management.',
  GET_TOILETS_SUCCESS: 'Toilets retrieved successfully.',
  GET_TOILETS_BOUNDING_BOX_SUCCESS:
    'Toilets retrieved successfully by bounding box.',
  GET_TOILETS_PROXIMITY_SUCCESS: 'Toilets retrieved successfully by proximity.',
  SEARCH_TOILETS_SUCCESS: 'Toilets search completed successfully.',
  CREATE_TOILET_SUCCESS: 'Toilet created successfully.',
  UPDATE_TOILET_SUCCESS: 'Toilet updated successfully.',
  DELETE_TOILET_SUCCESS: 'Toilet deleted successfully.',
  UNDELETE_TOILET_SUCCESS: 'Toilet undeleted successfully.',
  PUBLISH_TOILET_SUCCESS: 'Toilet published successfully.',
  DISABLE_TOILET_SUCCESS: 'Toilet disabled successfully.',
  ENABLE_TOILET_SUCCESS: 'Toilet enabled successfully.',
  VIEW_TOILET_SUCCESS: 'Toilet view recorded successfully.',
  UPLOAD_IMAGE_SUCCESS: 'Toilet image uploaded successfully.',
};
