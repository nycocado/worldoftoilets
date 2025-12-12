'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { pt } from '@/locales/pt';
import type { UserAdminResponseDto } from '@/types/user';

interface UserRestoreDialogProps {
  user: UserAdminResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function UserRestoreDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
}: UserRestoreDialogProps) {
  const t = pt.dashboard.users.dialogs.restore;
  const tCommon = pt.common;

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription
            dangerouslySetInnerHTML={{
              __html: t.description.replace('{name}', user.name),
            }}
          />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {t.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
