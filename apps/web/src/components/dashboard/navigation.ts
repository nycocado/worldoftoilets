import { ShieldAlert, LayoutDashboard, Users, FileText } from 'lucide-react';
import { pt } from '@/locales/pt';

const t = pt.navigation;

export const ADMIN_NAVIGATION = [
  {
    title: t.overview,
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
    title: t.admin.title,
    roles: ['admin', 'users-administrator'],
    items: [
      {
        title: t.admin.users,
        url: '/dashboard/users',
        icon: Users,
      },
      {
        title: t.admin.userReports,
        url: '/dashboard/reports/users',
        icon: ShieldAlert,
      },
    ],
  },
  {
    title: t.toilets.title,
    roles: ['admin', 'toilets-administrator'],
    items: [
      {
        title: t.toilets.reports,
        url: '/dashboard/reports/toilets',
        icon: ShieldAlert,
      },
      {
        title: t.toilets.suggestions,
        url: '/dashboard/suggestions',
        icon: FileText,
      },
    ],
  },
  {
    title: t.moderation.title,
    roles: ['admin', 'comments-administrator'],
    items: [
      {
        title: t.moderation.comments,
        url: '/dashboard/reports/comments',
        icon: ShieldAlert,
      },
      {
        title: t.moderation.replies,
        url: '/dashboard/reports/replies',
        icon: ShieldAlert,
      },
    ],
  },
];
