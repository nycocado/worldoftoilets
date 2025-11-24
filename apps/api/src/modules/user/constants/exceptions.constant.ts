/**
 * Contém as mensagens de exceção para o módulo de utilizador.
 */
export const USER_EXCEPTIONS = {
  USER_NOT_FOUND: 'User not found.',
  USER_ALREADY_DEACTIVATED: 'User is already deactivated.',
  USER_NOT_DEACTIVATED: 'User is not deactivated.',
  CANNOT_DEACTIVATE_SELF:
    'Cannot deactivate your own account using admin endpoint.',
  ROLE_NOT_FOUND: 'One or more roles not found.',
  ROLE_ALREADY_ASSIGNED: 'One or more roles are already assigned to the user.',
  ROLE_NOT_ASSIGNED: 'One or more roles are not assigned to the user.',
};
