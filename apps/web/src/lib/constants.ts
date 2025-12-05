// Admin Roles
export const ADMIN_ROLES = [
  'comments-administrator',
  'toilets-administrator',
  'users-administrator',
  'partners-administrator',
  'dead-administrator',
] as const;

// Partner Role
export const PARTNER_ROLE = 'partner';

// Navigation Items
export const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    role: 'all',
  },
  {
    label: 'Meu Perfil',
    href: '/dashboard/profile',
    icon: 'User',
    role: 'all', // Everyone can access profile
  },
  {
    label: 'Meus Comentários',
    href: '/dashboard/comments',
    icon: 'MessageSquare',
    role: 'all',
  },
  {
    label: 'Minhas Sugestões',
    href: '/dashboard/suggestions',
    icon: 'Lightbulb',
    role: 'all',
  },
  // Admin Section
  {
    label: 'Gestão',
    isHeader: true,
    role: 'admin',
  },
  {
    label: 'Utilizadores',
    href: '/dashboard/users',
    icon: 'Users',
    role: 'users-administrator',
  },
  {
    label: 'Casas de Banho',
    href: '/dashboard/toilets',
    icon: 'MapPin',
    role: 'toilets-administrator',
  },
  {
    label: 'Parceiros',
    href: '/dashboard/partners',
    icon: 'Building2',
    role: 'partners-administrator',
  },
  {
    label: 'Sugestões',
    href: '/dashboard/manage-suggestions',
    icon: 'FileInput',
    role: 'toilets-administrator', // Usually handled by toilet admins
  },
  {
    label: 'Denúncias',
    href: '/dashboard/reports',
    icon: 'AlertTriangle',
    role: 'comments-administrator', // Or a generic 'admin' check
  },
] as const;

export function hasPermission(userRoles: { apiName: string }[], requiredRole: string): boolean {
  if (requiredRole === 'all') return true;
  if (requiredRole === 'admin') {
    return userRoles.some(r => ADMIN_ROLES.includes(r.apiName as typeof ADMIN_ROLES[number]));
  }
  return userRoles.some(r => r.apiName === requiredRole);
}