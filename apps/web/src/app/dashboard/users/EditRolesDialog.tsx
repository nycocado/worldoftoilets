'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { assignRoles, removeRoles } from '@/lib/api/admin';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Shield, User, Building2, ShieldAlert } from 'lucide-react';
import type { UserAdminResponseDto } from '@/types/user';
import type { Role } from '@/types/api';

// Define available roles structure
const AVAILABLE_ROLES = {
  admin: [
    { id: 'users-administrator', label: 'Administrador de Usuários' },
    { id: 'toilets-administrator', label: 'Administrador de Casas de Banho' },
    { id: 'comments-administrator', label: 'Administrador de Comentários' },
    { id: 'partners-administrator', label: 'Administrador de Parceiros' },
  ],
  user: [
    { id: 'comments-user', label: 'Comentar' },
    { id: 'report-comments-user', label: 'Denunciar Comentários' },
    { id: 'reaction-user', label: 'Reagir a Comentários' },
    { id: 'report-toilets-user', label: 'Denunciar Banheiros' },
    { id: 'suggest-toilets-user', label: 'Sugerir Banheiros' },
    { id: 'report-users-user', label: 'Denunciar Usuários' },
  ],
  dead: [
    { id: 'dead-administrator', label: 'Administrador Banido' },
    { id: 'dead-user', label: 'Usuário Banido' },
  ],
};

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

      // Scenario 1: Deselecting a role
      if (isCurrentlySelected) {
        return prev.filter((id) => id !== roleId);
      }

      // Scenario 2: Selecting a Dead Role
      if (isDeadRole) {
        // Selecting a dead role clears EVERYTHING else and sets only this dead role
        return [roleId];
      }

      // Scenario 3: Selecting a Normal Role while a Dead Role is active
      if (hasDeadRole) {
        // Remove all dead roles, add the new normal role
        const cleanRoles = prev.filter((r) => !DEAD_ROLES.includes(r));
        return [...cleanRoles, roleId];
      }

      // Scenario 4: Normal selection
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

      // Execute updates in parallel
      const promises = [];
      if (toAdd.length > 0) {
        promises.push(assignRoles(user.publicId, toAdd));
      }
      if (toRemove.length > 0) {
        promises.push(removeRoles(user.publicId, toRemove));
      }

      await Promise.all(promises);

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update roles', error);
      // Handle error (toast, etc)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Gerenciar Cargos e Permissões</DialogTitle>
          <DialogDescription>
            Editando permissões para <b>{user?.name}</b> ({user?.email})
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-6 py-4">
            {/* Admin Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="h-4 w-4 text-purple-600" />
                <h4 className="font-semibold text-sm text-purple-900 dark:text-purple-300">
                  Administração
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
                  Permissões de Utilizador
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
                  Banimento de Utilizador
                </h4>
              </div>
              <p className="text-xs text-red-600 dark:text-red-300 mb-3">
                Selecionar uma opção de banimento irá{' '}
                <strong>remover todos os outros cargos</strong> do utilizador.
              </p>
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
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Alterações'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
