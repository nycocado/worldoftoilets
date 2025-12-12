'use client';

import { MoreHorizontal, UserCog, RotateCcw, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { UserAdminResponseDto } from '@/types/user';
import { pt } from '@/locales/pt';

interface UsersActionsMenuProps {
  user: UserAdminResponseDto;
  onEdit: (user: UserAdminResponseDto) => void;
  onBan: (user: UserAdminResponseDto) => void;
  onRestore: (user: UserAdminResponseDto) => void;
}

export function UsersActionsMenu({
  user,
  onEdit,
  onBan,
  onRestore,
}: UsersActionsMenuProps) {
  const isBanned = !!user.deactivatedAt;
  const t = pt.common;
  const tUsers = pt.dashboard.users.actions;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Abrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t.actions}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(user.publicId)}
        >
          {t.copyId}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(user)}>
          <UserCog className="mr-2 h-4 w-4" /> {tUsers.editRoles}
        </DropdownMenuItem>

        {isBanned ? (
          <DropdownMenuItem
            className="text-green-600 focus:text-green-600 focus:bg-green-50"
            onClick={() => onRestore(user)}
          >
            <RotateCcw className="mr-2 h-4 w-4" /> {tUsers.restoreUser}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={() => onBan(user)}
          >
            <ShieldAlert className="mr-2 h-4 w-4" /> {tUsers.banUser}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
