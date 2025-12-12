'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, XCircle } from 'lucide-react';
import type { UserAdminResponseDto } from '@/types/user';
import { UserRolesCell } from '@/app/dashboard/users/UserRolesCell'; // We might want to move this later too
import { UsersActionsMenu } from './UsersActionsMenu';
import { pt } from '@/locales/pt';
import { getUserAvatarUrl } from '@/lib/utils';

interface GetColumnsProps {
  onEdit: (user: UserAdminResponseDto) => void;
  onBan: (user: UserAdminResponseDto) => void;
  onRestore: (user: UserAdminResponseDto) => void;
}

export const getColumns = ({
  onEdit,
  onBan,
  onRestore,
}: GetColumnsProps): ColumnDef<UserAdminResponseDto>[] => {
  const t = pt.dashboard.users.table;

  return [
    {
      accessorKey: 'name',
      header: t.user,
      cell: ({ row }) => {
        const user = row.original;
        const initials =
          user.name
            ?.split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U';

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={getUserAvatarUrl(user.icon)} alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'roles',
      header: t.roles,
      cell: ({ row }) => <UserRolesCell roles={row.getValue('roles')} />,
    },
    {
      accessorKey: 'deactivatedAt',
      header: t.status,
      cell: ({ row }) => {
        const deactivatedAt = row.getValue('deactivatedAt');
        const isActive = !deactivatedAt;
        return (
          <Badge
            variant={isActive ? 'outline' : 'destructive'}
            className={
              isActive
                ? 'gap-1 pr-2 bg-green-100 text-green-700 border-green-200'
                : 'gap-1 pr-2'
            }
          >
            {isActive ? (
              <>
                <CheckCircle2 className="h-3 w-3" />{' '}
                {pt.common.statusLabels.active}
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />{' '}
                {pt.common.statusLabels.inactive}
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'points',
      header: t.points,
      cell: ({ row }) => (
        <div className="font-medium pl-2">{row.getValue('points')}</div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t.registeredAt,
      cell: ({ row }) => {
        return (
          <span className="text-xs text-muted-foreground">
            {new Date(row.getValue('createdAt')).toLocaleDateString()}
          </span>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <UsersActionsMenu
          user={row.original}
          onEdit={onEdit}
          onBan={onBan}
          onRestore={onRestore}
        />
      ),
    },
  ];
};
