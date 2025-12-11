import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  MessageSquare,
  MapPin,
  Handshake,
  FileText,
  Building2,
} from 'lucide-react';

export const ADMIN_NAVIGATION = [
  {
    title: 'Visão Geral',
    url: '/dashboard',
    icon: LayoutDashboard,
    roles: [
      'admin',
      'users-administrator',
      'toilets-administrator',
      'comments-administrator',
      'partners-administrator',
      'partner',
    ],
  },
  {
    title: 'Administração',
    roles: ['admin', 'users-administrator'],
    items: [
      {
        title: 'Utilizadores',
        url: '/dashboard/users',
        icon: Users,
      },
      {
        title: 'Denúncias de Users',
        url: '/dashboard/reports/users',
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: 'Casas de Banho',
    roles: ['admin', 'toilets-administrator'],
    items: [
      {
        title: 'Denúncias de Casas de Banho',
        url: '/dashboard/reports/toilets',
        icon: ShieldAlert,
      },
      {
        title: 'Sugestões',
        url: '/dashboard/suggestions',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Moderação',
    roles: ['admin', 'comments-administrator'],
    items: [
      {
        title: 'Denúncias Comentários',
        url: '/dashboard/reports/comments',
        icon: ShieldAlert,
      },
      {
        title: 'Denúncias de Respostas',
        url: '/dashboard/reports/replies',
        icon: ShieldAlert,
      },
    ],
  },
];
