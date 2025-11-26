/**
 * Contém as mensagens de exceção para o módulo de denúncias de casas de banho.
 */
export const REPORT_TOILET_EXCEPTIONS = {
  REPORT_NOT_FOUND: 'Report not found.',
  TOILET_ALREADY_REPORTED: 'You have already reported this toilet.',
  REPORT_NOT_PENDING: 'Report is not in pending status.',
  REPORT_ALREADY_PENDING: 'Report is already pending.',
  CANNOT_RETURN_PENDING_WITH_OTHER_ACCEPTED:
    'Cannot return to pending status while other accepted reports exist for this toilet.',
};
