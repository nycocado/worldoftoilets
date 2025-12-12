'use client';

import { useState, useEffect } from 'react';
import { assignRoles, removeRoles } from '@/lib/api/admin';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { pt } from '@/locales/pt';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Shield, User, ShieldAlert } from 'lucide-react';
import type { UserAdminResponseDto } from '@/types/user';

const DEAD_ROLES = ['dead-user', 'dead-administrator'];

interface EditRolesDialogProps {
  user: UserAdminResponseDto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditRolesDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: EditRolesDialogProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const tRoles = pt.roles;

  const AVAILABLE_ROLES = {
    admin: [
      { id: 'users-administrator', label: tRoles.admin['users-administrator'] },
      {
        id: 'toilets-administrator',
        label: tRoles.admin['toilets-administrator'],
      },
      {
        id: 'comments-administrator',
        label: tRoles.admin['comments-administrator'],
      },
      {
        id: 'partners-administrator',
        label: tRoles.admin['partners-administrator'],
      },
    ],
    user: [
      { id: 'comments-user', label: tRoles.user['comments-user'] },
      {
        id: 'report-comments-user',
        label: tRoles.user['report-comments-user'],
      },
      { id: 'reaction-user', label: tRoles.user['reaction-user'] },
      { id: 'report-toilets-user', label: tRoles.user['report-toilets-user'] },
      {
        id: 'suggest-toilets-user',
        label: tRoles.user['suggest-toilets-user'],
      },
      { id: 'report-users-user', label: tRoles.user['report-users-user'] },
    ],
    dead: [
      { id: 'dead-administrator', label: tRoles.dead['dead-administrator'] },
      { id: 'dead-user', label: tRoles.dead['dead-user'] },
    ],
  };

  useEffect(() => {
    if (user && open) {
      setSelectedRoles(user.roles.map((r) => r.apiName));
    }
  }, [user, open]);

  const handleToggleRole = (roleId: string) => {
    setSelectedRoles((prev) => {
      const isCurrentlySelected = prev.includes(roleId);
      const isDeadRole = DEAD_ROLES.includes(roleId);
      const hasDeadRole = prev.some((r) => DEAD_ROLES.includes(r));

      if (isCurrentlySelected) {
        return prev.filter((id) => id !== roleId);
      }

      if (isDeadRole) {
        return [roleId];
      }

      if (hasDeadRole) {
        const cleanRoles = prev.filter((r) => !DEAD_ROLES.includes(r));
        return [...cleanRoles, roleId];
      }

      return [...prev, roleId];
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const originalRoles = user.roles.map((r) => r.apiName);

      const toAdd = selectedRoles.filter((r) => !originalRoles.includes(r));
      const toRemove = originalRoles.filter((r) => !selectedRoles.includes(r));

      const promises = [];
      if (toAdd.length > 0) {
        promises.push(assignRoles(user.publicId, toAdd));
      }
      if (toRemove.length > 0) {
        promises.push(removeRoles(user.publicId, toRemove));
      }

      await Promise.all(promises);

      toast.success(pt.dashboard.users.toasts.updateRolesSuccess);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update roles', error);
      toast.error(pt.dashboard.users.toasts.updateRolesError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {pt.dashboard.users.dialogs.editRoles.title}
          </DialogTitle>
          <DialogDescription
            dangerouslySetInnerHTML={{
              __html: pt.dashboard.users.dialogs.editRoles.description.replace(
                '{name}',
                user?.name || '',
              ),
            }}
          />
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Admin Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-300">
                  {tRoles.admin.title}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_ROLES.admin.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={role.id}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleToggleRole(role.id)}
                    />
                    <Label
                      htmlFor={role.id}
                      className="text-sm cursor-pointer font-normal"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* User Permissions Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <User className="h-4 w-4 text-slate-600" />
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-300">
                  {tRoles.user.title}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_ROLES.user.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={role.id}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleToggleRole(role.id)}
                    />
                    <Label
                      htmlFor={role.id}
                      className="text-sm cursor-pointer font-normal"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Banimento Section */}
            <div className="space-y-3 p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-950/20 dark:border-red-700">
              <div className="flex items-center gap-2 pb-2 border-b border-red-200 dark:border-red-800">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                <h4 className="font-semibold text-sm text-red-700 dark:text-red-400">
                  {tRoles.dead.title}
                </h4>
              </div>
              <p
                className="text-xs text-red-600 dark:text-red-300 mb-3"
                dangerouslySetInnerHTML={{ __html: tRoles.dead.warning }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AVAILABLE_ROLES.dead.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-red-100/50 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Checkbox
                      id={role.id}
                      checked={selectedRoles.includes(role.id)}
                      onCheckedChange={() => handleToggleRole(role.id)}
                      className="border-red-400 data-[state=checked]:bg-red-500 data-[state=checked]:text-red-50"
                    />
                    <Label
                      htmlFor={role.id}
                      className="text-sm cursor-pointer font-normal text-red-700 dark:text-red-300"
                    >
                      {role.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {pt.common.cancel}
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {pt.common.loading}
              </>
            ) : (
              pt.common.save
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
